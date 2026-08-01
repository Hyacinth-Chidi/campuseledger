import { requireUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { StudentCredentialsClient } from "./student-credentials-client";

export default async function StudentCredentialsPage() {
  const student = await requireUser("student");
  await connectDB();

  const credentials = await Credential.find({ holderId: student._id })
    .populate("issuerId", "institutionName")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <StudentCredentialsClient credentials={JSON.parse(JSON.stringify(credentials))} />
  );
}
