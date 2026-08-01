"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Award, Shield, Share2, LogOut } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const NAV_ITEMS = [
  { label: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Credentials", href: "/student/dashboard/credentials", icon: Award },
  { label: "Share", href: "/student/dashboard/share", icon: Share2 },
  { label: "Security", href: "/student/dashboard/security", icon: Shield },
];

interface StudentSidebarProps {
  onClose?: () => void;
}

export function StudentSidebar({ onClose }: StudentSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  }

  return (
    <aside className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-indigo-100/60 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
      <div className="h-16 flex items-center px-6 border-b border-indigo-50 bg-gradient-to-b from-blue-50/50 to-transparent">
        <Link href="/" className="flex items-center" onClick={onClose}>
          <Image src="/logo.png" alt="CampusLedger Logo" width={150} height={35} className="object-contain" />
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-indigo-50/50">
        <div className="flex items-center gap-2 px-2 py-1 bg-blue-50/50 border border-blue-100 rounded-md w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">Student Wallet</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className="block" onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-600 hover:bg-blue-50/50 hover:text-blue-700"
                )}
              >
                <item.icon className={cn("size-4", isActive ? "text-white" : "text-slate-400")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-indigo-50/50 bg-slate-50/30">
        <Button
          variant="ghost"
          onClick={() => {
            handleLogout();
            onClose?.();
          }}
          className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors h-10 rounded-lg text-sm"
        >
          <div className="flex items-center gap-2.5 w-full">
            <LogOut className="size-4" />
            <span className="font-medium">Log out</span>
          </div>
        </Button>
      </div>
    </aside>
  );
}
