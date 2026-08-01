import Link from "next/link";
import { ShieldCheck, Fingerprint, Award, Key, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface AuthShellProps {
  children: React.ReactNode;
  tagline?: React.ReactNode;
}

export function AuthShell({ children, tagline = "Decentralized identity for the modern campus." }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Branded Left Side (Hidden on small screens) */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-8 lg:p-12 relative overflow-hidden border-r border-indigo-100/50">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />

        <div>
          <Link href="/" className="flex items-center mb-6 w-fit hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="CampusLedger Logo" width={180} height={45} className="object-contain" />
          </Link>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight leading-snug text-slate-900 max-w-md">
            {tagline}
          </h2>
        </div>

        {/* Dynamic Graphic Centerpiece */}
        <div className="relative flex-1 flex items-center justify-center my-8 w-full min-h-[250px]">
          {/* Pulsing background circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-blue-100/20 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-blue-100/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

          {/* Central Shield */}
          <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100">
            <ShieldCheck className="size-10 text-blue-600" />
          </div>

          {/* Floating Orbit Elements */}
          <div className="absolute top-[20%] left-[25%] bg-white p-2.5 rounded-xl shadow-lg border border-slate-100 animate-[bounce_4s_infinite]">
            <Award className="size-5 text-amber-500" />
          </div>
          <div className="absolute bottom-[25%] left-[20%] bg-white p-2 rounded-lg shadow-md border border-slate-100 animate-[bounce_5s_infinite_1s]">
            <Key className="size-4 text-indigo-500" />
          </div>
          <div className="absolute top-[35%] right-[20%] bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-[bounce_6s_infinite_2s]">
            <Fingerprint className="size-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 md:p-12 bg-slate-50 relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 md:top-8 md:left-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors group bg-white/50 px-3 py-1.5 rounded-full border border-slate-200/50 hover:border-blue-200 hover:bg-blue-50"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="w-full max-w-sm">
          {/* Mobile Header (Hidden on md) */}
          <div className="md:hidden flex flex-col items-center mb-8 text-center">
            <Link href="/" className="flex items-center mb-3">
              <Image src="/logo.png" alt="CampusLedger Logo" width={160} height={40} className="object-contain" />
            </Link>
            <p className="text-sm font-medium text-slate-600 px-4">{tagline}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
