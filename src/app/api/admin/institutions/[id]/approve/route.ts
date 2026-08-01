import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";
import { logAction } from "@/lib/audit";
import { sendInstitutionApprovedEmail } from "@/lib/email";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("admin");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const institution = await User.findOne({ _id: id, role: "institution" });
  if (!institution) return NextResponse.json({ error: "Not found" }, { status: 404 });

  institution.approved = true;
  await institution.save();

  await logAction({
    action: "institution.approved",
    actorId: auth.userId,
    actorRole: "admin",
    targetType: "User",
    targetId: institution._id,
  });

  // Send approval email (fire and forget)
  sendInstitutionApprovedEmail(institution.email, institution.institutionName || "Institution").catch(console.error);

  return NextResponse.json({ success: true });
}
