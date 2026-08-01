import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DIDDocument } from "@/models/DIDDocument";
import { Credential } from "@/models/Credential";
import { requireRole } from "@/lib/authGuard";
import { issueCredentialJWT } from "@/lib/credentials";
import { logAction } from "@/lib/audit";
import { sendCredentialIssuedEmail } from "@/lib/email";

const schema = z.object({
  studentId: z.string().min(1),
  credentialType: z.string().min(1),
  title: z.string().min(1),
  claims: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

export async function POST(req: NextRequest) {
  const auth = await requireRole("institution");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { studentId, credentialType, title, claims } = parsed.data;

  await connectDB();

  const institution = await User.findById(auth.userId).select("+signingPrivateKey");
  if (!institution || !institution.approved || institution.suspended) {
    return NextResponse.json({ error: "Institution not authorized to issue" }, { status: 403 });
  }

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    institutionId: auth.userId,
  });
  if (!student) {
    return NextResponse.json({ error: "Student not found at your institution" }, { status: 404 });
  }

  const didDoc = await DIDDocument.findOne({ ownerId: student._id });
  if (!didDoc) {
    return NextResponse.json({ error: "Student has no DID on record" }, { status: 400 });
  }

  const issuerDID = `did:cledger:institution:${institution._id.toString()}`;

  const jwt = await issueCredentialJWT({
    issuerDID,
    issuerPrivateKeyJwk: institution.signingPrivateKey as string,
    holderDID: didDoc.did,
    credentialType,
    title,
    claims,
  });

  const credential = await Credential.create({
    issuerId: institution._id,
    holderId: student._id,
    holderDID: didDoc.did,
    credentialType,
    title,
    claims,
    jwt,
    status: "active",
  });

  await logAction({
    action: "credential.issued",
    actorId: institution._id,
    actorRole: "institution",
    targetType: "Credential",
    targetId: credential._id,
    metadata: { studentId, credentialType, title },
  });

  // Send credential issued email (fire and forget)
  sendCredentialIssuedEmail(
    student.email,
    student.name || "Student",
    title,
    institution.institutionName || "An Institution"
  ).catch(console.error);

  return NextResponse.json({ success: true, credentialId: credential._id.toString() });
}

export async function GET() {
  const auth = await requireRole("institution");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const credentials = await Credential.find({ issuerId: auth.userId })
    .populate("holderId", "name email studentIdNumber")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ credentials });
}
