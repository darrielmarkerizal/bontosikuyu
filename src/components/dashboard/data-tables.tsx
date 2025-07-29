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
import { FileText, Store } from "lucide-react";
import { formatDate } from "./utils";
import { DashboardData } from "./types";

interface DataTablesProps {
  data: DashboardData;
}

export function DataTables({ data }: DataTablesProps) {
  const getStatusBadge = (status: string) => {
    return status === "publish" ? (
      <Badge
        variant="secondary"
        className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors"
      >
        Published
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="text-xs px-2 py-0.5 bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 transition-colors"
      >
        Draft
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Artikel Terbaru
          </CardTitle>
          <CardDescription>
            Daftar artikel terbaru yang ditambahkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.recentArticles.map((article) => (
                  <TableRow
                    key={article.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {article.writerName}
                    </TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(article.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* UMKM Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            UMKM Terbaru
          </CardTitle>
          <CardDescription>
            Daftar UMKM terbaru yang didaftarkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama UMKM</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Dusun</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.recentUmkm.map((umkm) => (
                  <TableRow
                    key={umkm.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium max-w-[150px] truncate">
                      {umkm.umkmName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {umkm.ownerName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {umkm.dusun}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(umkm.createdAt)}
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
