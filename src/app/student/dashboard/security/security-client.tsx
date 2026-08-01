"use client";

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, CheckCircle2, Shield, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SecurityClient({ hasBiometrics }: { hasBiometrics: boolean }) {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    setError(null);
    setLoading(true);
    try {
      const optionsRes = await fetch("/api/auth/webauthn/register-options", { method: "POST" });
      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error || "Could not start registration");

      const attResponse = await startRegistration({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attResponse }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Could not complete registration");

      setStatus("success");
      toast.success("Biometrics added successfully");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (!confirm("Are you sure you want to remove all biometric keys? You will need to log in with a password next time.")) return;
    
    setRemoving(true);
    try {
      const res = await fetch("/api/auth/webauthn/remove", { method: "POST" });
      if (!res.ok) throw new Error("Could not remove biometrics");
      toast.success("Biometrics removed successfully");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove biometrics");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 -z-10 w-full h-[400px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent opacity-60" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Shield className="size-6 text-blue-600" /> Security Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your authentication methods and protect your digital wallet.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="border border-indigo-50/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl transition-all duration-300 flex flex-col">
          <div className="pb-4 pt-5 px-5 border-b border-slate-100">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Lock className="size-4" />
              </div>
              Passkeys & Biometrics
            </h2>
            <p className="text-sm text-slate-500 pt-1.5">
              Register your device&apos;s fingerprint or Face ID so you can log in instantly without typing a password. Your biometric data never leaves your device.
            </p>
          </div>
          <div className="p-5 space-y-4 bg-slate-50/30">
            {error && (
              <Alert className="border-red-200 bg-red-50 text-red-900 rounded-lg py-2 px-3">
                <AlertDescription className="font-medium text-xs">{error}</AlertDescription>
              </Alert>
            )}
            {status === "success" && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 rounded-lg flex items-center gap-2 py-2 px-3">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <AlertDescription className="font-medium text-xs">Biometric login successfully enabled for this device.</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${hasBiometrics ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {hasBiometrics ? <CheckCircle2 className="size-6" /> : <Fingerprint className="size-6" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">{hasBiometrics ? "Biometrics Active" : "Add new Passkey"}</h4>
                  <p className="text-xs text-slate-500">{hasBiometrics ? "You can log in without a password" : "Fast, secure, passwordless login"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {hasBiometrics && (
                  <Button 
                    variant="outline"
                    onClick={handleRemove}
                    disabled={removing}
                    className="h-10 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
                <Button 
                  onClick={handleRegister} 
                  disabled={loading} 
                  className="w-full sm:w-auto h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-semibold text-sm transition-all"
                >
                  {loading ? "Registering..." : hasBiometrics ? "Add Another Device" : "Set up Biometrics"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
