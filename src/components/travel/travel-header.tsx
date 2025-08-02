import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface TravelHeaderProps {
  onAddClick?: () => void;
}

export function TravelHeader({ onAddClick }: TravelHeaderProps) {
  const router = useRouter();

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      router.push("/dashboard/pariwisata/tambah");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Kelola Pariwisata</h1>
        <p className="text-muted-foreground">
          Buat, edit, dan kelola destinasi wisata di Desa Laiyolo Baru
        </p>
      </div>
      <Button className="w-fit" onClick={handleAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Wisata
      </Button>
    </div>
  );
}
