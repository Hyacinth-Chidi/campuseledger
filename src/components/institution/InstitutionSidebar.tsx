"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Stamp, Clock, LogOut, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Overview", href: "/institution/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/institution/dashboard/students", icon: Users },
  { name: "Issue Credential", href: "/institution/dashboard/issue", icon: Stamp },
  { name: "History", href: "/institution/dashboard/history", icon: Clock },
];

interface InstitutionSidebarProps {
  institution: any;
  onClose?: () => void;
}

export function InstitutionSidebar({ institution, onClose }: InstitutionSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/student/login"; // Shared login page route
  };

  return (
    <aside className="w-64 flex flex-col justify-between h-full border-r border-indigo-100 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-indigo-50 bg-gradient-to-b from-blue-50/50 to-transparent">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <Image src="/logo.png" alt="CampusLedger Logo" width={150} height={35} className="object-contain" />
          </Link>
        </div>
        
        {/* Institution Info */}
        <div className="px-4 py-3 border-b border-indigo-50/50">
          <h2 className="font-bold text-sm text-slate-900 tracking-tight truncate" title="Institution Portal">
            Institution Portal
          </h2>
          <div className="mt-1.5">
            {institution.approved ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="size-3" /> Verified Issuer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="size-3" /> Pending Approval
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                )}
              >
                <Icon className={cn("size-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-50">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 text-sm py-4 rounded-lg transition-all"
          onClick={() => {
            handleLogout();
            onClose?.();
          }}
        >
          <LogOut className="mr-3 size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
