import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WriterHeaderProps {
  onAddClick?: () => void;
}

export function WriterHeader({ onAddClick }: WriterHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Kelola Penulis</h1>
        <p className="text-muted-foreground">
          Kelola data penulis artikel untuk website Desa Laiyolo Baru
        </p>
      </div>
      <Button className="w-fit" onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Penulis
      </Button>
    </div>
  );
}
