import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus, RefreshCw, Download, Filter } from "lucide-react";

interface TravelHeaderProps {
  onAdd: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onFilter: () => void;
}

export function TravelHeader({
  onAdd,
  onRefresh,
  onExport,
  onFilter,
}: TravelHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pariwisata Desa
              </h1>
              <p className="text-sm text-gray-600">
                Kelola destinasi wisata di Desa Laiyolo Baru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              className="hidden sm:flex"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Ekspor
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Wisata
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
