import { redirect } from "next/navigation";
import { getSession, type SessionData } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function requireUser(role: NonNullable<SessionData["role"]>) {
  const session = await getSession();
  if (!session.userId || session.role !== role) {
    redirect(`/${role}/login`);
  }
  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) {
    redirect(`/${role}/login`);
  }
  return user;
}
