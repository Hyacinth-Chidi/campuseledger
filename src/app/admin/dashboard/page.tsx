"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Users, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminOverviewData {
  stats: {
    totalInstitutions: number;
    pendingInstitutions: number;
    totalStudents: number;
    totalCredentials: number;
  };
  recentActivity: Array<{
    _id: string;
    action: string;
    createdAt: string;
    actorId?: { name?: string; institutionName?: string; email: string };
    metadata?: any;
  }>;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverviewData | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-lg text-slate-500 mt-2">Monitor system metrics and recent activity.</p>
      </div>

      {/* Quick Alerts */}
      {data.stats.pendingInstitutions > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 shadow-[0_8px_30px_rgb(251,191,36,0.12)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3.5 rounded-xl shadow-lg shadow-amber-500/20">
              <Building2 className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-amber-900 tracking-tight">Pending Approvals</h3>
              <p className="text-base text-amber-700/80 mt-0.5">There are {data.stats.pendingInstitutions} institutions waiting for your review.</p>
            </div>
          </div>
          <Button asChild className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-900 text-amber-800 shadow-sm relative z-10 font-semibold px-6">
            <Link href="/admin/dashboard/institutions">Review Now</Link>
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Total Institutions</CardTitle>
            <div className="bg-blue-100/50 p-2.5 rounded-xl">
              <Building2 className="size-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.totalInstitutions}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Pending Approvals</CardTitle>
            <div className="bg-amber-100/50 p-2.5 rounded-xl">
              <Activity className="size-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.pendingInstitutions}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Total Students</CardTitle>
            <div className="bg-emerald-100/50 p-2.5 rounded-xl">
              <Users className="size-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-slate-500">Credentials Issued</CardTitle>
            <div className="bg-purple-100/50 p-2.5 rounded-xl">
              <FileText className="size-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight text-slate-900 mt-2">{data.stats.totalCredentials}</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="col-span-1 border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl mt-8 overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-6">
          <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
          <CardDescription className="text-base mt-1">Latest system events and audit logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No activity logged yet.</p>
            ) : (
              data.recentActivity.map((log) => (
                <div key={log._id} className="flex gap-5 items-start pb-5 border-b border-indigo-50/60 last:border-0 last:pb-0 group">
                  <div className="mt-1 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-slate-500 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <Activity className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-base font-semibold text-slate-900">
                      {log.action}
                    </p>
                    <p className="text-sm text-slate-600">
                      {log.actorId ? (
                        <>Actor: {log.actorId.name || log.actorId.institutionName || log.actorId.email}</>
                      ) : (
                        <>System Action</>
                      )}
                    </p>
                    {log.metadata && (
                      <pre className="mt-2 text-xs bg-slate-50 p-2 rounded-md border text-slate-600 overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
