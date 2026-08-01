import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { RevocationEntry } from "@/models/RevocationEntry";
import { requireRole } from "@/lib/authGuard";
import { logAction } from "@/lib/audit";

const schema = z.object({
  credentialId: z.string().min(1),
  reason: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const auth = await requireRole("institution");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { credentialId, reason } = parsed.data;

  await connectDB();
  const credential = await Credential.findOne({ _id: credentialId, issuerId: auth.userId });
  if (!credential) {
    return NextResponse.json({ error: "Credential not found" }, { status: 404 });
  }
  if (credential.status === "revoked") {
    return NextResponse.json({ error: "Credential already revoked" }, { status: 400 });
  }

  credential.status = "revoked";
  credential.revokedAt = new Date();
  credential.revokedReason = reason;
  await credential.save();

  await RevocationEntry.create({
    credentialId: credential._id,
    revokedBy: auth.userId,
    reason,
  });

  await logAction({
    action: "credential.revoked",
    actorId: auth.userId,
    actorRole: "institution",
    targetType: "Credential",
    targetId: credential._id,
    metadata: { reason },
  });

  return NextResponse.json({ success: true });
}
