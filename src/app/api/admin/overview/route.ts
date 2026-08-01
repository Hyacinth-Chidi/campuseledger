import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Credential } from "@/models/Credential";
import { AuditLog } from "@/models/AuditLog";
import { requireRole } from "@/lib/authGuard";

export async function GET() {
  const auth = await requireRole("admin");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const totalInstitutions = await User.countDocuments({ role: "institution" });
    const pendingInstitutions = await User.countDocuments({ role: "institution", approved: false });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCredentials = await Credential.countDocuments();

    // Fetch the 10 most recent activity logs and populate the actor's details
    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("actorId", "institutionName email name role")
      .lean();

    return NextResponse.json({
      stats: {
        totalInstitutions,
        pendingInstitutions,
        totalStudents,
        totalCredentials,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Failed to fetch admin overview stats", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
