import Link from "next/link";
import { PasswordLoginForm } from "@/components/shared/password-login-form";
import { AuthShell } from "@/components/shared/AuthShell";
import { Building2 } from "lucide-react";

export default function InstitutionLoginPage() {
  return (
    <AuthShell
      tagline={
        <>
          Issue cryptographically signed credentials <span className="text-blue-600">instantly.</span>
        </>
      }
    >
      <div className="bg-white/80 backdrop-blur-xl border border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="size-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-100/50">
            <Building2 className="size-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institution Login</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Access your issuer portal to manage credentials.
          </p>
        </div>

        <PasswordLoginForm role="institution" dashboardPath="/institution/dashboard" />

        <div className="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
          New institution?{" "}
          <Link href="/institution/signup" className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors">
            Request an account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
