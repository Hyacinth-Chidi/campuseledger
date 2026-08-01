import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { getSession } from "@/lib/session";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { token, password } = parsed.data;

  await connectDB();
  const student = await User.findOne({ activationToken: token, role: "student" }).select(
    "+activationToken +activationTokenExpiry"
  );

  if (!student) {
    return NextResponse.json({ error: "Invalid or already-used activation link" }, { status: 400 });
  }
  if (!student.activationTokenExpiry || student.activationTokenExpiry < new Date()) {
    return NextResponse.json({ error: "This activation link has expired" }, { status: 400 });
  }

  student.passwordHash = await hashPassword(password);
  student.status = "active";
  student.activationToken = undefined;
  student.activationTokenExpiry = undefined;
  await student.save();

  const session = await getSession();
  session.userId = student._id.toString();
  session.role = "student";
  await session.save();

  return NextResponse.json({ success: true });
}
