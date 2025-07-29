import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Header skeleton
function AdminHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

// Stats skeleton
function AdminStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Filter skeleton
function AdminFilterSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 w-full lg:w-96 rounded-md" />
            <Skeleton className="h-10 w-full lg:w-48 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Table skeleton
function AdminTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {["Informasi Admin", "Email", "Username", "Status", "Aksi"].map(
                  (header) => (
                    <th key={header} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="border-b">
                  {/* Admin Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </td>

                  {/* Username */}
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-24 rounded" />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="h-8 w-8 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Pagination skeleton
function AdminPaginationSkeleton() {
  return (
    <div className="flex justify-center mt-4">
      <Skeleton className="h-8 w-64 rounded-md" />
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <AdminHeaderSkeleton />
      <AdminStatsSkeleton />
      <AdminFilterSkeleton />
      <AdminTableSkeleton />
      <AdminPaginationSkeleton />
    </div>
  );
}
