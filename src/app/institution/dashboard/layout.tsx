import { InstitutionSidebar } from "@/components/institution/InstitutionSidebar";
import { requireUser } from "@/lib/currentUser";

export default async function InstitutionDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const institution = await requireUser("institution");

  return (
    <div className="flex min-h-screen bg-[#f8faff] selection:bg-blue-100 selection:text-blue-900">
      <InstitutionSidebar institution={JSON.parse(JSON.stringify(institution))} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-indigo-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{institution.institutionName}</h1>
          </div>
          {/* User Profile placeholder */}
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center">
               <span className="text-slate-500 font-semibold">{institution.institutionName?.charAt(0) || "I"}</span>
             </div>
          </div>
        </header>
        <main className="flex-1 p-8 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
