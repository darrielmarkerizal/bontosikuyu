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
import { Edit, Phone, Trash2, MoreHorizontal, User } from "lucide-react";
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
import { Writer } from "./writer-types";
import Link from "next/link";

interface WriterTableProps {
  writers: Writer[];
  loading?: boolean;
  onEdit: (writer: Writer) => void;
  onDelete: (writer: Writer) => void;
}

export function WriterTable({
  writers,
  loading,
  onEdit,
  onDelete,
}: WriterTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch {
      return "Invalid Date";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for better readability
    if (phone.startsWith("08")) {
      return phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
    }
    return phone;
  };

  const getDusunBadgeColor = (dusun: string) => {
    const colors = {
      "Dusun Pangkaje'ne":
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      "Dusun Laiyolo":
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      "Dusun Bontosikuyu":
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      "Dusun Selayar":
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      "Dusun Tambak":
        "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
      "Dusun Lantang":
        "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
      "Dusun Bontosikuyu Selatan":
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      "Dusun Bontosikuyu Utara":
        "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
    };
    return (
      colors[dusun as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Memuat data penulis...</span>
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
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-[25%] min-w-[180px]">
                    Nama Lengkap
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[160px]">
                    Nomor Telepon
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[140px]">Dusun</TableHead>
                  <TableHead className="w-[20%] min-w-[120px]">
                    Tanggal Daftar
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {writers.map((writer) => (
                  <TableRow
                    key={writer.id}
                    className="hover:bg-muted/30 transition-colors duration-200"
                  >
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-3 group">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                          <User className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                        </div>
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/dashboard/penulis/${writer.id}`}
                                className="font-medium text-sm truncate cursor-pointer max-w-[150px] group-hover:text-foreground transition-colors duration-200 hover:underline"
                              >
                                {writer.fullName}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Klik untuk melihat detail</p>
                            </TooltipContent>
                          </Tooltip>
                          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                            ID: {writer.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2 group">
                        <Phone className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                        <span className="text-sm font-mono group-hover:text-foreground transition-colors duration-200">
                          {formatPhoneNumber(writer.phoneNumber)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        variant="outline"
                        className={`${getDusunBadgeColor(writer.dusun)} text-xs font-medium transition-all duration-200 hover:scale-105`}
                      >
                        {writer.dusun}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <span className="text-sm text-gray-600 whitespace-nowrap group-hover:text-foreground transition-colors duration-200">
                        {formatDate(writer.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors duration-200"
                          >
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit(writer)}
                            className="hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Penulis
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                            onClick={() => onDelete(writer)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Penulis
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {writers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Tidak ada penulis ditemukan
              </h3>
              <p className="text-muted-foreground">
                Tidak ada penulis yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
