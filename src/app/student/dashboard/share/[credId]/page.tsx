import { notFound } from "next/navigation";
import { requireUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongodb";
import { Credential } from "@/models/Credential";
import { generateCredentialQR } from "@/lib/qrcode";
import { StudentShareClient } from "./student-share-client";

export default async function ShareCredentialPage({
  params,
}: {
  params: Promise<{ credId: string }>;
}) {
  const student = await requireUser("student");
  const { credId } = await params;

  await connectDB();
  const credential = await Credential.findOne({ _id: credId, holderId: student._id });
  if (!credential) notFound();

  const credentialId = credential._id.toString();
  const qrDataUrl = await generateCredentialQR(credentialId);

  return (
    <StudentShareClient 
      credentialTitle={credential.title} 
      credentialId={credentialId} 
      qrDataUrl={qrDataUrl} 
    />
  );
}
