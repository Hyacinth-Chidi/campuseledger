import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Credential } from "@/models/Credential";
import { getSession } from "@/lib/session";
import { checkAuthenticationResponse } from "@/lib/webauthn";
import { verifyCredentialJWT } from "@/lib/credentials";
import { logAction } from "@/lib/audit";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";

export async function POST(req: NextRequest) {
  // Public endpoint — no authentication required.
  const session = await getSession();
  const expectedChallenge = session.webauthnChallenge;
  if (!expectedChallenge) {
    return NextResponse.json({ error: "Session expired or invalid challenge" }, { status: 400 });
  }

  const response = (await req.json()) as AuthenticationResponseJSON;

  await connectDB();
  
  // Find the student by the WebAuthn credential ID they just used
  const student = await User.findOne({ 
    role: "student",
    "webauthnCredentials.credentialId": response.id 
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found for this biometric signature" }, { status: 404 });
  }

  const credential = student.webauthnCredentials.find((c: any) => c.credentialId === response.id);
  if (!credential) {
    return NextResponse.json({ error: "Credential mapping error" }, { status: 500 });
  }

  try {
    const verification = await checkAuthenticationResponse({
      response,
      expectedChallenge,
      credential: {
        credentialId: credential.credentialId,
        publicKey: credential.publicKey,
        counter: credential.counter,
        transports: credential.transports,
      },
    });

    if (!verification.verified) {
      throw new Error("Biometric verification failed");
    }

    // Update counter to prevent replay attacks
    credential.counter = verification.authenticationInfo.newCounter;
    await student.save();
    
    // Clear challenge
    session.webauthnChallenge = undefined;
    await session.save();

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Biometric verification failed" },
      { status: 400 }
    );
  }

  // Find all active credentials for this student
  const studentCredentials = await Credential.find({ holderId: student._id })
    .populate("issuerId", "institutionName signingPublicKey approved suspended")
    .populate("holderId", "studentIdNumber name")
    .sort({ createdAt: -1 });

  const verifiedCredentials = await Promise.all(
    studentCredentials.map(async (cred) => {
      const issuer = cred.issuerId as any;
      const sigCheck = await verifyCredentialJWT(cred.jwt, issuer.signingPublicKey);
      
      return {
        id: cred._id,
        signatureValid: sigCheck.valid,
        signatureError: sigCheck.reason,
        revoked: cred.status === "revoked",
        revokedReason: cred.revokedReason,
        issuerApproved: issuer.approved,
        issuerSuspended: issuer.suspended,
        isValid: sigCheck.valid && cred.status === "active" && issuer.approved && !issuer.suspended,
        credential: {
          title: cred.title,
          credentialType: cred.credentialType,
          claims: cred.claims,
          issuedAt: cred.createdAt,
          issuerName: issuer.institutionName,
          holderName: (cred.holderId as any).name,
          holderStudentId: (cred.holderId as any).studentIdNumber,
        },
      };
    })
  );

  await logAction({
    action: "public.biometric_verify",
    actorRole: "public",
    targetType: "User",
    targetId: student._id,
    metadata: { 
      studentName: student.name, 
      credentialsCount: verifiedCredentials.length 
    },
  });

  return NextResponse.json({
    success: true,
    student: {
      name: student.name,
      email: student.email,
    },
    credentials: verifiedCredentials,
  });
}
