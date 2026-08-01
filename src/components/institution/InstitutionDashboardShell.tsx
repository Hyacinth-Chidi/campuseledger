"use client";

import { useState } from "react";
import { InstitutionSidebar } from "@/components/institution/InstitutionSidebar";
import { Menu } from "lucide-react";

export function InstitutionDashboardShell({
  institution,
  children,
}: {
  institution: any;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8faff] selection:bg-blue-100 selection:text-blue-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-20">
        <InstitutionSidebar institution={institution} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <InstitutionSidebar institution={institution} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-indigo-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight truncate">{institution.institutionName}</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center">
               <span className="text-slate-500 font-semibold text-sm">{institution.institutionName?.charAt(0) || "I"}</span>
             </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
