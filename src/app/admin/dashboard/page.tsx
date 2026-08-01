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
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor system metrics and recent activity.</p>
      </div>

      {/* Quick Alerts */}
      {data.stats.pendingInstitutions > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 shadow-[0_4px_20px_rgb(251,191,36,0.1)] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-48 h-48 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-lg shadow-md shadow-amber-500/20">
              <Building2 className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-900 tracking-tight">Pending Approvals</h3>
              <p className="text-xs text-amber-700/80 mt-0.5">There are {data.stats.pendingInstitutions} institutions waiting for your review.</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-900 text-amber-800 shadow-sm relative z-10 font-semibold text-xs h-8 px-4">
            <Link href="/admin/dashboard/institutions">Review Now</Link>
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Total Institutions</h3>
            <div className="bg-blue-100/50 p-1.5 rounded-lg">
              <Building2 className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.totalInstitutions}</div>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Pending Approvals</h3>
            <div className="bg-amber-100/50 p-1.5 rounded-lg">
              <Activity className="size-4 text-amber-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.pendingInstitutions}</div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Total Students</h3>
            <div className="bg-emerald-100/50 p-1.5 rounded-lg">
              <Users className="size-4 text-emerald-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.totalStudents}</div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl relative overflow-hidden group p-4 flex flex-col gap-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-row items-center justify-between relative z-10">
            <h3 className="text-sm font-medium text-slate-500">Credentials Issued</h3>
            <div className="bg-purple-100/50 p-1.5 rounded-lg">
              <FileText className="size-4 text-purple-600" />
            </div>
          </div>
          <div className="relative z-10 mt-1">
            <div className="text-2xl font-black tracking-tight text-slate-900">{data.stats.totalCredentials}</div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="col-span-1 border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
          <h2 className="text-base font-bold tracking-tight text-slate-900">Recent Activity</h2>
          <p className="text-xs mt-0.5 text-slate-500">Latest system events and audit logs.</p>
        </div>
        <div className="px-4 py-3">
          <div className="space-y-3">
            {data.recentActivity.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No activity logged yet.</p>
            ) : (
              data.recentActivity.map((log) => (
                <div key={log._id} className="flex gap-3 items-start pb-3 border-b border-indigo-50/60 last:border-0 last:pb-0 group">
                  <div className="mt-0.5 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 p-1.5 rounded-lg text-slate-500 shadow-sm group-hover:scale-105 transition-all duration-300">
                    <Activity className="size-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {log.action}
                    </p>
                    <p className="text-xs text-slate-600">
                      {log.actorId ? (
                        <>Actor: {log.actorId.name || log.actorId.institutionName || log.actorId.email}</>
                      ) : (
                        <>System Action</>
                      )}
                    </p>
                    {log.metadata && (
                      <pre className="mt-1 text-[10px] bg-slate-50 p-1.5 rounded border text-slate-600 overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
