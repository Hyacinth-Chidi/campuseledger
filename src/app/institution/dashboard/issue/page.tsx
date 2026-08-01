"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Trash2, Stamp, Loader2, Link as LinkIcon, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface StudentOption {
  _id: string;
  name: string;
  email: string;
  studentIdNumber: string;
}

export default function IssueCredentialPage() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentId, setStudentId] = useState("");
  const [credentialType, setCredentialType] = useState("Degree");
  const [title, setTitle] = useState("");
  const [claims, setClaims] = useState<{ key: string; value: string }[]>([
    { key: "gpa", value: "" },
    { key: "graduationDate", value: "" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/students/invite")
      .then((r) => r.json())
      .then((d) => setStudents(d.students || []));
  }, []);

  function updateClaim(index: number, field: "key" | "value", value: string) {
    setClaims((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const claimsObject = Object.fromEntries(
        claims.filter((c) => c.key.trim() !== "").map((c) => [c.key.trim(), c.value])
      );
      const res = await fetch("/api/credentials/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, credentialType, title, claims: claimsObject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not issue credential");
      
      toast.success("Credential issued successfully!", {
        description: "It has been cryptographically signed and stored.",
      });
      setTitle("");
    } catch (err) {
      toast.error("Failed to issue credential", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-sm font-medium text-blue-800 mb-4 shadow-sm">
          <Stamp className="mr-2 size-4 text-blue-600" />
          Blockchain Issuance
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Issue a Credential</h1>
        <p className="text-lg text-slate-500 mt-2">Sign and issue verifiable records to your students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-6">
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Credential Details</CardTitle>
              <CardDescription className="text-base mt-1">
                This is signed with your institution's private key the moment you submit.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-indigo-50/50 shadow-inner">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Select Student</Label>
                    <Select value={studentId} onValueChange={setStudentId}>
                      <SelectTrigger className="w-full h-12 bg-white border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition-all text-base">
                        <SelectValue placeholder="Choose a student from your roster" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s._id} value={s._id} className="text-base">
                            {s.name} ({s.studentIdNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="credentialType" className="text-sm font-semibold text-slate-700">Credential Type</Label>
                      <Input
                        id="credentialType"
                        value={credentialType}
                        onChange={(e) => setCredentialType(e.target.value)}
                        placeholder="e.g. Degree, Transcript"
                        className="h-12 bg-white border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. B.Sc. Computer Science"
                        className="h-12 bg-white border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                      <Database className="size-5 text-blue-600" /> Claims (Metadata)
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setClaims((prev) => [...prev, { key: "", value: "" }])}
                      className="rounded-xl border-indigo-100 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium"
                    >
                      <Plus className="size-4 mr-1.5" /> Add claim
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <AnimatePresence>
                      {claims.map((claim, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-4 items-start"
                        >
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Key (e.g. gpa)"
                              value={claim.key}
                              onChange={(e) => updateClaim(i, "key", e.target.value)}
                              className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all text-base"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Value (e.g. 3.8)"
                              value={claim.value}
                              onChange={(e) => updateClaim(i, "value", e.target.value)}
                              className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all text-base"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            onClick={() => setClaims((prev) => prev.filter((_, idx) => idx !== i))}
                          >
                            <Trash2 className="size-5" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-14 text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading || !studentId}>
                    {loading ? <Loader2 className="size-6 animate-spin" /> : <><Stamp className="size-5 mr-2" /> Sign and Issue Credential</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50/50 to-white/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                <LinkIcon className="size-5 text-blue-600" /> What happens next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base text-slate-600">
              <p>When you click <strong className="text-slate-900">Sign and Issue</strong>:</p>
              <ul className="space-y-5 list-none pl-0">
                <li className="flex gap-4 items-start">
                  <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm shadow-sm border border-blue-200">1</div>
                  <p className="mt-1 leading-relaxed">The data is cryptographically signed using your institution's private key.</p>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm shadow-sm border border-blue-200">2</div>
                  <p className="mt-1 leading-relaxed">The credential is saved to the ledger and linked to the student's DID.</p>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="size-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm shadow-sm border border-blue-200">3</div>
                  <p className="mt-1 leading-relaxed">The student instantly sees the credential in their dashboard.</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
