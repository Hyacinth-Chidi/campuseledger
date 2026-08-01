import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";
import { logAction } from "@/lib/audit";
import { sendStudentInviteEmail } from "@/lib/email";

const ACTIVATION_TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("institution");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const institution = await User.findById(auth.userId);
  if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

  const student = await User.findOne({ _id: id, institutionId: auth.userId, role: "student" })
    .select("+activationToken +activationTokenExpiry");
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  if (student.status !== "invited") {
    return NextResponse.json({ error: "Student is already active" }, { status: 400 });
  }

  // Generate a new token to reset the expiration
  const activationToken = crypto.randomBytes(32).toString("base64url");
  student.activationToken = activationToken;
  student.activationTokenExpiry = new Date(Date.now() + ACTIVATION_TTL_MS);
  await student.save();

  await logAction({
    action: "student.reinvited",
    actorId: auth.userId,
    actorRole: "institution",
    targetType: "User",
    targetId: student._id,
    metadata: { email: student.email },
  });

  const activationLink = `/student/activate/${activationToken}`;
  const origin = `${req.nextUrl.protocol}//${req.headers.get("host")}`;
  const fullActivationUrl = `${origin}${activationLink}`;

  // Send invite email (fire and forget)
  sendStudentInviteEmail(
    student.email as string, 
    (student.name as string) || "Student", 
    fullActivationUrl, 
    (institution.institutionName as string) || "An Institution"
  ).catch(console.error);

  return NextResponse.json({ success: true, message: "Invitation resent successfully" });
}
