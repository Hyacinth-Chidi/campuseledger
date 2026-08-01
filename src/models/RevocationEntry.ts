import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const revocationEntrySchema = new Schema(
  {
    credentialId: { type: Schema.Types.ObjectId, ref: "Credential", required: true, index: true },
    revokedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

export type RevocationEntryDoc = InferSchemaType<typeof revocationEntrySchema>;

export const RevocationEntry: Model<RevocationEntryDoc> =
  (mongoose.models.RevocationEntry as Model<RevocationEntryDoc>) ||
  mongoose.model<RevocationEntryDoc>("RevocationEntry", revocationEntrySchema);
