"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Users, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

interface UmkmBannerProps {
  totalUmkm: number;
  dusunCounts: Record<string, number>;
  categories: Category[];
}

export default function UmkmBanner({
  totalUmkm,
  dusunCounts,
  categories,
}: UmkmBannerProps) {
  const dusunList = Object.entries(dusunCounts);
  const topDusun = dusunList.sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format"
          alt="UMKM Background - Business and economic activity"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/90 via-brand-secondary/80 to-brand-primary/90"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 font-plus-jakarta-sans"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Ekonomi Desa
                </Badge>

                <h1 className="text-4xl lg:text-6xl font-sentient font-bold leading-tight">
                  UMKM Desa
                  <span className="block text-brand-primary">Laiyolo Baru</span>
                </h1>

                <p className="text-xl lg:text-2xl text-white/90 font-plus-jakarta-sans leading-relaxed max-w-2xl">
                  Temukan dan dukung usaha mikro kecil menengah yang
                  menggerakkan perekonomian masyarakat di Desa Laiyolo Baru,
                  Kepulauan Selayar.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-sentient">
                        {totalUmkm}
                      </div>
                      <div className="text-sm text-white/80 font-plus-jakarta-sans">
                        Total UMKM
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-brand-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-sentient">
                        {categories.length}
                      </div>
                      <div className="text-sm text-white/80 font-plus-jakarta-sans">
                        Kategori Usaha
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="space-y-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-brand-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-secondary font-sentient">
                        Sebaran UMKM per Dusun
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {dusunList.map(([dusun, count]) => (
                        <div
                          key={dusun}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700 font-plus-jakarta-sans">
                            {dusun.replace("Dusun ", "")}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-primary rounded-full transition-all duration-500"
                                style={{
                                  width: `${(count / Math.max(...dusunList.map(([, c]) => c))) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-brand-primary min-w-[2rem] text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {topDusun && (
                      <div className="mt-4 p-3 bg-brand-primary/5 rounded-lg border border-brand-primary/10">
                        <p className="text-sm text-brand-secondary font-plus-jakarta-sans">
                          <span className="font-semibold">{topDusun[0]}</span>{" "}
                          memiliki UMKM terbanyak dengan{" "}
                          <span className="font-semibold text-brand-primary">
                            {topDusun[1]} usaha
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-brand-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-secondary font-sentient">
                        Kategori Populer
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 6).map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 font-plus-jakarta-sans"
                        >
                          {category.name}
                        </Badge>
                      ))}
                      {categories.length > 6 && (
                        <Badge
                          variant="outline"
                          className="border-brand-primary/30 text-brand-primary font-plus-jakarta-sans"
                        >
                          +{categories.length - 6} lainnya
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
