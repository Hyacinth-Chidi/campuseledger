import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { SecurityClient } from "./security-client";
import { redirect } from "next/navigation";

export default async function SecurityPage() {
  const session = await getSession();
  if (!session.userId || session.role !== "student") {
    redirect("/student/login");
  }

  await connectDB();
  const student = await User.findById(session.userId);
  if (!student) {
    redirect("/student/login");
  }

  const hasBiometrics = student.webauthnCredentials && student.webauthnCredentials.length > 0;

  return <SecurityClient hasBiometrics={hasBiometrics} />;
}
