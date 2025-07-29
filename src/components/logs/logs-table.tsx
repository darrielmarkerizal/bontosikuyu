import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Log } from "./logs-types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Activity,
  Database,
  User,
  FileText,
  Clock,
  Globe,
  Monitor,
  Info,
} from "lucide-react";

interface LogsTableProps {
  logs: Log[];
  loading?: boolean;
}

// Function to get action badge variant
const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case "LOGIN":
      return "default";
    case "LOGOUT":
      return "secondary";
    case "CREATE":
      return "default"; // Changed from "success"
    case "UPDATE":
      return "secondary"; // Changed from "warning"
    case "DELETE":
      return "destructive";
    case "VIEW":
      return "outline";
    case "DOWNLOAD":
      return "outline";
    case "UPLOAD":
      return "outline";
    default:
      return "outline";
  }
};

// Function to get action icon
const getActionIcon = (action: string) => {
  switch (action) {
    case "LOGIN":
      return "🔑";
    case "LOGOUT":
      return "🚪";
    case "CREATE":
      return "➕";
    case "UPDATE":
      return "✏️";
    case "DELETE":
      return "🗑️";
    case "VIEW":
      return "👁️";
    case "DOWNLOAD":
      return "⬇️";
    case "UPLOAD":
      return "⬆️";
    default:
      return "📝";
  }
};

// Function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "-";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Function to parse user agent for better display
const parseUserAgent = (userAgent: string | null) => {
  if (!userAgent)
    return { browser: "Unknown", os: "Unknown", device: "Unknown" };

  const ua = userAgent.toLowerCase();

  // Browser detection
  let browser = "Unknown";
  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";

  // OS detection
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("iphone")) os = "iOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";

  // Device detection
  let device = "Desktop";
  if (ua.includes("mobile")) device = "Mobile";
  else if (ua.includes("tablet")) device = "Tablet";

  return { browser, os, device };
};

export function LogsTable({ logs, loading }: LogsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Memuat data log...</span>
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
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Aksi
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Tabel
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User ID
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Deskripsi
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Waktu
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      IP Address
                    </div>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      User Agent
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const userAgentInfo = parseUserAgent(log.userAgent);
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant={getActionBadgeVariant(log.action)}
                              className="text-xs"
                            >
                              <span className="mr-1">
                                {getActionIcon(log.action)}
                              </span>
                              {log.action}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>Aksi:</strong> {log.action}
                            </p>
                            <p className="text-xs">
                              <strong>Deskripsi:</strong>{" "}
                              {log.description || "Tidak ada deskripsi"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm font-mono">
                              {log.tableName || "-"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>Tabel:</strong>{" "}
                              {log.tableName || "Tidak ada tabel"}
                            </p>
                            {log.recordId && (
                              <p className="text-xs">
                                <strong>Record ID:</strong> {log.recordId}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm font-mono">
                              {log.userId || "-"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>User ID:</strong>{" "}
                              {log.userId || "Tidak ada user"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm truncate block">
                              {truncateText(log.description || "-", 40)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs whitespace-pre-wrap">
                              {log.description || "Tidak ada deskripsi"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm font-mono">
                              {format(
                                new Date(log.createdAt),
                                "dd MMM yyyy HH:mm",
                                {
                                  locale: id,
                                }
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>Waktu:</strong>{" "}
                              {format(
                                new Date(log.createdAt),
                                "dd MMMM yyyy HH:mm:ss",
                                {
                                  locale: id,
                                }
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-sm font-mono">
                              {log.ipAddress || "-"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <strong>IP Address:</strong>{" "}
                              {log.ipAddress || "Tidak ada IP"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1">
                              <span className="text-xs">
                                {userAgentInfo.browser} / {userAgentInfo.os}
                              </span>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="text-xs space-y-1">
                              <p>
                                <strong>Browser:</strong>{" "}
                                {userAgentInfo.browser}
                              </p>
                              <p>
                                <strong>OS:</strong> {userAgentInfo.os}
                              </p>
                              <p>
                                <strong>Device:</strong> {userAgentInfo.device}
                              </p>
                              <p className="text-muted-foreground mt-2 border-t pt-1">
                                <strong>Full User Agent:</strong>
                              </p>
                              <p className="text-muted-foreground font-mono text-xs break-all">
                                {log.userAgent || "Tidak ada user agent"}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {logs.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">Tidak ada log ditemukan</h3>
                <p className="text-muted-foreground">
                  Tidak ada aktivitas yang tercatat saat ini.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
