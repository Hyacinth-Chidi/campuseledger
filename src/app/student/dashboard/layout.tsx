import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentDashboardShell>
      {children}
    </StudentDashboardShell>
  );
}
