import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { checkAuthenticationResponse } from "@/lib/webauthn";
import { getSession } from "@/lib/session";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email: string; response: AuthenticationResponseJSON };

  await connectDB();
  const student = await User.findOne({ email: body.email, role: "student" }).select(
    "+currentChallenge"
  );

  if (!student || !student.currentChallenge) {
    return NextResponse.json({ error: "No pending login challenge" }, { status: 400 });
  }
  if (student.suspended) {
    return NextResponse.json({ error: "This account has been suspended." }, { status: 403 });
  }

  const stored = student.webauthnCredentials.find((c) => c.credentialId === body.response.id);
  if (!stored) {
    return NextResponse.json({ error: "Unrecognized credential" }, { status: 400 });
  }

  let verification;
  try {
    verification = await checkAuthenticationResponse({
      response: body.response,
      expectedChallenge: student.currentChallenge,
      credential: {
        credentialId: stored.credentialId,
        publicKey: stored.publicKey,
        counter: stored.counter,
        transports: stored.transports,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 400 }
    );
  }

  if (!verification.verified) {
    return NextResponse.json({ error: "Biometric verification failed" }, { status: 400 });
  }

  stored.counter = verification.authenticationInfo.newCounter;
  student.currentChallenge = undefined;
  await student.save();

  const session = await getSession();
  session.userId = student._id.toString();
  session.role = "student";
  await session.save();

  return NextResponse.json({ success: true });
}
