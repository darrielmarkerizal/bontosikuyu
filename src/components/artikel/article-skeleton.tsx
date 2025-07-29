"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="py-4">
              <Skeleton className="h-4 w-24 mb-3 rounded" />
              <Skeleton className="h-8 w-20 mb-2 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 w-full lg:w-1/2 rounded-md" />
            <Skeleton className="h-10 w-full lg:w-48 rounded-md" />
            <Skeleton className="h-10 w-full lg:w-48 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="py-3 px-4">
                    <Skeleton className="h-4 w-24 mx-auto rounded" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-4 w-16 mx-auto rounded" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-4 w-20 mx-auto rounded" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-4 w-14 mx-auto rounded" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-4 w-20 mx-auto rounded" />
                  </th>
                  <th className="py-3 px-4">
                    <Skeleton className="h-4 w-12 mx-auto rounded" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-40 mb-2 rounded" />
                      <Skeleton className="h-3 w-32 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-24 mb-1 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </td>
                    <td className="py-4 px-4">
                      <Skeleton className="h-4 w-20 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
