import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import type { Types } from "mongoose";

export async function logAction(params: {
  action: string;
  actorId?: Types.ObjectId | string;
  actorRole?: string;
  targetType?: string;
  targetId?: Types.ObjectId | string;
  metadata?: Record<string, unknown>;
}) {
  await connectDB();
  await AuditLog.create({
    action: params.action,
    actorId: params.actorId,
    actorRole: params.actorRole,
    targetType: params.targetType,
    targetId: params.targetId,
    metadata: params.metadata,
  });
}
