import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";
import { buildRegistrationOptions } from "@/lib/webauthn";

export async function POST() {
  const auth = await requireRole("student");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const student = await User.findById(auth.userId);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const options = await buildRegistrationOptions({
    userId: student._id.toString(),
    email: student.email,
    existingCredentials: student.webauthnCredentials.map((c) => ({
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
