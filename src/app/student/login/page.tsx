"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { startAuthentication } from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, ShieldCheck, Lock, Mail, EyeOff, Eye, ArrowRight, GraduationCap, Info, CheckCircle2, Award, ArrowLeft, Loader2 } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "student" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/student/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleBiometricLogin() {
    setError(null);
    if (!email) {
      setError("Enter your email first, then tap biometric login.");
      return;
    }
    setLoading(true);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/auth-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error || "No biometric registered");

      const authResponse = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/webauthn/auth-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, response: authResponse }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Biometric login failed");

      router.push("/student/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Biometric login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#f8faff] font-sans">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-gradient-to-br from-[#f1f6ff] to-[#e4edff] p-8 lg:px-16 lg:py-12 flex-col justify-between">

        {/* Animated Background Decorative Pattern */}
        <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-[45%] z-0 flex items-center justify-center">
          <div className="absolute w-[800px] h-[800px] rounded-full border-[2px] border-dashed border-blue-400/40 animate-[spin_90s_linear_infinite]" />
          <div className="absolute w-[600px] h-[600px] rounded-full border-[2px] border-dashed border-blue-500/50 bg-blue-50/30 animate-[spin_60s_linear_infinite_reverse]" />
          <div className="absolute w-[400px] h-[400px] rounded-full border-[1.5px] border-blue-400/70 bg-blue-50/40 animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-500/25 blur-[80px] animate-[pulse_8s_ease-in-out_infinite]" />
        </div>
        <div className="absolute top-[10%] right-[15%] bg-white rounded-full p-2.5 shadow-md border border-slate-100 z-10 hidden lg:block">
          <ShieldCheck className="size-6 text-[#1d4ed8]" />
        </div>

        {/* Logo at Top Left */}
        <div className="relative z-20 pt-4">
          <Link href="/" className="flex items-center w-fit hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="CampusLedger Logo" width={200} height={50} className="object-contain" />
          </Link>
        </div>

        {/* Title Centered Vertically */}
        <div className="relative z-20 flex-1 flex flex-col justify-center">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-6 lg:p-8 rounded-[24px] shadow-[0_8px_32px_rgb(0,0,0,0.04)] w-fit max-w-[400px]">
            <h1 className="text-3xl lg:text-[2.5rem] font-bold tracking-tight text-[#0f172a] leading-[1.15]">
              Hold your <br />
              <span className="text-[#1d4ed8]">academic identity</span><br />
              in your pocket.
            </h1>
          </div>
        </div>

        {/* Hero Image Overlay */}
        <Image
          src="/students.webp"
          alt="Students looking at credentials on a phone"
          fill
          className="object-cover object-[center_20%]"
          priority
        />

        {/* Floating UI Element overlapping the image */}
        <div className="hidden lg:block absolute bottom-8 right-8 xl:bottom-12 xl:right-12 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/60 w-[260px] z-20">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-4 text-[#1d4ed8]" />
            <span className="text-[13px] font-bold text-slate-900">Student Credential</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-green-600 font-semibold mb-3">
            <CheckCircle2 className="size-3.5" /> Verified
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">Name</p>
              <p className="text-[13px] font-bold text-slate-800 mb-2">Chinedu Emmanuel</p>
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">ID</p>
              <p className="text-[10px] font-mono font-semibold text-slate-700">CL-24-7F3A-9B21</p>
            </div>
            <div className="p-1.5 rounded-full bg-blue-50 text-[#1d4ed8] mb-0.5 border border-blue-100">
              <div className="bg-[#1d4ed8] rounded-full p-1 text-white shadow-md shadow-blue-500/20">
                <Award className="size-4" />
              </div>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gradient-to-r from-[#1d4ed8] to-blue-400 rounded-full" />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white relative">

        {/* Back Button (Absolute) */}
        <Link href="/"
          className="absolute top-6 left-6 md:top-8 md:left-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors group bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/50 hover:border-blue-200"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <div className="w-full max-w-sm mt-12 lg:mt-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-6 text-center">
            <Link href="/" className="flex items-center mb-2">
              <Image src="/logo.png" alt="CampusLedger Logo" width={160} height={40} className="object-contain" />
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Login</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Enter your credentials to access your wallet.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50 p-3 text-red-700">
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="size-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="pl-9 h-10 text-sm bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
                <Link href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="size-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-9 pr-9 h-10 text-sm bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="group w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 text-sm font-semibold transition-all duration-200 mt-2 text-white" disabled={loading}>
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {loading ? "Logging in..." : <>Sign In <ArrowRight className="ml-1.5 size-4 group-hover:translate-x-1 transition-transform" /></>}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Or</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          {/* Biometric button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 rounded-lg text-slate-700 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm text-sm font-semibold transition-all duration-200"
            onClick={handleBiometricLogin}
            disabled={loading}
          >
            <Fingerprint className="mr-1.5 size-4 text-blue-600" /> Log in with Passkey
          </Button>

          {/* Info footer */}
          <div className="flex gap-2.5 p-3 mt-8 bg-blue-50/50 rounded-lg border border-blue-100/50 text-left">
            <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Don&apos;t have an account? Your institution invites students directly. Check your email for an activation link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
