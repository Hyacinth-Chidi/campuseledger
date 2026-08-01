import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";
import { createDIDForUser } from "@/lib/did";
import { logAction } from "@/lib/audit";
import { sendStudentInviteEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  studentIdNumber: z.string().min(1),
  email: z.string().email(),
});

const ACTIVATION_TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

export async function POST(req: NextRequest) {
  const auth = await requireRole("institution");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, studentIdNumber, email } = parsed.data;

  await connectDB();
  
  const institution = await User.findById(auth.userId);
  if (!institution) return NextResponse.json({ error: "Institution not found" }, { status: 404 });

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const activationToken = crypto.randomBytes(32).toString("base64url");

  const student = await User.create({
    role: "student",
    name,
    studentIdNumber,
    email,
    institutionId: auth.userId,
    status: "invited",
    activationToken,
    activationTokenExpiry: new Date(Date.now() + ACTIVATION_TTL_MS),
  });

  // Every student gets their own DID + keypair the moment they're
  // provisioned — they hold and control it from here on, not the institution.
  const didDoc = await createDIDForUser(student._id);
  student.didId = didDoc._id;
  await student.save();

  await logAction({
    action: "student.invited",
    actorId: auth.userId,
    actorRole: "institution",
    targetType: "User",
    targetId: student._id,
    metadata: { email },
  });

  const activationLink = `/student/activate/${activationToken}`;
  const fullActivationUrl = `${req.nextUrl.protocol}//${req.headers.get("host")}${activationLink}`;

  // Send invite email (fire and forget)
  sendStudentInviteEmail(
    student.email, 
    student.name || "Student", 
    fullActivationUrl, 
    institution.institutionName || "An Institution"
  ).catch(console.error);

  return NextResponse.json({
    success: true,
    activationLink,
    did: didDoc.did,
  });
}

export async function GET() {
  const auth = await requireRole("institution");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const students = await User.find({ institutionId: auth.userId, role: "student" })
    .select("name email studentIdNumber status createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ students });
}
