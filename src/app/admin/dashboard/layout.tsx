import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8faff] selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-indigo-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Portal</h1>
          </div>
          {/* User Profile placeholder */}
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>
        <main className="flex-1 p-8 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
