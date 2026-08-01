import { requireUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { StudentShareClient } from "./student-share-client";

export default async function StudentSharePage() {
  const student = await requireUser("student");
  await connectDB();

  const credentials = await Credential.find({ holderId: student._id, status: "active" })
    .populate("issuerId", "institutionName")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <StudentShareClient credentials={JSON.parse(JSON.stringify(credentials))} />
  );
}
