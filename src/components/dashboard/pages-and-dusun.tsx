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
import { Eye, Building2 } from "lucide-react";
import { formatNumber } from "./utils";
import { DashboardData } from "./types";

interface PagesAndDusunProps {
  data: DashboardData;
}

export function PagesAndDusun({ data }: PagesAndDusunProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Halaman Terpopuler
          </CardTitle>
          <CardDescription>
            10 halaman dengan tayangan tertinggi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Halaman</TableHead>
                  <TableHead>Jumlah Tayangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.trafficInsights.topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {page.page}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatNumber(page.views)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dusun Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Distribusi UMKM per Dusun
          </CardTitle>
          <CardDescription>Jumlah UMKM berdasarkan dusun</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.quickStats.umkmByDusun).map(
              ([dusun, count]) => (
                <div
                  key={dusun}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">{dusun}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{count}</span>
                    <span className="text-xs text-muted-foreground">UMKM</span>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
