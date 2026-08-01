"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Check, Fingerprint, Award, ArrowRight, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export function StudentDashboardClient({ student, didDoc, credentials }: { student: any; didDoc: any; credentials: any[] }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 -z-10 w-full h-[500px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent opacity-60" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/60 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30 text-2xl font-bold text-white">
            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Welcome back, {student.name || "Student"}</h1>
            <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium text-sm">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none border-none text-[10px] px-2 py-0.5">Student</Badge>
              {student.email}
            </p>
          </div>
        </div>
        <Button asChild className="rounded-lg h-10 px-4 shadow-md shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 transition-all font-semibold text-sm w-full md:w-auto">
          <Link href="/student/dashboard/share">
            <ShareIcon /> Share a Credential
          </Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content (Credentials) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Wallet className="size-5 text-blue-600" /> My Wallet
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold rounded-lg h-8 px-2 text-xs">
              <Link href="/student/dashboard/credentials">View all <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </div>

          <div className="space-y-3">
            {credentials.length === 0 && (
              <div className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none rounded-xl">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
                    <Award className="size-6 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Your wallet is empty</h3>
                  <p className="text-sm text-slate-500 max-w-sm mt-1">
                    When your institution issues a verifiable credential, it will cryptographically appear here.
                  </p>
                </div>
              </div>
            )}
            
            {credentials.map((c, i) => (
              <motion.div
                key={c._id.toString()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="border border-indigo-50/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl group hover:shadow-md transition-all duration-300 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm group-hover:scale-105 transition-transform">
                    <Award className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">{c.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs font-medium text-slate-500 truncate">{c.credentialType}</p>
                      <span className="text-slate-300 text-xs">•</span>
                      <p className="text-xs text-slate-400">{format(new Date(c.createdAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 mt-3 sm:mt-0">
                    <Badge className={c.status === "revoked" ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-[10px] px-2 py-0.5" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-[10px] px-2 py-0.5"}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </Badge>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg">
                      <Link href={`/student/dashboard/share/${c._id.toString()}`}>Share Proof</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar (DID & Security) */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.04)] rounded-xl overflow-hidden bg-gradient-to-b from-white to-slate-50/50 flex flex-col">
              <div className="pb-3 pt-4 px-4">
                <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                  <Fingerprint className="size-4 text-indigo-600" /> My Digital ID
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your Decentralized Identifier (DID). This mathematical proof secures your wallet on the blockchain.
                </p>
              </div>
              <div className="px-4 pb-4">
                <div className="relative group">
                  <code className="text-[11px] bg-slate-900 text-emerald-400 border border-slate-800 p-3 rounded-lg block break-all font-mono shadow-inner">
                    {didDoc?.did ?? "No DID on record"}
                  </code>
                  {didDoc?.did && (
                    <Button 
                      size="icon" 
                      className="absolute top-1.5 right-1.5 size-6 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all rounded-md"
                      onClick={() => {
                        navigator.clipboard.writeText(didDoc.did);
                        setCopied(true);
                        toast.success("DID copied to clipboard");
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 size-3.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
  )
}
