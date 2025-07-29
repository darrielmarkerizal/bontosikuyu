import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UmkmHeaderProps {
  onAddClick: () => void;
}

export function UmkmHeader({ onAddClick }: UmkmHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">UMKM</h1>
        <p className="text-muted-foreground">
          Kelola data UMKM (Usaha Mikro, Kecil, dan Menengah) desa
        </p>
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Tambah UMKM
      </Button>
    </div>
  );
}
