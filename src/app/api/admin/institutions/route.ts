import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireRole } from "@/lib/authGuard";

export async function GET() {
  const auth = await requireRole("admin");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const institutions = await User.aggregate([
    { $match: { role: "institution" } },
    {
      $lookup: {
        from: "users",
        let: { instId: "$_id" },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$role", "student"] }, { $eq: ["$institutionId", "$$instId"] }] } } },
          { $count: "count" },
        ],
        as: "studentCountAgg",
      },
    },
    {
      $project: {
        institutionName: 1,
        email: 1,
        approved: 1,
        suspended: 1,
        createdAt: 1,
        studentCount: { $ifNull: [{ $arrayElemAt: ["$studentCountAgg.count", 0] }, 0] },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return NextResponse.json({ institutions });
}
