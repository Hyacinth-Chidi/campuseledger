import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { buildAuthenticationOptions } from "@/lib/webauthn";

export async function GET() {
  // Public endpoint — no authentication required.
  // Anyone can initiate a biometric verification scan.
  const options = await buildAuthenticationOptions({
    allowCredentials: [],
  });

  // Store the challenge in the anonymous session so we can verify the signature later
  const session = await getSession();
  session.webauthnChallenge = options.challenge;
  await session.save();

  return NextResponse.json(options);
}
