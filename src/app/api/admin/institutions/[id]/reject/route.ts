import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";
import { logAction } from "@/lib/audit";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("admin");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const institution = await User.findOne({ _id: id, role: "institution" });
  if (!institution) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (institution.approved) {
    return NextResponse.json(
      { error: "Already approved — suspend it instead of rejecting" },
      { status: 400 }
    );
  }

  await logAction({
    action: "institution.rejected",
    actorId: auth.userId,
    actorRole: "admin",
    targetType: "User",
    targetId: institution._id,
    metadata: { email: institution.email, institutionName: institution.institutionName },
  });

  await institution.deleteOne();

  return NextResponse.json({ success: true });
}
