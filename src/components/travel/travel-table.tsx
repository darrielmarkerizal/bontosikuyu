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
import { Edit, Trash2, MapPin, Camera } from "lucide-react";
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
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Travel {
  id: number;
  name: string;
  dusun: string;
  image: string | null;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TravelTableProps {
  travels: Travel[];
  loading: boolean;
  onEdit: (travel: Travel) => void;
  onDelete: (travel: Travel) => void;
}

export function TravelTable({
  travels,
  loading,
  onEdit,
  onDelete,
}: TravelTableProps) {
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
      Pantai: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
      Gunung:
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      "Air Terjun":
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      Taman: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      Museum: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      "Tempat Ibadah":
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      Kuliner: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      Budaya:
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    };

    return (
      categoryColors[categoryName as keyof typeof categoryColors] ||
      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] min-w-[250px]">
                    Destinasi
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Kategori
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">Dusun</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Tanggal Dibuat
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
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
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

  if (travels.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Tidak ada destinasi wisata
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Belum ada data destinasi wisata yang tersedia.
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
                  <TableHead className="w-[40%] min-w-[250px]">
                    Destinasi
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Kategori
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">Dusun</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="w-[10%] min-w-[80px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {travels.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell className="align-middle">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {travel.image ? (
                                <img
                                  src={travel.image}
                                  alt={travel.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <Camera className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-sm truncate cursor-help">
                                {travel.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {travel.id}
                              </p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{travel.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className={`text-xs whitespace-nowrap ${getCategoryBadgeVariant(travel.category.name)}`}
                      >
                        {travel.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className={`text-xs whitespace-nowrap ${getDusunBadgeVariant(travel.dusun)}`}
                      >
                        {travel.dusun.replace("Dusun ", "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(travel.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(travel)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(travel)}>
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
