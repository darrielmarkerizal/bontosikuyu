import { Suspense } from "react";
import { Metadata } from "next";
import UmkmPageContent from "@/components/umkm/umkm-content";

export const metadata: Metadata = {
  title: "UMKM Desa Laiyolo Baru",
  description:
    "Temukan dan dukung usaha mikro kecil menengah di Desa Laiyolo Baru, Kepulauan Selayar",
  keywords: "UMKM, usaha, ekonomi, desa laiyolo baru, selayar",
  openGraph: {
    title: "UMKM Desa Laiyolo Baru",
    description:
      "Temukan dan dukung usaha mikro kecil menengah di Desa Laiyolo Baru",
    type: "website",
  },
};

function UmkmLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner Skeleton */}
      <div className="relative h-[60vh] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/80 to-brand-primary/80">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl space-y-6">
              <div className="h-4 bg-white/20 rounded w-32"></div>
              <div className="h-12 bg-white/20 rounded w-96"></div>
              <div className="h-6 bg-white/20 rounded w-80"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-11 bg-gray-200 rounded"></div>
              <div className="h-11 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UmkmContent() {
  return <UmkmPageContent />;
}

export default function UmkmPage() {
  return (
    <Suspense fallback={<UmkmLoadingSkeleton />}>
      <UmkmContent />
    </Suspense>
  );
}

// Import the main content component
