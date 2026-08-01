import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["student", "institution", "admin"]),
});

export async function POST(req: NextRequest) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { email, password, role } = parsed.data;

  await connectDB();
  const user = await User.findOne({ email, role }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (role === "student" && user.status !== "active") {
    return NextResponse.json(
      { error: "Account not yet activated. Check your activation link." },
      { status: 403 }
    );
  }
  if (role === "institution" && !user.approved) {
    return NextResponse.json(
      { error: "Institution account is pending admin approval." },
      { status: 403 }
    );
  }
  if ((role === "institution" || role === "student") && user.suspended) {
    return NextResponse.json({ error: "This account has been suspended." }, { status: 403 });
  }

  const session = await getSession();
  session.userId = user._id.toString();
  session.role = role;
  await session.save();

  return NextResponse.json({ success: true });
}
