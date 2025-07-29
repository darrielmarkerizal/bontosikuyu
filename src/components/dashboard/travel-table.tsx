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
import { MapPin } from "lucide-react";
import { formatDate } from "./utils";
import { DashboardData } from "./types";

interface TravelTableProps {
  data: DashboardData;
}

export function TravelTable({ data }: TravelTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Destinasi Wisata Terbaru
        </CardTitle>
        <CardDescription>
          Daftar destinasi wisata terbaru yang ditambahkan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Destinasi</TableHead>
                <TableHead>Dusun</TableHead>
                <TableHead>Tanggal Ditambahkan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentActivity.recentTravels.map((travel) => (
                <TableRow key={travel.id}>
                  <TableCell className="font-medium">{travel.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {travel.dusun}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(travel.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
