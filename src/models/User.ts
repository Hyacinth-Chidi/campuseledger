import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const webauthnCredentialSchema = new Schema(
  {
    credentialId: { type: String, required: true }, // base64url id
    publicKey: { type: String, required: true }, // base64url encoded public key
    counter: { type: Number, required: true, default: 0 },
    transports: { type: [String], default: [] },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["student", "institution", "admin"],
      required: true,
      index: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // optional once WebAuthn-only students exist

    // --- Student-only fields ---
    name: { type: String },
    studentIdNumber: { type: String },
    institutionId: { type: Schema.Types.ObjectId, ref: "User" }, // set for students
    didId: { type: Schema.Types.ObjectId, ref: "DIDDocument" },
    status: {
      type: String,
      enum: ["invited", "active"],
      default: "active",
    },
    activationToken: { type: String, select: false },
    activationTokenExpiry: { type: Date, select: false },
    webauthnCredentials: { type: [webauthnCredentialSchema], default: [] },
    currentChallenge: { type: String, select: false }, // transient WebAuthn challenge

    // --- Institution-only fields ---
    institutionName: { type: String },
    approved: { type: Boolean, default: false }, // institutions require admin approval
    suspended: { type: Boolean, default: false },
    signingPublicKey: { type: String }, // institution's credential-signing keypair
    signingPrivateKey: { type: String, select: false },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", userSchema);
