"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Students</h1>
        <p className="text-lg text-slate-500 mt-2">Manage your roster and invite new students to the network.</p>
      </div>

      <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-6">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Invite a Student</CardTitle>
          <CardDescription className="text-base mt-1">
            Invite a student to your institution's network. They will automatically receive an email with instructions to activate their account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900 rounded-xl">
              <AlertDescription className="text-base font-medium">{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 rounded-xl">
              <AlertDescription className="text-base font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentIdNumber" className="text-sm font-semibold text-slate-700">Student ID</Label>
              <Input
                id="studentIdNumber"
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl transition-all" />
            </div>
            <Button type="submit" disabled={loading} className="h-12 md:col-span-1 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl transition-all font-semibold text-base">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <><UserPlus className="mr-2 size-5" /> Invite Student</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-indigo-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardHeader className="bg-slate-50/50 border-b border-indigo-50/50 pb-5 pt-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">Student Roster</CardTitle>
              <CardDescription className="text-base mt-1">All students invited by your institution.</CardDescription>
            </div>
            <div className="relative max-w-sm w-full group">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search students..."
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
                <TableHead className="w-[300px] pl-8 h-14 font-semibold text-slate-600">Student</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Student ID</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Status</TableHead>
                <TableHead className="h-14 font-semibold text-slate-600">Joined Date</TableHead>
                <TableHead className="text-right pr-8 h-14 font-semibold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500 text-base">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((s) => (
                  <TableRow key={s._id} className="group hover:bg-blue-50/30 transition-colors duration-300 border-indigo-50/50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5 rounded-xl border border-blue-100/50 shadow-sm">
                          <User className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-slate-900">{s.name}</div>
                          <div className="text-base text-slate-500">{s.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-700 text-base">{s.studentIdNumber}</div>
                    </TableCell>
                    <TableCell>
                      {s.status === "active" ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-sm px-3 py-1 font-medium">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 text-sm px-3 py-1 font-medium">Invited</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-base text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      {s.status === "invited" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm rounded-lg"
                          disabled={reinvitingId === s._id}
                          onClick={() => handleReinvite(s._id)}
                        >
                          {reinvitingId === s._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <><RefreshCw className="size-4 mr-1.5" /> Resend Invite</>
                          )}
                        </Button>
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
