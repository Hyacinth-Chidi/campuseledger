import Link from "next/link";
import { ShieldCheck, Fingerprint, Award, Key, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface AuthShellProps {
  children: React.ReactNode;
  tagline?: React.ReactNode;
}

export function AuthShell({ children, tagline = "Decentralized identity for the modern campus." }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Branded Left Side (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-primary/5 p-12 lg:p-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div>
          <Link href="/" className="flex items-center mb-8 w-fit">
            <Image src="/logo.png" alt="CampusLedger Logo" width={240} height={60} className="object-contain" />
          </Link>
          <h2 className="text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15] text-slate-900 pb-2">
            {tagline}
          </h2>
        </div>

        {/* Dynamic Graphic Centerpiece */}
        <div className="relative flex-1 flex items-center justify-center my-12 w-full min-h-[300px]">
          {/* Pulsing background circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-primary/5 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
          
          {/* Central Shield */}
          <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl border border-blue-100">
            <ShieldCheck className="size-16 text-blue-600" />
          </div>

          {/* Floating Orbit Elements */}
          <div className="absolute top-[15%] left-[20%] bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-[bounce_4s_infinite]">
            <Award className="size-8 text-amber-500" />
          </div>
          <div className="absolute bottom-[20%] left-[15%] bg-white p-3.5 rounded-xl shadow-lg border border-slate-100 animate-[bounce_5s_infinite_1s]">
            <Key className="size-6 text-indigo-500" />
          </div>
          <div className="absolute top-[30%] right-[15%] bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-[bounce_6s_infinite_2s]">
            <Fingerprint className="size-8 text-purple-500" />
          </div>
        </div>


      </div>

      {/* Form Right Side */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 md:p-24 bg-background relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-8 left-8 md:top-10 md:left-12 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on md) */}
          <div className="md:hidden flex flex-col items-center mb-8 text-center">
            <Link href="/" className="flex items-center mb-2">
              <Image src="/logo.png" alt="CampusLedger Logo" width={200} height={50} className="object-contain" />
            </Link>
            <p className="text-base font-medium text-slate-600 px-4">{tagline}</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
