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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200 rounded-lg p-3">
          <AlertDescription className="font-medium text-sm">{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="h-10 text-sm bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm placeholder:text-slate-400"
          placeholder="admin@campusledger.com"
          required 
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10 text-sm bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm placeholder:text-slate-400"
          placeholder="••••••••"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="group w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 text-sm font-semibold transition-all duration-200 mt-2 text-white" 
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        {loading ? "Logging in..." : <>Log In <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" /></>}
      </Button>
    </form>
  );
}
