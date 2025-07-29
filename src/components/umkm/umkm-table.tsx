"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Store, Phone, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface Umkm {
  id: number;
  umkmName: string;
  ownerName: string;
  phone: string;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  image?: string; // Make image optional with ?
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "Dusun Pangkaje'ne":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
      case "Dusun Timoro":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      case "Dusun Kilotepo":
        return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };

  const getCategoryBadgeVariant = (categoryName: string) => {
    const categoryColors = {
      "Makanan & Minuman":
        "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      Kerajinan:
        "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      Jasa: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      Pertanian:
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      Perikanan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
      Peternakan:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      Perdagangan: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
      Industri:
        "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
    };

    return (
      categoryColors[categoryName as keyof typeof categoryColors] ||
      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    );
  };

  const formatPhone = (phone: string) => {
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%] min-w-[250px]">UMKM</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Pemilik
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">
                    Kategori
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">Dusun</TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Telepon
                  </TableHead>
                  <TableHead className="w-[10%] min-w-[80px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-8 bg-gray-200 rounded ml-auto"></div>
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

  if (umkmList.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
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
    <TooltipProvider>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%] min-w-[250px]">UMKM</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Pemilik
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">
                    Kategori
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">Dusun</TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Telepon
                  </TableHead>
                  <TableHead className="w-[10%] min-w-[80px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {umkmList.map((umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell className="align-middle">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {umkm.image ? (
                                <Image
                                  src={umkm.image}
                                  alt={umkm.umkmName}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <Store className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-sm truncate cursor-help">
                                {umkm.umkmName}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {umkm.id}
                              </p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{umkm.umkmName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span
                          className="text-sm font-medium truncate"
                          title={umkm.ownerName}
                        >
                          {umkm.ownerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className={`text-xs whitespace-nowrap ${getCategoryBadgeVariant(umkm.category.name)}`}
                      >
                        {umkm.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className={`text-xs whitespace-nowrap ${getDusunBadgeVariant(umkm.dusun)}`}
                      >
                        {umkm.dusun.replace("Dusun ", "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {formatPhone(umkm.phone)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <Store className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(umkm)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(umkm)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
