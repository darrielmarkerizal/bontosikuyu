import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogsFiltersProps {
  search: string;
  action: string;
  actionOptions: string[];
  onSearch: (val: string) => void;
  onActionFilter: (val: string) => void;
}

export function LogsFilters({
  search,
  action,
  actionOptions,
  onSearch,
  onActionFilter,
}: LogsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        placeholder="Cari log (deskripsi, user, tabel)..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select value={action} onValueChange={onActionFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Aksi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Aksi</SelectItem>
          {actionOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
