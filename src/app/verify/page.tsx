"use client";

import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Fingerprint, ShieldCheck, Loader2, Award, CheckCircle2, XCircle, Lock, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import dynamic from "next/dynamic";
import { QrCode } from "lucide-react";

const QRScanner = dynamic(() => import("@/components/shared/QRScanner").then(mod => mod.QRScanner), { ssr: false });

interface VerifyResult {
  isValid: boolean;
  signatureValid: boolean;
  revoked: boolean;
  revokedReason?: string;
  issuerApproved: boolean;
  issuerSuspended: boolean;
  credential?: {
    title: string;
    credentialType: string;
    claims: Record<string, unknown>;
    issuerName: string;
    holderName?: string;
    holderStudentId?: string;
    issuedAt: string;
  };
}

export default function PublicVerifyPage() {
  const [credentialId, setCredentialId] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Biometric state
  const [bioLoading, setBioLoading] = useState(false);
  const [bioStudent, setBioStudent] = useState<{ name?: string; email: string } | null>(null);
  const [bioCredentials, setBioCredentials] = useState<VerifyResult[] | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setNotFound(false);
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialId }),
      });
      if (res.status === 404) {
        setNotFound(true);
        toast.error("No credential found with that ID");
        return;
      }
      const data = await res.json();
      setResult(data);
      setDialogOpen(true);
      if (data.isValid) {
        toast.success("Credential verified successfully");
      } else {
        toast.error("Credential is not valid");
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleBiometricVerify() {
    setBioStudent(null);
    setBioCredentials(null);
    setBioLoading(true);

    try {
      const optionsRes = await fetch("/api/verify/biometric/options");
      const options = await optionsRes.json();
      if (!optionsRes.ok) throw new Error(options.error || "Failed to start scan");

      const authResponse = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch("/api/verify/biometric/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authResponse),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

      setBioStudent(verifyData.student);
      setBioCredentials(verifyData.credentials);
      setDialogOpen(true);
      toast.success(`Verified identity for ${verifyData.student.name || verifyData.student.email}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBioLoading(false);
    }
  }

  function renderCredentialCard(res: VerifyResult, idx: number = 0) {
    const isSuccess = res.isValid;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.1 }}
        key={idx}
        className={`relative overflow-hidden rounded-2xl border p-0 shadow-md ${
          isSuccess ? "border-slate-200" : "border-red-200"
        } ${idx > 0 ? "mt-4" : ""}`}
      >
        {/* Verification Status Header */}
        <div className={`px-5 py-3 flex items-center justify-between border-b ${
          isSuccess ? "bg-slate-50 border-slate-100" : "bg-red-50/80 border-red-100"
        }`}>
          <div className="flex items-center gap-2">
            {isSuccess ? <ShieldCheck className="size-5 text-emerald-600" /> : <XCircle className="size-5 text-red-600" />}
            <span className={`font-semibold text-sm ${isSuccess ? "text-emerald-700" : "text-red-700"}`}>
              {isSuccess ? "Verified Credential" : "Invalid Credential"}
            </span>
          </div>
          <div className="flex gap-1.5">
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold h-5 px-1.5 ${res.signatureValid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              Sig {res.signatureValid ? "Valid" : "Invalid"}
            </Badge>
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold h-5 px-1.5 ${!res.revoked ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {!res.revoked ? "Active" : "Revoked"}
            </Badge>
          </div>
        </div>

        {/* Card Body - Looks like a physical card */}
        <div className="bg-white relative p-6">
          {/* Background subtle pattern/gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-0" />
          
          {res.credential && (
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{res.credential.title}</h3>
                  <p className="text-sm font-medium text-blue-600 mt-0.5">{res.credential.issuerName}</p>
                </div>
                <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                  <Award className="size-6 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:gap-x-8 text-xs sm:text-sm">
                {res.credential.holderName && (
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Student Name</p>
                    <p className="font-medium text-slate-800">{res.credential.holderName}</p>
                  </div>
                )}
                {res.credential.holderStudentId && (
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Student ID</p>
                    <p className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                      {res.credential.holderStudentId}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Issue Date</p>
                  <p className="font-medium text-slate-800">{new Date(res.credential.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Type</p>
                  <p className="font-medium text-slate-800">{res.credential.credentialType}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] relative overflow-hidden font-sans">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-6 py-8 md:py-10 text-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 mb-8 md:mb-10 relative z-10"
        >
          <h1 className="text-3xl md:text-[2.5rem] font-bold tracking-tight text-[#0f172a]">
            Verify a <span className="text-[#1d4ed8]">Student&apos;s Credentials</span>
          </h1>

          <div className="flex justify-center items-center">
            <div className="h-px bg-blue-100 w-16" />
            <ShieldCheck className="mx-4 size-5 text-blue-600" />
            <div className="h-px bg-blue-100 w-16" />
          </div>


        </motion.div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10 max-w-[1000px] mx-auto">
          {/* Manual Verification Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full bg-white rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left flex flex-col p-5 md:p-6">
              <CardHeader className="p-0 pb-4">
                <div className="size-11 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <Search className="size-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-bold">Credential Lookup</CardTitle>
                <CardDescription className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Paste the 24-character credential ID that a student shared with you via email or message.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <form onSubmit={handleVerify} className="space-y-6 flex-1 flex flex-col">
                  <div className="relative mt-2 flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="credentialId"
                        value={credentialId}
                        onChange={(e) => setCredentialId(e.target.value)}
                        placeholder="e.g. 64b9f0d3a7c1e2b4d6f8a9c0"
                        className="font-mono text-[13px] bg-white border-slate-200 h-12 pl-4 pr-12 rounded-xl text-slate-600 focus-visible:ring-blue-600 w-full"
                        required={!isScanning}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Copy className="size-4" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className={`h-12 w-12 shrink-0 rounded-xl ${isScanning ? 'bg-blue-50 border-blue-200 text-blue-600' : 'text-slate-500'}`}
                      onClick={() => setIsScanning(!isScanning)}
                    >
                      <QrCode className="size-5" />
                    </Button>
                  </div>

                  {isScanning && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                      <QRScanner 
                        onScanSuccess={(text) => {
                          setCredentialId(text);
                          setIsScanning(false);
                          toast.success("QR Code scanned!");
                        }} 
                        onScanFailure={() => {}}
                      />
                    </motion.div>
                  )}

                  <div className="mt-auto pt-4 space-y-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium text-[15px] shadow-sm"
                    >
                      {loading ? <Loader2 className="size-5 animate-spin" /> : <><Search className="size-[18px] mr-2" /> Verify Now</>}
                    </Button>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                      <ShieldCheck className="size-3.5 text-blue-500" /> Secure. Private. No data stored.
                    </div>
                  </div>
                </form>


              </CardContent>
            </Card>
          </motion.div>

          {/* Biometric Verification Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full bg-white rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left flex flex-col p-5 md:p-6">
              <CardHeader className="p-0 pb-4">
                <div className="size-11 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <Fingerprint className="size-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-bold">In-Person Scan</CardTitle>
                <CardDescription className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Have the student scan their fingerprint or FaceID. Zero data entry required.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {!bioStudent ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-4">
                    {/* Decorative Scan Graphic */}
                    <div className="relative size-24 md:size-28 mb-5 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200 animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-2 rounded-full bg-blue-50" />
                      <Fingerprint className="size-10 md:size-12 text-blue-600 relative z-10" />

                      {/* Corner Brackets */}
                      <div className="absolute -top-4 -left-4 size-6 border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
                      <div className="absolute -top-4 -right-4 size-6 border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
                      <div className="absolute -bottom-4 -left-4 size-6 border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
                      <div className="absolute -bottom-4 -right-4 size-6 border-b-2 border-r-2 border-blue-200 rounded-br-lg" />

                      {/* Sparkles */}
                      <div className="absolute top-0 right-[-10px] size-1.5 bg-blue-300 rounded-full rotate-45" />
                      <div className="absolute bottom-4 left-[-15px] size-1 bg-blue-200 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-4">
                    <div className="p-4 bg-green-50 rounded-full mb-4">
                      <CheckCircle2 className="size-8 text-green-600" />
                    </div>
                    <p className="text-base font-semibold text-slate-900">Identity Confirmed</p>
                    <p className="text-sm text-slate-500 mt-1">{bioStudent.name || bioStudent.email}</p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
                      onClick={() => setDialogOpen(true)}
                    >
                      View Credentials
                    </Button>
                  </div>
                )}

                <div className="mt-auto space-y-3">
                  <Button
                    onClick={handleBiometricVerify}
                    disabled={bioLoading}
                    className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[15px] border-0"
                    variant="outline"
                  >
                    {bioLoading ? (
                      <Loader2 className="mr-2 size-5 animate-spin text-blue-600" />
                    ) : (
                      <Fingerprint className="mr-2 size-[18px] text-blue-600" />
                    )}
                    {bioLoading ? "Waiting for device..." : "Start Biometric Scan"}
                  </Button>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                    <CheckCircle2 className="size-3.5 text-blue-500" /> Fast. Secure. Seamless.
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-5 py-2 text-[13px] text-slate-500 shadow-sm font-medium">
            <Lock className="size-3.5 text-slate-400" />
            End-to-end encrypted
            <span className="text-slate-300">•</span>
            Zero data retention
            <span className="text-slate-300">•</span>
            Built for trust
          </div>
        </motion.div>

        {/* Verification Result Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
            {/* Dialog for Credential Lookup result */}
            {result && !bioStudent && (
              <>
                <DialogHeader className={`p-6 pb-4 ${result.isValid ? "bg-gradient-to-br from-green-50 to-emerald-50" : "bg-gradient-to-br from-red-50 to-orange-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${result.isValid ? "bg-green-100" : "bg-red-100"}`}>
                      {result.isValid ? <ShieldCheck className="size-6 text-green-600" /> : <XCircle className="size-6 text-red-600" />}
                    </div>
                    <div>
                      <DialogTitle className={`text-xl font-bold ${result.isValid ? "text-green-800" : "text-red-800"}`}>
                        {result.isValid ? "Credential Verified" : "Verification Failed"}
                      </DialogTitle>
                      <DialogDescription className={`text-sm mt-0.5 ${result.isValid ? "text-green-600" : "text-red-600"}`}>
                        {result.isValid ? "This credential is cryptographically valid and trusted." : "This credential could not be verified."}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="p-6 space-y-4">
                  {renderCredentialCard(result)}
                </div>
              </>
            )}

            {/* Dialog for Biometric result */}
            {bioStudent && (
              <>
                <DialogHeader className="p-6 pb-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-green-100">
                      <Fingerprint className="size-6 text-green-600" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-green-800">Identity Verified</DialogTitle>
                      <DialogDescription className="text-sm mt-0.5 text-green-600">
                        Biometric scan matched to {bioStudent.name || bioStudent.email}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="p-6 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Name</span>
                      <span className="font-semibold text-slate-900">{bioStudent.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Email</span>
                      <span className="font-semibold text-slate-900">{bioStudent.email}</span>
                    </div>
                  </div>

                  {bioCredentials && bioCredentials.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-slate-100 flex-1" />
                        <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
                          {bioCredentials.length} Credential{bioCredentials.length !== 1 ? "s" : ""}
                        </h4>
                        <div className="h-px bg-slate-100 flex-1" />
                      </div>
                      {bioCredentials.map((cred, i) => renderCredentialCard(cred, i))}
                    </div>
                  )}

                  {bioCredentials !== null && bioCredentials.length === 0 && (
                    <div className="text-center p-6 border rounded-xl bg-slate-50 text-slate-500">
                      This student has no active credentials.
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
