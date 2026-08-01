import { requireUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { DIDDocument } from "@/models/DIDDocument";
import { StudentDashboardClient } from "./student-dashboard-client";

export default async function StudentDashboardPage() {
  const student = await requireUser("student");
  await connectDB();

  const didDoc = await DIDDocument.findOne({ ownerId: student._id });
  const credentials = await Credential.find({ holderId: student._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return (
    <StudentDashboardClient 
      student={JSON.parse(JSON.stringify(student))} 
      didDoc={JSON.parse(JSON.stringify(didDoc))} 
      credentials={JSON.parse(JSON.stringify(credentials))} 
    />
  );
}
