import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";
import { checkRegistrationResponse } from "@/lib/webauthn";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";

export async function POST(req: NextRequest) {
  const auth = await requireRole("student");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { response: RegistrationResponseJSON };

  await connectDB();
  const student = await User.findById(auth.userId).select("+currentChallenge");
  if (!student || !student.currentChallenge) {
    return NextResponse.json({ error: "No pending registration challenge" }, { status: 400 });
  }

  let verification;
  try {
    verification = await checkRegistrationResponse({
      response: body.response,
      expectedChallenge: student.currentChallenge,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 400 }
    );
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "Could not verify biometric registration" }, { status: 400 });
  }

  const { credential } = verification.registrationInfo;

  student.webauthnCredentials.push({
    credentialId: credential.id,
    publicKey: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter,
    transports: body.response.response.transports || [],
  });
  student.currentChallenge = undefined;
  await student.save();

  return NextResponse.json({ success: true });
}
