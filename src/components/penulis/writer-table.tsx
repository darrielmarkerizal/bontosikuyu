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
import { Writer, dusunColors } from "./writer-types";

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
                <TableRow>
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
                  <TableRow key={writer.id}>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="font-medium text-sm truncate cursor-help max-w-[150px]">
                                {writer.fullName}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{writer.fullName}</p>
                            </TooltipContent>
                          </Tooltip>
                          <p className="text-xs text-gray-500">
                            ID: {writer.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-mono">
                          {formatPhoneNumber(writer.phoneNumber)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge
                        className={`${dusunColors[writer.dusun]} whitespace-nowrap`}
                      >
                        {writer.dusun}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(writer.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(writer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Penulis
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
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
