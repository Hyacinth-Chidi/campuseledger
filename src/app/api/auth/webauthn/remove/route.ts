import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";

export async function POST() {
  const auth = await requireRole("student");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const student = await User.findById(auth.userId);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  (student.webauthnCredentials as any).splice(0);
  await student.save();

  return NextResponse.json({ success: true });
}
