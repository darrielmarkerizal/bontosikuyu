import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Activity } from "lucide-react";
import { formatDate } from "./utils";
import { DashboardData } from "./types";

interface WritersAndLogsProps {
  data: DashboardData;
}

export function WritersAndLogs({ data }: WritersAndLogsProps) {
  const getActionBadge = (action: string) => {
    const baseClasses =
      "text-xs font-medium px-1.5 py-0.5 rounded-md transition-colors";

    switch (action) {
      case "CREATE":
        return (
          <Badge
            className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100`}
          >
            CREATE
          </Badge>
        );
      case "UPDATE":
        return (
          <Badge
            className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`}
          >
            UPDATE
          </Badge>
        );
      case "DELETE":
        return (
          <Badge
            className={`${baseClasses} bg-red-50 text-red-700 border-red-200 hover:bg-red-100`}
          >
            DELETE
          </Badge>
        );
      case "LOGIN":
        return (
          <Badge
            className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100`}
          >
            LOGIN
          </Badge>
        );
      case "LOGOUT":
        return (
          <Badge
            className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100`}
          >
            LOGOUT
          </Badge>
        );
      case "VIEW":
        return (
          <Badge
            className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`}
          >
            VIEW
          </Badge>
        );
      case "DOWNLOAD":
        return (
          <Badge
            className={`${baseClasses} bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100`}
          >
            DOWNLOAD
          </Badge>
        );
      case "UPLOAD":
        return (
          <Badge
            className={`${baseClasses} bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100`}
          >
            UPLOAD
          </Badge>
        );
      default:
        return (
          <Badge
            className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100`}
          >
            {action}
          </Badge>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Writers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Penulis Terproduktif
          </CardTitle>
          <CardDescription>
            Penulis dengan jumlah artikel terbanyak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Penulis</TableHead>
                  <TableHead>Dusun</TableHead>
                  <TableHead>Jumlah Artikel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.topWriters.map((writer) => (
                  <TableRow
                    key={writer.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {writer.fullName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {writer.dusun}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors font-medium"
                      >
                        {writer.articleCount} artikel
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
          <CardDescription>Log aktivitas sistem terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tabel</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.recentLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {log.description}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.tableName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.ipAddress || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
