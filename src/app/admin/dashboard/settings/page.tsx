"use client";

import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage global configurations for the CampusLedger platform.</p>
      </div>

      <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
            <Settings className="size-4 text-indigo-600" /> General Configuration
          </h2>
        </div>
        <div className="p-6">
          <div className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-xl flex flex-col items-center justify-center py-16 text-center">
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
              <Settings className="size-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Settings module under construction</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Global system configurations, email templates, and ledger settings will be available here soon.
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button disabled className="h-9 px-4 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm opacity-50">
              <Save className="size-4 mr-1.5" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
