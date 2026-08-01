import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
      <Card className="w-full border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-2 sm:p-4 bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto bg-blue-50 size-12 rounded-2xl flex items-center justify-center mb-2 border border-blue-100">
            <Building2 className="size-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Institution Login</CardTitle>
          <CardDescription className="text-slate-500">
            Access your issuer portal to manage credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordLoginForm role="institution" dashboardPath="/institution/dashboard" />
        </CardContent>
        <CardFooter className="flex justify-center text-[13.5px] text-slate-500 pb-4">
          New institution?{" "}
          <Link href="/institution/signup" className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors">
            Request an account
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
