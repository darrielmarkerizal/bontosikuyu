"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar, Shield } from "lucide-react";

interface AdminStatsProps {
  totalAdmins: number;
}

export function AdminStats({ totalAdmins }: AdminStatsProps) {
  const activeAdmins = totalAdmins; // All admins are considered active
  const averageAdmins = totalAdmins; // Since we only have one stat

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAdmins}</div>
          <p className="text-xs text-muted-foreground">Semua admin terdaftar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admin Aktif</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {activeAdmins}
          </div>
          <p className="text-xs text-muted-foreground">
            Admin yang dapat login
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Level Akses</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">Super</div>
          <p className="text-xs text-muted-foreground">Akses penuh sistem</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registrasi</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {totalAdmins > 0 ? "Aktif" : "Belum Ada"}
          </div>
          <p className="text-xs text-muted-foreground">Status pendaftaran</p>
        </CardContent>
      </Card>
    </div>
  );
}
