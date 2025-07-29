import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Log } from "./logs-types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface LogsTableProps {
  logs: Log[];
  loading?: boolean;
}

export function LogsTable({ logs, loading }: LogsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Memuat data log...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aksi</TableHead>
                <TableHead>Tabel</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.tableName || "-"}</TableCell>
                  <TableCell>{log.userId || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.description || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.createdAt), "dd MMM yyyy HH:mm", {
                      locale: id,
                    })}
                  </TableCell>
                  <TableCell>{log.ipAddress || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.userAgent || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {logs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              Tidak ada log ditemukan
            </h3>
            <p className="text-muted-foreground">
              Tidak ada aktivitas yang tercatat.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
