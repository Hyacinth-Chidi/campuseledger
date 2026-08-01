import { PasswordLoginForm } from "@/components/shared/password-login-form";
import { AuthShell } from "@/components/shared/AuthShell";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <AuthShell tagline="Manage network rules and verify institution authenticity.">
      <div className="bg-white/80 backdrop-blur-xl border border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="size-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-100/50">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Admin accounts are created via the seed script, not through signup.
          </p>
        </div>
        <PasswordLoginForm role="admin" dashboardPath="/admin/dashboard" />
      </div>
    </AuthShell>
  );
}
