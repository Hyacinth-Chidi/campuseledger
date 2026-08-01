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

export function StudentSidebar() {
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
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-white/80 backdrop-blur-xl border-r border-indigo-100/60 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="CampusLedger Logo" width={180} height={40} className="object-contain" />
        </Link>
        <div className="mt-8 flex items-center gap-2 px-2 py-1.5 bg-blue-50/50 border border-blue-100 rounded-lg w-fit">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Student Wallet</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-[15px]",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-blue-50/50 hover:text-blue-700"
                )}
              >
                <item.icon className={cn("size-5", isActive ? "text-white" : "text-slate-400")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-indigo-50/50 bg-slate-50/30">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors h-12 rounded-xl text-[15px]"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm group-hover:border-red-200 transition-colors">
              <LogOut className="size-4" />
            </div>
            <span className="font-semibold">Log out</span>
          </div>
        </Button>
      </div>
    </aside>
  );
}
