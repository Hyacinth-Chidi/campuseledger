"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CopyField } from "@/components/shared/copy-field";
import { UserPlus, Search, User, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface StudentRow {
  _id: string;
  name: string;
  email: string;
  studentIdNumber: string;
  status: "invited" | "active";
  createdAt: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");
  
  // Invite Form State
  const [name, setName] = useState("");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reinvitingId, setReinvitingId] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    const res = await fetch("/api/students/invite");
    if (res.ok) {
      const data = await res.json();
      setStudents(data.students);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/students/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, studentIdNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not invite student");
      
      setSuccessMessage(`Successfully invited ${name}! An email has been sent with activation instructions.`);
      setName("");
      setStudentIdNumber("");
      setEmail("");
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not invite student");
    } finally {
      setLoading(false);
    }
  }

  async function handleReinvite(studentId: string) {
    setReinvitingId(studentId);
    try {
      const res = await fetch(`/api/students/${studentId}/reinvite`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend invite");
      toast.success("Invitation resent!", { description: "A new activation email has been sent to the student." });
    } catch (err) {
      toast.error("Failed to resend invite", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setReinvitingId(null);
    }
  }

  const filteredStudents = useMemo(() => {
    return students.filter((s) => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your roster and invite new students to the network.</p>
      </div>

      <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
          <h2 className="text-base font-bold tracking-tight text-slate-900">Invite a Student</h2>
          <p className="text-xs mt-0.5 text-slate-500">
            Invite a student to your institution&apos;s network. They will automatically receive an email with instructions to activate their account.
          </p>
        </div>
        <div className="p-4 space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 rounded-lg">
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 rounded-lg">
              <AlertDescription className="text-sm font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-9 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="studentIdNumber" className="text-xs font-semibold text-slate-700">Student ID</Label>
              <Input
                id="studentIdNumber"
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                required
                className="h-9 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all"
              />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg transition-all" />
            </div>
            <Button type="submit" disabled={loading} className="h-9 md:col-span-1 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 rounded-lg transition-all font-semibold text-sm">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <><UserPlus className="mr-1.5 size-4" /> Invite Student</>}
            </Button>
          </form>
        </div>
      </div>

      <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">Student Roster</h2>
              <p className="text-xs mt-0.5 text-slate-500">All students invited by your institution.</p>
            </div>
            <div className="relative max-w-xs w-full group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search students..."
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
                  <TableHead className="w-[280px] pl-4 h-10 font-semibold text-slate-600">Student</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600">Student ID</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600">Joined Date</TableHead>
                  <TableHead className="text-right pr-4 h-10 font-semibold text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((s) => (
                    <TableRow key={s._id} className="group hover:bg-blue-50/30 transition-colors duration-300 border-indigo-50/50">
                      <TableCell className="pl-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100/50 shadow-sm">
                            <User className="size-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="font-medium text-sm text-slate-700">{s.studentIdNumber}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        {s.status === "active" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-xs px-2 py-0.5 font-medium">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 text-xs px-2 py-0.5 font-medium">Invited</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 py-3">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right pr-4 py-3">
                        {s.status === "invited" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm rounded-md"
                            disabled={reinvitingId === s._id}
                            onClick={() => handleReinvite(s._id)}
                          >
                            {reinvitingId === s._id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <><RefreshCw className="size-3 mr-1" /> Resend Invite</>
                            )}
                          </Button>
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
