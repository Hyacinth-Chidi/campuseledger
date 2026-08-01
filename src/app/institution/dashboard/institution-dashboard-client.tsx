"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileBadge, Building2, AlertTriangle, ArrowRight, ShieldCheck, Activity, Stamp } from "lucide-react";
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-lg text-slate-500 mt-2">Monitor your institution's metrics and recent credential activity.</p>
      </div>

      {/* Pending Approval Banner */}
      {!institution.approved && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 shadow-[0_8px_30px_rgb(251,191,36,0.12)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3.5 rounded-xl shadow-lg shadow-amber-500/20">
              <AlertTriangle className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-amber-900 tracking-tight">Pending Approval</h3>
              <p className="text-base text-amber-700/80 mt-0.5">Your account is pending admin approval. You can invite students, but cannot issue verifiable credentials yet.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Enrolled Students</CardTitle>
            <div className="bg-blue-100/50 p-2.5 rounded-xl">
              <Users className="size-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {data ? (
              <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.studentCount}</div>
            ) : (
              <div className="h-10 w-16 bg-slate-200 animate-pulse rounded mt-2" />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Total Issued</CardTitle>
            <div className="bg-purple-100/50 p-2.5 rounded-xl">
              <FileBadge className="size-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {data ? (
              <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.totalCredentials}</div>
            ) : (
              <div className="h-10 w-16 bg-slate-200 animate-pulse rounded mt-2" />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Active Credentials</CardTitle>
            <div className="bg-emerald-100/50 p-2.5 rounded-xl">
              <ShieldCheck className="size-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {data ? (
              <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.activeCredentials}</div>
            ) : (
              <div className="h-10 w-16 bg-slate-200 animate-pulse rounded mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full">
            <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-6">
              <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
              <CardDescription className="text-base mt-1">Latest credentials issued and actions taken.</CardDescription>
            </CardHeader>
            <CardContent>
              {!data ? (
                <div className="space-y-4 py-4">
                  <div className="h-12 bg-slate-100 animate-pulse rounded-lg w-full" />
                  <div className="h-12 bg-slate-100 animate-pulse rounded-lg w-full" />
                  <div className="h-12 bg-slate-100 animate-pulse rounded-lg w-full" />
                </div>
              ) : data.recentActivity.length === 0 ? (
                <p className="text-base text-slate-500 py-8 text-center">No activity logged yet.</p>
              ) : (
                <div className="space-y-4 mt-4">
                  {data.recentActivity.map((log) => (
                    <div key={log._id} className="flex gap-5 items-start pb-5 border-b border-indigo-50/60 last:border-0 last:pb-0 group">
                      <div className="mt-1 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-slate-500 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                        <Activity className="size-5" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <p className="text-base font-semibold text-slate-900">
                          {log.action}
                        </p>
                        <p className="text-sm text-slate-600">
                          {log.targetId?.name ? `Target: ${log.targetId.name}` : "System Action"}
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-5">
              <CardTitle className="text-lg font-bold tracking-tight">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button asChild variant="outline" className="w-full justify-start h-14 text-base font-semibold border-indigo-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all rounded-xl shadow-sm">
                <Link href="/institution/dashboard/students">
                  <Users className="size-5 mr-3 text-blue-500" />
                  Invite Student
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-14 text-base font-semibold border-indigo-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all rounded-xl shadow-sm" disabled={!institution.approved}>
                <Link href="/institution/dashboard/issue">
                  <Stamp className="size-5 mr-3 text-purple-500" />
                  Issue Credential
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-14 text-base font-semibold border-indigo-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all rounded-xl shadow-sm">
                <Link href="/institution/dashboard/history">
                  <FileBadge className="size-5 mr-3 text-emerald-500" />
                  View History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
