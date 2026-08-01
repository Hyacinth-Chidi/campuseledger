"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, Share2, Building2, Wallet } from "lucide-react";
import { format } from "date-fns";

export function StudentCredentialsClient({ credentials }: { credentials: any[] }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 -z-10 w-full h-[400px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent opacity-60" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wallet className="size-8 text-blue-600" /> Digital Wallet
          </h1>
          <p className="text-lg text-slate-500 mt-2">All your verifiable credentials cryptographically secured on the ledger.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
                  <Award className="size-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Your wallet is empty</h3>
                <p className="text-slate-500 max-w-sm mt-1">
                  When an institution issues you a credential, it will appear here instantly.
                </p>
              </CardContent>
            </Card>
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
                <div className="flex flex-col h-full rounded-2xl border border-indigo-50/50 bg-white/80 backdrop-blur-xl p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {/* Accent glow on hover */}
                  <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-bl-full" />
                  
                  <div className="flex items-start justify-between mb-5">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm group-hover:scale-105 transition-transform">
                      <Award className="size-7 text-blue-600" />
                    </div>
                    <Badge className={c.status === "revoked" ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 space-y-2 mb-6">
                    <h3 className="font-bold text-xl leading-tight text-slate-900 line-clamp-2">{c.title}</h3>
                    <p className="text-[15px] text-blue-600 font-semibold">{c.credentialType}</p>
                    <div className="flex flex-col gap-1 mt-3">
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Building2 className="size-4 text-slate-400" />
                        {issuer?.institutionName ?? "Unknown Institution"}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-2 ml-[24px]">
                        Issued {format(new Date(c.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-auto">
                    <Button asChild className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-none shadow-none font-semibold transition-colors">
                      <Link href={`/student/dashboard/share/${c._id.toString()}`}>
                        <Share2 className="size-4 mr-2" /> Create Share Proof
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
