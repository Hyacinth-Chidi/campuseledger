import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true, index: true }, // e.g. "institution.approved", "credential.issued"
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String },
    targetType: { type: String }, // "User" | "Credential" | ...
    targetId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export type AuditLogDoc = InferSchemaType<typeof auditLogSchema>;

export const AuditLog: Model<AuditLogDoc> =
  (mongoose.models.AuditLog as Model<AuditLogDoc>) ||
  mongoose.model<AuditLogDoc>("AuditLog", auditLogSchema);
