import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface LogsHeaderProps {
  onRefresh?: () => void;

  onFilter?: () => void;
  loading?: boolean;
}

export function LogsHeader({
  onRefresh,

  loading = false,
}: LogsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold leading-tight">
          Log Aktivitas
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Riwayat aktivitas sistem, login, perubahan data, dan lainnya.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}
