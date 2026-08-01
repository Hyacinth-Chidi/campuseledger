import { requireUser } from "@/lib/currentUser";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Credential } from "@/models/Credential";
import { InstitutionDashboardClient } from "./institution-dashboard-client";

export default async function InstitutionDashboardPage() {
  const institution = await requireUser("institution");
  
  return (
    <InstitutionDashboardClient institution={JSON.parse(JSON.stringify(institution))} />
  );
}
