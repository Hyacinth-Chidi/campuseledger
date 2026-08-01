"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Issuance History</h1>
        <p className="text-lg text-slate-500 mt-2">Manage all verifiable credentials issued by your institution.</p>
      </div>

      <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-5 pt-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Issued Credentials</CardTitle>
              <CardDescription className="text-base mt-1">Revoke a credential if it was issued in error or is no longer valid.</CardDescription>
            </div>
            <div className="relative max-w-sm w-full group">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search by student or title..."
                className="pl-11 h-12 text-base bg-white border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 shadow-sm rounded-xl transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="text-base hover:bg-transparent border-indigo-50/50">
                <TableHead className="w-[300px] pl-8 h-14 font-semibold text-slate-600">Credential</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Student</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Status</TableHead>
                <TableHead className="text-right pr-8 h-14 font-semibold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCredentials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500 text-base">
                    No credentials found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCredentials.map((c) => (
                  <TableRow key={c._id} className="group hover:bg-blue-50/30 transition-colors duration-300 border-indigo-50/50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-2.5 rounded-xl border border-purple-100/50 shadow-sm">
                          <FileBadge className="size-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-slate-900">{c.title}</div>
                          <div className="text-base text-slate-500">{c.credentialType}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-700 text-base">{c.holderId?.name ?? "—"}</div>
                    </TableCell>
                    <TableCell>
                      {c.status === "active" ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-sm px-3 py-1 font-medium">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-sm px-3 py-1 font-medium">Revoked</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      {c.status === "active" && (
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Dialog
                            open={revokingId === c._id}
                            onOpenChange={(open) => setRevokingId(open ? c._id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm rounded-lg">
                                <Ban className="size-4 mr-1.5" /> Revoke
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="text-xl">Revoke Credential</DialogTitle>
                                <DialogDescription className="text-base mt-2">
                                  Are you sure you want to revoke <strong className="text-slate-900">{c.title}</strong>? This immediately invalidates the credential for any future verification and cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 py-4">
                                <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">Reason for Revocation</Label>
                                <Input
                                  id="reason"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                  placeholder="e.g. issued in error"
                                  className="h-12 bg-white border-slate-200 focus-visible:ring-red-500/20 focus-visible:border-red-500 rounded-xl transition-all text-base"
                                />
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setRevokingId(null)} className="rounded-xl h-12 text-base">
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={() => handleRevoke(c._id)} className="rounded-xl h-12 text-base bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20">
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
        </CardContent>
      </Card>
    </div>
  );
}
