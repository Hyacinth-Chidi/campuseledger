import { requireUser } from "@/lib/currentUser";
import { InstitutionDashboardShell } from "@/components/institution/InstitutionDashboardShell";

export default async function InstitutionDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const institution = await requireUser("institution");

  return (
    <InstitutionDashboardShell institution={JSON.parse(JSON.stringify(institution))}>
      {children}
    </InstitutionDashboardShell>
  );
}
