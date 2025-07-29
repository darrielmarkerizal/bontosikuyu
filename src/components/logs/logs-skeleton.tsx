import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton untuk header dan stats
function LogsHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

function LogsStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LogsFilterSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-48 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function LogsTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {[
                  "Aksi",
                  "Tabel",
                  "User ID",
                  "Deskripsi",
                  "Waktu",
                  "IP Address",
                  "User Agent",
                ].map((header) => (
                  <th key={header} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="border-b">
                  {Array(7)
                    .fill(0)
                    .map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LogsPaginationSkeleton() {
  return (
    <div className="flex justify-center mt-4">
      <Skeleton className="h-8 w-64 rounded-md" />
    </div>
  );
}

export function LogsSkeleton() {
  return (
    <div className="space-y-6">
      <LogsHeaderSkeleton />
      <LogsStatsSkeleton />
      <LogsFilterSkeleton />
      <LogsTableSkeleton />
      <LogsPaginationSkeleton />
    </div>
  );
}
