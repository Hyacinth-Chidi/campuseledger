"use client";

import { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Activity } from "lucide-react";

export function AdminLogsClient({ logs }: { logs: any[] }) {
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.actorId && (log.actorId.name || log.actorId.institutionName || log.actorId.email)?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [logs, search]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activity Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Full audit trail of all system actions across CampusLedger.</p>
      </div>

      <div className="border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col">
        <div className="bg-slate-50/50 border-b border-indigo-50/50 pb-3 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">System Logs</h2>
              <p className="text-xs mt-0.5 text-slate-500">Showing the latest 100 events.</p>
            </div>
            <div className="relative max-w-xs w-full group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search logs..."
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
                  <TableHead className="w-[300px] pl-4 h-10 font-semibold text-slate-600">Action</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600">Actor</TableHead>
                  <TableHead className="h-10 font-semibold text-slate-600 hidden md:table-cell">Metadata</TableHead>
                  <TableHead className="text-right pr-4 h-10 font-semibold text-slate-600">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-sm text-slate-500">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log._id} className="group hover:bg-blue-50/30 transition-colors duration-300 border-indigo-50/50">
                      <TableCell className="pl-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-2 rounded-lg border border-slate-200/50 shadow-sm">
                            <Activity className="size-4 text-slate-500" />
                          </div>
                          <div className="font-semibold text-sm text-slate-900">{log.action}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm text-slate-700">
                          {log.actorId ? (
                            <>{log.actorId.name || log.actorId.institutionName || log.actorId.email}</>
                          ) : (
                            <span className="text-slate-400 italic">System Action</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        {log.metadata ? (
                          <pre className="text-[10px] bg-slate-50 p-1.5 rounded border text-slate-600 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                            {JSON.stringify(log.metadata)}
                          </pre>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-4 py-3">
                        <div className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
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
