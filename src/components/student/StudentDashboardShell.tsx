"use client";

import { useState } from "react";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { Menu } from "lucide-react";

export function StudentDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8faff] selection:bg-blue-100 selection:text-blue-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 z-20 w-64">
        <StudentSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <StudentSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 lg:hidden border-b border-indigo-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight truncate">Student Portal</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
