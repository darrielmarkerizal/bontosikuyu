import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArticleHeaderProps {
  onAddClick?: () => void;
}

export function ArticleHeader({ onAddClick }: ArticleHeaderProps) {
  const router = useRouter();

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      router.push("/dashboard/artikel/tambah");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Kelola Artikel</h1>
        <p className="text-muted-foreground">
          Buat, edit, dan kelola artikel untuk website Kecamatan Bontosikuyu
        </p>
      </div>
      <Button className="w-fit" onClick={handleAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Artikel
      </Button>
    </div>
  );
}
