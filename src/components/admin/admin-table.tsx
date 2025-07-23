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
import { Edit, Mail, Trash2, MoreHorizontal, User, Shield } from "lucide-react";
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
import { Admin } from "./admin-types";

interface AdminTableProps {
  admins: Admin[];
  loading?: boolean;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export function AdminTable({
  admins,
  loading,
  onEdit,
  onDelete,
}: AdminTableProps) {
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
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Memuat data admin...</span>
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
                  <TableHead className="w-[30%] min-w-[200px]">
                    Informasi Admin
                  </TableHead>
                  <TableHead className="w-[25%] min-w-[180px]">Email</TableHead>
                  <TableHead className="w-[20%] min-w-[140px]">
                    Username
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[10%] min-w-[100px] text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="font-medium text-sm truncate cursor-help max-w-[150px]">
                                {admin.fullName}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{admin.fullName}</p>
                            </TooltipContent>
                          </Tooltip>
                          <p className="text-xs text-gray-500">
                            ID: {admin.id}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(admin.createdAt)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm truncate cursor-help max-w-[150px] block">
                              {admin.email}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{admin.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                          @{admin.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-current hover:text-current cursor-default pointer-events-none border-green-300"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Aktif
                        </Badge>
                      </div>
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
                          <DropdownMenuItem onClick={() => onEdit(admin)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDelete(admin)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Tidak ada admin ditemukan
              </h3>
              <p className="text-muted-foreground">
                Tidak ada admin yang sesuai dengan filter yang dipilih.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
