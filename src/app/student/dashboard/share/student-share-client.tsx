"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, Share2, Building2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export function StudentShareClient({ credentials }: { credentials: any[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 -z-10 w-full h-[400px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent opacity-60" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Share2 className="size-6 text-blue-600" /> Share a Credential
          </h1>
          <p className="text-sm text-slate-500 mt-1">Select an active credential below to generate a secure, verifiable proof link.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {credentials.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <div className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none rounded-xl">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
                  <Award className="size-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No active credentials available</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1">
                  You don't have any active credentials to share yet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          credentials.map((c, i) => {
            const issuer = c.issuerId as { institutionName?: string } | null;
            return (
              <motion.div
                key={c._id.toString()}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex flex-col h-full rounded-xl border border-indigo-50/50 bg-white/80 backdrop-blur-xl p-4 hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer">
                  <div className="absolute top-0 right-0 p-12 bg-gradient-to-bl from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-bl-full" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm group-hover:scale-105 transition-transform">
                      <Award className="size-5 text-blue-600" />
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <ShieldCheck className="size-3" /> Verifiable
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1 mb-4">
                    <h3 className="font-bold text-base leading-tight text-slate-900 line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{c.credentialType}</p>
                    <div className="flex flex-col gap-1 mt-2">
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Building2 className="size-3 text-slate-400" />
                        {issuer?.institutionName ?? "Unknown Institution"}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 ml-[18px]">
                        Issued {format(new Date(c.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-auto">
                    <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 font-semibold transition-all h-9 text-xs rounded-lg">
                      <Link href={`/student/dashboard/share/${c._id.toString()}`}>
                        Select & Create Proof <Share2 className="size-3 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
