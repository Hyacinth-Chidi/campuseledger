import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { generateEdKeyPair } from "@/lib/keys";
import { encryptKey } from "@/lib/crypto";
import { logAction } from "@/lib/audit";

const schema = z.object({
  institutionName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { institutionName, email, password } = parsed.data;

  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  // Generate the institution's signing keypair now, so it's ready the
  // moment an admin approves the account.
  const { publicKeyJwk, privateKeyJwk } = await generateEdKeyPair();

  const institution = await User.create({
    role: "institution",
    institutionName,
    email,
    passwordHash,
    approved: false,
    signingPublicKey: publicKeyJwk,
    signingPrivateKey: encryptKey(privateKeyJwk),
  });

  await logAction({
    action: "institution.signup",
    targetType: "User",
    targetId: institution._id,
    metadata: { institutionName, email },
  });

  return NextResponse.json({
    success: true,
    message: "Signup received. Your account needs admin approval before you can log in.",
  });
}
