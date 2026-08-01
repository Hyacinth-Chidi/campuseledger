import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { verifyCredentialJWT } from "@/lib/credentials";
import { logAction } from "@/lib/audit";

const schema = z.object({ credentialId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connectDB();
  const credential = await Credential.findById(parsed.data.credentialId)
    .populate("issuerId", "institutionName signingPublicKey approved suspended")
    .populate("holderId", "name email studentIdNumber");

  if (!credential) {
    await logAction({
      action: "credential.verify_attempt",
      actorRole: "public",
      metadata: { credentialId: parsed.data.credentialId, result: "not_found" },
    });
    return NextResponse.json({ result: "not_found" }, { status: 404 });
  }

  const issuer = credential.issuerId as unknown as {
    institutionName: string;
    signingPublicKey: string;
    approved: boolean;
    suspended: boolean;
  };
  const holder = credential.holderId as unknown as { name: string; email: string; studentIdNumber: string };

  const sigCheck = await verifyCredentialJWT(credential.jwt, issuer.signingPublicKey);

  const result = {
    signatureValid: sigCheck.valid,
    signatureError: sigCheck.reason,
    revoked: credential.status === "revoked",
    revokedReason: credential.revokedReason,
    issuerApproved: issuer.approved,
    issuerSuspended: issuer.suspended,
    isValid: sigCheck.valid && credential.status === "active" && issuer.approved && !issuer.suspended,
    credential: {
      title: credential.title,
      credentialType: credential.credentialType,
      claims: credential.claims,
      issuedAt: credential.createdAt,
      issuerName: issuer.institutionName,
      holderName: holder.name,
      holderStudentId: holder.studentIdNumber,
    },
  };

  await logAction({
    action: "credential.verify_attempt",
    actorRole: "public",
    targetType: "Credential",
    targetId: credential._id,
    metadata: { result: result.isValid ? "valid" : "invalid" },
  });

  return NextResponse.json(result);
}
