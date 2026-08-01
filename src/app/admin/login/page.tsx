import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PasswordLoginForm } from "@/components/shared/password-login-form";
import { AuthShell } from "@/components/shared/AuthShell";

export default function AdminLoginPage() {
  return (
    <AuthShell tagline="Manage network rules and verify institution authenticity.">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
          <CardDescription>
            Admin accounts are created via the seed script, not through signup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordLoginForm role="admin" dashboardPath="/admin/dashboard" />
        </CardContent>
      </Card>
    </AuthShell>
  );
}
