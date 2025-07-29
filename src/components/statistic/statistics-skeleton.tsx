import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Header skeleton
function StatisticsHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

// Overview cards skeleton
function StatisticsOverviewSkeleton() {
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

// Filter skeleton
function StatisticsFilterSkeleton() {
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

// Charts skeleton - First Row (Daily Trends and Device Breakdown)
function StatisticsChartsFirstRowSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Daily Trends Line Chart */}
      <Card className="lg:col-span-2 w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full h-[250px] sm:h-[300px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown Pie Chart */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full h-[250px] sm:h-[300px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Charts skeleton - Second Row (Hourly Activity and Weekly Patterns)
function StatisticsChartsSecondRowSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Hourly Activity Area Chart */}
      <Card className="lg:col-span-2 w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            <Skeleton className="h-5 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full h-[250px] sm:h-[300px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Patterns Bar Chart */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full h-[250px] sm:h-[300px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Charts skeleton - Third Row (Browser and Country Stats)
function StatisticsChartsThirdRowSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Top Browsers Pie Chart */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            <Skeleton className="h-5 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full h-[250px] sm:h-[300px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Top Countries Bar Chart */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full h-[250px] sm:h-[300px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Tables skeleton
function StatisticsTablesSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Top Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {["Halaman", "Tayangan", "Waktu Rata-rata", "Pengunjung"].map(
                    (header) => (
                      <th key={header} className="px-4 py-3 text-left">
                        <Skeleton className="h-4 w-20" />
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array(4)
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

      {/* User Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {["Metrik", "Nilai", "Persentase"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array(3)
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
    </div>
  );
}

export function StatisticsSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <StatisticsHeaderSkeleton />
      <StatisticsOverviewSkeleton />
      <StatisticsFilterSkeleton />

      {/* Charts Section */}
      <StatisticsChartsFirstRowSkeleton />
      <StatisticsChartsSecondRowSkeleton />
      <StatisticsChartsThirdRowSkeleton />

      {/* Tables Section */}
      <StatisticsTablesSkeleton />
    </div>
  );
}
