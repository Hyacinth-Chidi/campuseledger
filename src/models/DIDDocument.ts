import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const didDocumentSchema = new Schema(
  {
    did: { type: String, required: true, unique: true, index: true }, // e.g. did:key:z6Mk...
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    publicKey: { type: String, required: true }, // JWK or base64url public key
    privateKey: { type: String, required: true, select: false }, // held on the student's behalf for this demo
  },
  { timestamps: true }
);

export type DIDDocumentDoc = InferSchemaType<typeof didDocumentSchema>;

export const DIDDocument: Model<DIDDocumentDoc> =
  (mongoose.models.DIDDocument as Model<DIDDocumentDoc>) ||
  mongoose.model<DIDDocumentDoc>("DIDDocument", didDocumentSchema);
