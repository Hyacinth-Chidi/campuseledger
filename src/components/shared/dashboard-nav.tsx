"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
}

export function DashboardNav({
  title,
  items,
  accentClass,
}: {
  title: string;
  items: NavItem[];
  accentClass?: string;
}) {
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
    <header className="sticky top-0 z-40 w-full glass">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard className={cn("size-5", accentClass)} />
            <span className={cn("font-bold tracking-tight", accentClass)}>{title}</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-secondary rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-foreground">
          <LogOut className="size-4 mr-2" /> Log out
        </Button>
      </div>
    </header>
  );
}
