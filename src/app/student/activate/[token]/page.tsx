"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell } from "@/components/shared/AuthShell";
import { Loader2, KeyRound, ShieldAlert } from "lucide-react";

export default function ActivatePage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Activation failed");
      router.push("/student/dashboard/security");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Activation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell tagline="Secure your digital student wallet.">
      <div className="w-full">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100">
            <KeyRound className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Activate Account</h1>
          <p className="text-base text-slate-500 max-w-sm">
            Set a strong password to secure your decentralized identity. You can enable biometric login on the next step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 rounded-xl animate-in fade-in slide-in-from-top-2">
              <ShieldAlert className="size-4 mr-2" />
              <AlertDescription className="font-medium text-[15px]">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[15px] font-semibold text-slate-700">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-14 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl text-lg transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-[15px] font-semibold text-slate-700">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="h-14 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl text-lg transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-xl text-base font-semibold transition-all mt-4" 
            disabled={loading}
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "Secure & Activate Account"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
