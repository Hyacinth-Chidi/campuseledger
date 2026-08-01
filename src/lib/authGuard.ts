import { getSession, type SessionData } from "@/lib/session";

export async function requireRole(
  role: SessionData["role"]
): Promise<{ userId: string } | null> {
  const session = await getSession();
  if (!session.userId || session.role !== role) return null;
  return { userId: session.userId };
}
