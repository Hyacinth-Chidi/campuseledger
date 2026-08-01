"use client";

import { useEffect, useState } from "react";
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
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-2.5 py-0.5 text-xs font-medium text-blue-800 mb-3 shadow-sm">
          <Stamp className="mr-1.5 size-3 text-blue-600" />
          Blockchain Issuance
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issue a Credential</h1>
        <p className="text-sm text-slate-500 mt-1">Sign and issue verifiable records to your students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
            <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
              <h2 className="text-base font-bold tracking-tight text-slate-900">Credential Details</h2>
              <p className="text-xs mt-0.5 text-slate-500">
                This is signed with your institution&apos;s private key the moment you submit.
              </p>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-indigo-50/50 shadow-inner">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Select Student</Label>
                    <Select value={studentId} onValueChange={setStudentId}>
                      <SelectTrigger className="w-full h-9 bg-white border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg transition-all text-sm">
                        <SelectValue placeholder="Choose a student from your roster" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s._id} value={s._id} className="text-sm">
                            {s.name} ({s.studentIdNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="credentialType" className="text-xs font-semibold text-slate-700">Credential Type</Label>
                      <Input
                        id="credentialType"
                        value={credentialType}
                        onChange={(e) => setCredentialType(e.target.value)}
                        placeholder="e.g. Degree, Transcript"
                        className="h-9 bg-white border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. B.Sc. Computer Science"
                        className="h-9 bg-white border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                      <Database className="size-4 text-blue-600" /> Claims (Metadata)
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setClaims((prev) => [...prev, { key: "", value: "" }])}
                      className="h-7 text-xs rounded-lg border-indigo-100 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium"
                    >
                      <Plus className="size-3 mr-1" /> Add claim
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <AnimatePresence>
                      {claims.map((claim, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 items-start"
                        >
                          <div className="flex-1">
                            <Input
                              placeholder="Key (e.g. gpa)"
                              value={claim.key}
                              onChange={(e) => updateClaim(i, "key", e.target.value)}
                              className="h-9 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Value (e.g. 3.8)"
                              value={claim.value}
                              onChange={(e) => updateClaim(i, "value", e.target.value)}
                              className="h-9 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            onClick={() => setClaims((prev) => prev.filter((_, idx) => idx !== i))}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full h-10 text-sm rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading || !studentId}>
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <><Stamp className="size-4 mr-1.5" /> Sign and Issue Credential</>}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-gradient-to-b from-blue-50/50 to-white/80 backdrop-blur-xl flex flex-col">
            <div className="pb-3 pt-4 px-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-slate-900">
                <LinkIcon className="size-4 text-blue-600" /> What happens next?
              </h2>
            </div>
            <div className="px-4 pb-4 space-y-4 text-sm text-slate-600">
              <p>When you click <strong className="text-slate-900">Sign and Issue</strong>:</p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex gap-3 items-start">
                  <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-sm border border-blue-200">1</div>
                  <p className="text-xs leading-relaxed">The data is cryptographically signed using your institution&apos;s private key.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-sm border border-blue-200">2</div>
                  <p className="text-xs leading-relaxed">The credential is saved to the ledger and linked to the student&apos;s DID.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-sm border border-blue-200">3</div>
                  <p className="text-xs leading-relaxed">The student instantly sees the credential in their dashboard.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
