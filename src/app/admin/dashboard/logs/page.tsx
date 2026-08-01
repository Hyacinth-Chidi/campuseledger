import { requireUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { AdminLogsClient } from "./admin-logs-client";

export default async function AdminLogsPage() {
  await requireUser("admin");
  await connectDB();

  // Fetch all recent activity for the system
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("actorId", "name email institutionName")
    .lean();

  return (
    <AdminLogsClient logs={JSON.parse(JSON.stringify(logs))} />
  );
}
