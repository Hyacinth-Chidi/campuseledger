"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CopyField } from "@/components/shared/copy-field";
import { motion } from "framer-motion";
import { QrCode, ScanLine, Link as LinkIcon, Share2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StudentShareClient({ credentialTitle, credentialId, qrDataUrl }: { credentialTitle: string; credentialId: string; qrDataUrl: string }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 -z-10 w-full h-[500px] bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent opacity-60" />
      <div className="absolute top-20 right-20 size-[500px] bg-indigo-200/20 blur-3xl rounded-full -z-10" />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-slate-500 hover:text-slate-900 font-medium hover:bg-slate-100/50">
            <Link href="/student/dashboard/credentials"><ArrowLeft className="mr-2 size-4" /> Back to Credentials</Link>
          </Button>
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Share2 className="size-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700">Share Proof</h2>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{credentialTitle}</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full border border-indigo-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl group hover:shadow-md transition-all duration-300">
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="flex justify-center mb-6">
                  <div className="size-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100/50 shadow-sm group-hover:scale-105 transition-transform">
                    <QrCode className="size-8 text-blue-600" />
                  </div>
                </CardTitle>
                <CardTitle className="text-xl text-slate-900">Scan to Verify</CardTitle>
                <CardDescription className="text-base text-slate-500 mt-2">
                  Show this QR code to a verifier. They can scan it instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-8 pt-2">
                <div className="relative p-6 bg-white rounded-3xl shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors">
                  <ScanLine className="absolute top-4 left-4 size-8 text-blue-600/30 group-hover:text-blue-600/60 transition-colors" />
                  <ScanLine className="absolute bottom-4 right-4 size-8 text-blue-600/30 group-hover:text-blue-600/60 transition-colors rotate-180" />
                  <Image src={qrDataUrl} alt="Credential QR code" width={220} height={220} unoptimized className="rounded-xl relative z-10" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full border border-indigo-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl group hover:shadow-md transition-all duration-300">
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="flex justify-center mb-6">
                  <div className="size-16 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border border-indigo-100/50 shadow-sm group-hover:scale-105 transition-transform">
                    <LinkIcon className="size-8 text-indigo-600" />
                  </div>
                </CardTitle>
                <CardTitle className="text-xl text-slate-900">Share ID</CardTitle>
                <CardDescription className="text-base text-slate-500 mt-2">
                  Or copy and share this unique 24-character credential ID securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-2">
                <CopyField value={credentialId} />
                <div className="bg-blue-50 rounded-2xl p-5 text-[14px] text-blue-900 border border-blue-100">
                  <p><strong>Note:</strong> Anyone with this ID or QR code can verify this credential at <span className="font-mono font-bold text-blue-700 bg-blue-100/50 px-1 py-0.5 rounded">/verify</span>.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
