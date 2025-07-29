import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Phone, Store } from "lucide-react";
import { Umkm } from "./umkm-types";

interface UmkmTableProps {
  umkmList: Umkm[];
  loading: boolean;
  onEdit: (umkm: Umkm) => void;
  onDelete: (umkm: Umkm) => void;
}

export function UmkmTable({
  umkmList,
  loading,
  onEdit,
  onDelete,
}: UmkmTableProps) {
  const getDusunBadgeVariant = (dusun: string) => {
    switch (dusun) {
      case "Dusun Laiyolo":
        return "bg-blue-50 text-blue-700 hover:bg-blue-100";
      case "Dusun Pangkaje'ne":
        return "bg-purple-50 text-purple-700 hover:bg-purple-100";
      case "Dusun Timoro":
        return "bg-green-50 text-green-700 hover:bg-green-100";
      case "Dusun Kilotepo":
        return "bg-orange-50 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
  };

  const getCategoryBadgeVariant = (categoryName: string) => {
    // Soft colors for categories
    const categoryColors = {
      "Makanan & Minuman": "bg-red-50 text-red-700 hover:bg-red-100",
      Kerajinan: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      Jasa: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      Pertanian: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      Perikanan: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
      Peternakan: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      Perdagangan: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      Industri: "bg-slate-50 text-slate-700 hover:bg-slate-100",
    };

    return (
      categoryColors[categoryName as keyof typeof categoryColors] ||
      "bg-gray-50 text-gray-700 hover:bg-gray-100"
    );
  };

  const formatPhone = (phone: string) => {
    // Format phone number for better display
    if (phone.length === 11) {
      return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7)}`;
    } else if (phone.length === 12) {
      return `${phone.slice(0, 4)}-${phone.slice(4, 8)}-${phone.slice(8)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar UMKM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (umkmList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar UMKM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Store className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Tidak ada UMKM
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Belum ada data UMKM yang tersedia.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar UMKM</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UMKM</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Dusun</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {umkmList.map((umkm) => (
              <TableRow key={umkm.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={umkm.image} alt={umkm.umkmName} />
                      <AvatarFallback>
                        <Store className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{umkm.umkmName}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {umkm.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{umkm.ownerName}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getCategoryBadgeVariant(umkm.category.name)}`}
                  >
                    {umkm.category.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getDusunBadgeVariant(umkm.dusun)}`}
                  >
                    {umkm.dusun.replace("Dusun ", "")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {formatPhone(umkm.phone)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(umkm)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(umkm)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
