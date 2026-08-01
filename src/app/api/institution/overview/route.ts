import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Credential } from "@/models/Credential";
import { AuditLog } from "@/models/AuditLog";
import { requireUser } from "@/lib/currentUser";

export async function GET() {
  try {
    const institution = await requireUser("institution");
    await connectDB();

    const [studentCount, totalCredentials, activeCredentials, recentActivity] = await Promise.all([
      User.countDocuments({ institutionId: institution._id, role: "student" }),
      Credential.countDocuments({ issuerId: institution._id }),
      Credential.countDocuments({ issuerId: institution._id, status: "active" }),
      AuditLog.find({ actorId: institution._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("targetId", "name email")
        .lean(),
    ]);

    const revokedCount = totalCredentials - activeCredentials;

    return NextResponse.json({
      stats: {
        studentCount,
        totalCredentials,
        activeCredentials,
        revokedCount,
      },
      recentActivity,
    });
  } catch (error: any) {
    console.error("Institution Overview Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
