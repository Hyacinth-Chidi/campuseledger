"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Building2, ShieldCheck, XCircle, Ban } from "lucide-react";
import { toast } from "sonner";

interface InstitutionRow {
  _id: string;
  institutionName: string;
  email: string;
  approved: boolean;
  suspended: boolean;
  studentCount: number;
  createdAt: string;
}

export default function AdminInstitutionsPage() {
  const [institutions, setInstitutions] = useState<InstitutionRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "suspended">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Dialog State
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "suspend" | "reinstate" | null;
    institution: InstitutionRow | null;
  }>({ isOpen: false, type: null, institution: null });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/institutions");
      if (res.ok) {
        const data = await res.json();
        setInstitutions(data.institutions);
      }
    } catch (e) {
      toast.error("Failed to load institutions");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAction = async () => {
    if (!actionDialog.type || !actionDialog.institution) return;
    
    const { type, institution } = actionDialog;
    setBusyId(institution._id);
    setActionDialog({ isOpen: false, type: null, institution: null });

    const toastId = toast.loading(`Processing ${type}...`);
    try {
      const res = await fetch(`/api/admin/institutions/${institution._id}/${type}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Institution ${type}d successfully.`, { id: toastId });
      await load();
    } catch (e: any) {
      toast.error(`Failed: ${e.message}`, { id: toastId });
    } finally {
      setBusyId(null);
    }
  };

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      const matchesSearch = 
        inst.institutionName.toLowerCase().includes(search.toLowerCase()) ||
        inst.email.toLowerCase().includes(search.toLowerCase());
      
      let matchesFilter = true;
      if (filter === "pending") matchesFilter = !inst.approved && !inst.suspended;
      if (filter === "approved") matchesFilter = inst.approved && !inst.suspended;
      if (filter === "suspended") matchesFilter = inst.suspended;

      return matchesSearch && matchesFilter;
    });
  }, [institutions, search, filter]);

  const openDialog = (institution: InstitutionRow, type: "approve" | "reject" | "suspend" | "reinstate") => {
    setActionDialog({ isOpen: true, type, institution });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Institutions</h1>
        <p className="text-lg text-slate-500 mt-2">Manage and approve institutions on the CampusLedger network.</p>
      </div>

      <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardHeader className="border-b border-indigo-50/50 bg-slate-50/50 pb-5 pt-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full group">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search institutions..."
                className="pl-11 h-12 text-base bg-white border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 shadow-sm rounded-xl transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 p-1.5 bg-slate-100/80 rounded-xl w-max border border-slate-200/50 shadow-inner">
              {(["all", "pending", "approved", "suspended"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 text-base font-medium rounded-lg capitalize transition-all duration-300 ${
                    filter === f ? "bg-white text-blue-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="text-base hover:bg-transparent border-indigo-50/50">
                <TableHead className="w-[300px] pl-8 h-14 font-semibold text-slate-600">Institution</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Students</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Status</TableHead>
                <TableHead className="text-right pr-8 h-14 font-semibold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    No institutions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInstitutions.map((inst) => (
                  <TableRow key={inst._id} className="group hover:bg-blue-50/30 transition-colors duration-300 border-indigo-50/50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100/50 shadow-sm">
                          <Building2 className="size-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-slate-900">{inst.institutionName}</div>
                          <div className="text-base text-slate-500">{inst.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-lg text-slate-900">{inst.studentCount}</div>
                      <div className="text-sm text-slate-500">Registered</div>
                    </TableCell>
                    <TableCell>
                      {inst.suspended ? (
                        <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-sm px-3 py-1">Suspended</Badge>
                      ) : inst.approved ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-sm px-3 py-1">Approved</Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 text-sm px-3 py-1">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-3">
                        {!inst.approved && !inst.suspended && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm rounded-lg"
                              disabled={busyId === inst._id}
                              onClick={() => openDialog(inst, "approve")}
                            >
                              <ShieldCheck className="size-4 mr-1.5" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                              disabled={busyId === inst._id}
                              onClick={() => openDialog(inst, "reject")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {inst.approved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                            disabled={busyId === inst._id}
                            onClick={() => openDialog(inst, inst.suspended ? "reinstate" : "suspend")}
                          >
                            <Ban className="size-4 mr-1.5" /> {inst.suspended ? "Reinstate" : "Suspend"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ ...actionDialog, isOpen: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize text-xl">{actionDialog.type} Institution</DialogTitle>
            <DialogDescription className="text-base mt-2 leading-relaxed">
              Are you sure you want to {actionDialog.type} <strong className="text-slate-900">{actionDialog.institution?.institutionName}</strong>?
              {actionDialog.type === "approve" && " This will allow them to issue cryptographic credentials on the network."}
              {actionDialog.type === "reject" && " This action is permanent and will delete their application."}
              {actionDialog.type === "suspend" && " This will temporarily block them from issuing credentials."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ ...actionDialog, isOpen: false })}>
              Cancel
            </Button>
            <Button 
              variant={actionDialog.type === "reject" || actionDialog.type === "suspend" ? "destructive" : "default"}
              onClick={handleAction}
            >
              Confirm {actionDialog.type}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
