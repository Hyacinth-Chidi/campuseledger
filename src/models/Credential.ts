import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const credentialSchema = new Schema(
  {
    issuerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    holderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    holderDID: { type: String, required: true },

    credentialType: { type: String, required: true }, // e.g. "Degree", "Transcript", "Certificate"
    title: { type: String, required: true }, // e.g. "B.Sc. Computer Science"
    claims: { type: Schema.Types.Mixed, required: true }, // { gpa, graduationDate, honors, ... }

    jwt: { type: String, required: true }, // the signed Verifiable Credential (JWS compact form)

    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
      index: true,
    },
    revokedAt: { type: Date },
    revokedReason: { type: String },
  },
  { timestamps: true }
);

export type CredentialDoc = InferSchemaType<typeof credentialSchema>;

export const Credential: Model<CredentialDoc> =
  (mongoose.models.Credential as Model<CredentialDoc>) ||
  mongoose.model<CredentialDoc>("Credential", credentialSchema);
