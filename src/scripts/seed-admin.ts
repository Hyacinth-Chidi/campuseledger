import mongoose from "mongoose";
import { User } from "../models/User";
import { hashPassword } from "../lib/password";

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!uri || !email || !password) {
    console.error(
      "Missing MONGODB_URI, ADMIN_SEED_EMAIL, or ADMIN_SEED_PASSWORD in your .env file."
    );
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await User.findOne({ email, role: "admin" });
  if (existing) {
    console.log(`Admin account already exists for ${email}. No changes made.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await hashPassword(password);
  await User.create({
    role: "admin",
    email,
    passwordHash,
  });

  console.log(`Admin account created for ${email}. You can now log in at /admin/login.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
