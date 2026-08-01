"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, FileBadge, Ban } from "lucide-react";

interface CredentialRow {
  _id: string;
  title: string;
  credentialType: string;
  status: "active" | "revoked";
  holderId: { name: string; email: string; studentIdNumber: string } | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [credentials, setCredentials] = useState<CredentialRow[]>([]);
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/credentials/issue");
    if (res.ok) {
      const data = await res.json();
      setCredentials(data.credentials);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRevoke(credentialId: string) {
    await fetch("/api/credentials/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentialId, reason: reason || "Revoked by issuing institution" }),
    });
    setReason("");
    setRevokingId(null);
    await load();
  }

  const filteredCredentials = useMemo(() => {
    return credentials.filter((c) => 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.credentialType.toLowerCase().includes(search.toLowerCase()) ||
      c.holderId?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [credentials, search]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issuance History</h1>
        <p className="text-sm text-slate-500 mt-1">Manage all verifiable credentials issued by your institution.</p>
      </div>

      <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">Issued Credentials</h2>
              <p className="text-xs mt-0.5 text-slate-500">Revoke a credential if it was issued in error or is no longer valid.</p>
            </div>
            <div className="relative max-w-xs w-full group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search by student or title..."
                className="pl-9 h-9 text-sm bg-white border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 shadow-sm rounded-lg transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="text-xs hover:bg-transparent border-indigo-50/50">
                  <TableHead className="w-[280px] pl-4 h-10 font-semibold text-slate-600">Credential</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600">Student</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="text-right pr-4 h-10 font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-sm text-slate-500">
                      No credentials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCredentials.map((c) => (
                    <TableRow key={c._id} className="group hover:bg-blue-50/30 transition-colors duration-300 border-indigo-50/50">
                      <TableCell className="pl-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-2 rounded-lg border border-purple-100/50 shadow-sm">
                            <FileBadge className="size-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{c.title}</div>
                            <div className="text-xs text-slate-500">{c.credentialType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="font-medium text-sm text-slate-700">{c.holderId?.name ?? "—"}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        {c.status === "active" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-xs px-2 py-0.5 font-medium">Active</Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-xs px-2 py-0.5 font-medium">Revoked</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-4 py-3">
                        {c.status === "active" && (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Dialog
                              open={revokingId === c._id}
                              onOpenChange={(open) => setRevokingId(open ? c._id : null)}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm rounded-md">
                                  <Ban className="size-3 mr-1" /> Revoke
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle className="text-lg">Revoke Credential</DialogTitle>
                                  <DialogDescription className="text-sm mt-1.5">
                                    Are you sure you want to revoke <strong className="text-slate-900">{c.title}</strong>? This immediately invalidates the credential for any future verification and cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 py-3">
                                  <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">Reason for Revocation</Label>
                                  <Input
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. issued in error"
                                    className="h-10 text-sm bg-white border-slate-200 focus-visible:ring-red-500/20 focus-visible:border-red-500 rounded-lg transition-all"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setRevokingId(null)} className="rounded-lg h-10 text-sm">
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleRevoke(c._id)} className="rounded-lg h-10 text-sm bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20">
                                    Confirm Revocation
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
