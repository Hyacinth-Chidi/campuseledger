import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { buildAuthenticationOptions } from "@/lib/webauthn";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();
  const student = await User.findOne({ email: parsed.data.email, role: "student" });

  if (!student || student.webauthnCredentials.length === 0) {
    return NextResponse.json(
      { error: "No biometric credential registered for this account" },
      { status: 404 }
    );
  }

  const options = await buildAuthenticationOptions({
    allowCredentials: student.webauthnCredentials.map((c) => ({
      credentialId: c.credentialId,
      publicKey: c.publicKey,
      counter: c.counter,
      transports: c.transports,
    })),
  });

  student.currentChallenge = options.challenge;
  await student.save();

  return NextResponse.json(options);
}
