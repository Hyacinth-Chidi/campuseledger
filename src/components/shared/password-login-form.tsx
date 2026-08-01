"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight } from "lucide-react";

export function PasswordLoginForm({
  role,
  dashboardPath,
}: {
  role: "institution" | "admin";
  dashboardPath: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(dashboardPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200 rounded-xl">
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="h-14 bg-slate-50/50 border-slate-200 rounded-xl text-[15px] focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm placeholder:text-slate-400"
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
          className="h-14 bg-slate-50/50 border-slate-200 rounded-xl text-[15px] focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="group w-full h-14 rounded-xl bg-[#1d4ed8] hover:bg-[#153bb5] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 text-[15px] font-semibold transition-all duration-200 mt-4" 
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
        {loading ? "Logging in..." : <>Log In <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" /></>}
      </Button>
    </form>
  );
}
