"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Building2, Loader2, ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/shared/AuthShell";
import { motion } from "framer-motion";

export default function InstitutionSignupPage() {
  const [institutionName, setInstitutionName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/institutions/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell 
        tagline={
          <>
            Issue cryptographically signed credentials <span className="text-blue-600">instantly.</span>
          </>
        }
      >
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-4 sm:p-6 text-center bg-white">
            <div className="mx-auto size-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100/50">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
              Application Received
            </CardTitle>
            <CardDescription className="text-base text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto">
              Your institution's account is pending admin approval. You will receive an email once you are verified and can begin issuing credentials.
            </CardDescription>
            <Button asChild variant="outline" className="h-12 px-8 rounded-xl font-medium text-slate-700">
              <Link href="/">Return to Home</Link>
            </Button>
          </Card>
        </motion.div>
      </AuthShell>
    );
  }

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
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Register Institution</CardTitle>
          <CardDescription className="text-slate-500">
            Create an account to start issuing credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200 rounded-xl">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="institutionName" className="text-slate-700 font-semibold text-sm">Institution Name</Label>
              <Input
                id="institutionName"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-blue-600 placeholder:text-slate-400"
                placeholder="e.g. Stanford University"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Official Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-blue-600 placeholder:text-slate-400"
                placeholder="admin@university.edu"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white border-slate-200 rounded-xl text-slate-900 focus-visible:ring-blue-600"
                required
                minLength={8}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium text-[15px] shadow-sm mt-2" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
              {loading ? "Submitting..." : <>Submit Application <ArrowRight className="ml-2 size-4" /></>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-[13.5px] text-slate-500 pb-4 pt-2">
          Already approved?{" "}
          <Link href="/institution/login" className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors">
            Log in here
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
