"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, FileBadge, AlertTriangle, ArrowRight, ShieldCheck, Activity, Stamp } from "lucide-react";
import Link from "next/link";

interface OverviewData {
  stats: {
    studentCount: number;
    totalCredentials: number;
    activeCredentials: number;
    revokedCount: number;
  };
  recentActivity: Array<{
    _id: string;
    action: string;
    createdAt: string;
    metadata?: any;
    targetId?: any;
  }>;
}

export function InstitutionDashboardClient({ institution }: { institution: any }) {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    fetch("/api/institution/overview")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor your institution&apos;s metrics and recent credential activity.</p>
      </div>

      {/* Pending Approval Banner */}
      {!institution.approved && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 shadow-[0_4px_20px_rgb(251,191,36,0.1)] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-48 h-48 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-md shadow-amber-500/20">
              <AlertTriangle className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-900 tracking-tight">Pending Approval</h3>
              <p className="text-xs text-amber-700/80 mt-0.5">Your account is pending admin approval. You can invite students, but cannot issue verifiable credentials yet.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Enrolled Students</h3>
            <div className="bg-blue-100/50 p-1.5 rounded-lg">
              <Users className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            {data ? (
              <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.studentCount}</div>
            ) : (
              <div className="h-8 w-12 bg-slate-200 animate-pulse rounded" />
            )}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Total Issued</h3>
            <div className="bg-purple-100/50 p-1.5 rounded-lg">
              <FileBadge className="size-4 text-purple-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            {data ? (
              <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.totalCredentials}</div>
            ) : (
              <div className="h-8 w-12 bg-slate-200 animate-pulse rounded" />
            )}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Active Credentials</h3>
            <div className="bg-emerald-100/50 p-1.5 rounded-lg">
              <ShieldCheck className="size-4 text-emerald-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            {data ? (
              <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.activeCredentials}</div>
            ) : (
              <div className="h-8 w-12 bg-slate-200 animate-pulse rounded" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl h-full flex flex-col">
            <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
              <h2 className="text-base font-bold tracking-tight text-slate-900">Recent Activity</h2>
              <p className="text-xs mt-0.5 text-slate-500">Latest credentials issued and actions taken.</p>
            </div>
            <div className="px-4 py-3 flex-1">
              {!data ? (
                <div className="space-y-3 py-3">
                  <div className="h-10 bg-slate-100 animate-pulse rounded-lg w-full" />
                  <div className="h-10 bg-slate-100 animate-pulse rounded-lg w-full" />
                  <div className="h-10 bg-slate-100 animate-pulse rounded-lg w-full" />
                </div>
              ) : data.recentActivity.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No activity logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentActivity.map((log) => (
                    <div key={log._id} className="flex gap-3 items-start pb-3 border-b border-indigo-50/60 last:border-0 last:pb-0 group">
                      <div className="mt-0.5 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 p-1.5 rounded-lg text-slate-500 shadow-sm group-hover:scale-105 transition-all duration-300">
                        <Activity className="size-3.5" />
                      </div>
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {log.action}
                        </p>
                        <p className="text-xs text-slate-600">
                          {log.targetId?.name ? `Target: ${log.targetId.name}` : "System Action"}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
            <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-2">
              <Button asChild variant="outline" className="w-full justify-start h-10 text-sm font-semibold border-indigo-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all rounded-lg shadow-sm">
                <Link href="/institution/dashboard/students">
                  <Users className="size-4 mr-2 text-blue-500" />
                  Invite Student
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-10 text-sm font-semibold border-indigo-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all rounded-lg shadow-sm" disabled={!institution.approved}>
                <Link href="/institution/dashboard/issue">
                  <Stamp className="size-4 mr-2 text-purple-500" />
                  Issue Credential
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-10 text-sm font-semibold border-indigo-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all rounded-lg shadow-sm">
                <Link href="/institution/dashboard/history">
                  <FileBadge className="size-4 mr-2 text-emerald-500" />
                  View History
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
