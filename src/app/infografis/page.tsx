"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  totalPopulation,
  religionData,
  ageGroupData,
  educationData,
  occupationData,
  summaryStats,
  territoryData,
  locationData,
  geographicStats,
  dataMetadata,
} from "@/data/infografis-data";

gsap.registerPlugin(ScrollTrigger);

export default function InfografisPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    const header = headerRef.current;
    const stats = statsRef.current;

    if (!page || !header || !stats) return;

    // Set initial states
    gsap.set([header, stats], { opacity: 0, y: 50 });

    // Animate elements on page load
    const tl = gsap.timeline();

    tl.to(header, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }).to(
      stats,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Animate cards on scroll
    const cards = page.querySelectorAll(".infographic-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const calculatePercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  // Calculate total working population for occupation percentages
  const totalWorkingPopulation = occupationData.reduce((total, occupation) => {
    return (
      total + (occupation.subcategories ? occupation.total! : occupation.count!)
    );
  }, 0);

  // Prepare chart data
  const genderChartData = [
    {
      name: "Laki-laki",
      value: totalPopulation.male,
      percentage: calculatePercentage(
        totalPopulation.male,
        totalPopulation.total
      ),
      fill: "#173A57", // brand-secondary
    },
    {
      name: "Perempuan",
      value: totalPopulation.female,
      percentage: calculatePercentage(
        totalPopulation.female,
        totalPopulation.total
      ),
      fill: "#21BCA8", // brand-accent
    },
  ];

  const religionChartData = religionData.map((religion, index) => ({
    name: religion.religion,
    value: religion.count,
    percentage: religion.percentage,
    fill:
      index === 0
        ? "#173A57"
        : index === 1
          ? "#F8B72C"
          : index === 2
            ? "#21BCA8"
            : "#6B7280",
  }));

  const ageChartData = ageGroupData.map((group) => ({
    name: group.ageGroup,
    value: group.count,
    percentage: calculatePercentage(group.count, totalPopulation.total),
    fill: group.color,
  }));

  const educationChartData = educationData.map((education) => ({
    name: education.level,
    value: education.count,
    fill: education.color,
  }));

  const occupationChartData = occupationData
    .filter((occupation) => !occupation.subcategories)
    .map((occupation) => ({
      name:
        occupation.category.length > 15
          ? occupation.category.substring(0, 15) + "..."
          : occupation.category,
      fullName: occupation.category,
      value: occupation.count!,
      fill: occupation.color,
    }));

  const chartConfig = {
    value: {
      label: "Jumlah",
    },
    percentage: {
      label: "Persentase",
    },
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-gradient-to-r from-brand-secondary to-gray-900 text-white"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold mb-6">
              Infografis Desa Laiyolo Baru
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-plus-jakarta-sans leading-relaxed max-w-3xl mx-auto mb-4">
              Data demografis dan statistik kependudukan Desa Laiyolo Baru,
              Kecamatan Bontosikuyu, Kabupaten Kepulauan Selayar
            </p>
            <div className="text-sm text-gray-300 font-plus-jakarta-sans">
              Terakhir diperbarui: {dataMetadata.lastUpdated} oleh{" "}
              {dataMetadata.updatedBy}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Summary Statistics */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {summaryStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div
                  className={`text-2xl md:text-3xl font-sentient font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 font-plus-jakarta-sans">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          {/* Gender Distribution with Chart */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">👫</span>
                Distribusi Jenis Kelamin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-plus-jakarta-sans font-medium">
                        Laki-laki
                      </span>
                      <span className="font-sentient font-bold text-brand-secondary">
                        {totalPopulation.male} orang (
                        {calculatePercentage(
                          totalPopulation.male,
                          totalPopulation.total
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={calculatePercentage(
                        totalPopulation.male,
                        totalPopulation.total
                      )}
                      className="h-3"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-plus-jakarta-sans font-medium">
                        Perempuan
                      </span>
                      <span className="font-sentient font-bold text-brand-accent">
                        {totalPopulation.female} orang (
                        {calculatePercentage(
                          totalPopulation.female,
                          totalPopulation.total
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={calculatePercentage(
                        totalPopulation.female,
                        totalPopulation.total
                      )}
                      className="h-3"
                    />
                  </div>
                  <div className="text-center bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-2xl p-6">
                    <div className="text-3xl font-sentient font-bold text-brand-secondary mb-2">
                      {totalPopulation.total}
                    </div>
                    <p className="text-gray-600 font-plus-jakarta-sans mb-2">
                      Total Penduduk
                    </p>
                    <div className="text-lg font-sentient font-bold text-brand-primary">
                      {totalPopulation.households}
                    </div>
                    <p className="text-sm text-gray-500 font-plus-jakarta-sans">
                      Kepala Keluarga
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-sentient font-semibold text-center mb-4 text-brand-secondary">
                    Diagram Distribusi Gender
                  </h4>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={genderChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                        labelLine={false}
                      >
                        {genderChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `${value} orang`,
                              name as string,
                            ]}
                          />
                        }
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Religion Data with Chart */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">🕌</span>
                Distribusi Agama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {religionData.map((religion, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-plus-jakarta-sans font-medium">
                          {religion.religion}
                        </span>
                        <span className="font-sentient font-bold text-brand-secondary">
                          {religion.count} orang ({religion.percentage}%)
                        </span>
                      </div>
                      <Progress value={religion.percentage} className="h-3" />
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-lg font-sentient font-semibold text-center mb-4 text-brand-secondary">
                    Diagram Distribusi Agama
                  </h4>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart
                      data={religionChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `${value} orang`,
                              name as string,
                            ]}
                          />
                        }
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Age Groups with Chart */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">👶</span>
                Kelompok Usia Pendidikan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="grid gap-4">
                  {ageGroupData.map((group, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-plus-jakarta-sans font-medium">
                            {group.ageGroup}
                          </span>
                          <p className="text-sm text-gray-500">
                            {group.description}
                          </p>
                        </div>
                        <span
                          className="font-sentient font-bold text-xl"
                          style={{ color: group.color }}
                        >
                          {group.count}
                        </span>
                      </div>
                      <Progress
                        value={calculatePercentage(
                          group.count,
                          totalPopulation.total
                        )}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {calculatePercentage(
                          group.count,
                          totalPopulation.total
                        )}
                        % dari total populasi
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-lg font-sentient font-semibold text-center mb-4 text-brand-secondary">
                    Diagram Kelompok Usia
                  </h4>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={ageChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percentage }) => `${percentage}%`}
                      >
                        {ageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `${value} orang`,
                              name as string,
                            ]}
                          />
                        }
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Level with Chart */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">🎓</span>
                Tingkat Pendidikan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="grid gap-4">
                  {educationData.map((education, index) => {
                    const totalEducated = educationData.reduce(
                      (sum, item) => sum + item.count,
                      0
                    );
                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-plus-jakarta-sans font-medium">
                            {education.level}
                          </span>
                          <span
                            className="font-sentient font-bold text-xl"
                            style={{ color: education.color }}
                          >
                            {education.count}
                          </span>
                        </div>
                        <Progress
                          value={calculatePercentage(
                            education.count,
                            totalEducated
                          )}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {calculatePercentage(education.count, totalEducated)}%
                          dari total terdidik
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <h4 className="text-lg font-sentient font-semibold text-center mb-4 text-brand-secondary">
                    Diagram Tingkat Pendidikan
                  </h4>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <AreaChart
                      data={educationChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `${value} orang`,
                              name as string,
                            ]}
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#173A57"
                        fill="#173A57"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Occupation Data with Chart */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">💼</span>
                Mata Pencaharian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {occupationData.map((occupation, index) => {
                    const count = occupation.subcategories
                      ? occupation.total!
                      : occupation.count!;
                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-plus-jakarta-sans font-semibold text-sm">
                            {occupation.category}
                          </span>
                          <span
                            className="font-sentient font-bold text-lg"
                            style={{ color: occupation.color }}
                          >
                            {count} orang
                          </span>
                        </div>

                        {occupation.subcategories ? (
                          <div className="space-y-2 ml-4">
                            {occupation.subcategories.map((sub, subIndex) => (
                              <div
                                key={subIndex}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-gray-600">
                                  • {sub.name}
                                </span>
                                <span className="font-medium">
                                  {sub.count} orang
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Progress
                              value={calculatePercentage(
                                count,
                                totalWorkingPopulation
                              )}
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500">
                              {calculatePercentage(
                                count,
                                totalWorkingPopulation
                              )}
                              % dari total pekerja
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <h4 className="text-lg font-sentient font-semibold text-center mb-4 text-brand-secondary">
                    Diagram Mata Pencaharian
                  </h4>
                  <ChartContainer config={chartConfig} className="h-[350px]">
                    <BarChart
                      data={occupationChartData}
                      layout="horizontal"
                      margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        width={75}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name, props) => [
                              `${value} orang`,
                              props.payload?.fullName || (name as string),
                            ]}
                          />
                        }
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Total Working Population Summary */}
              <div className="mt-6 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-sentient font-bold text-brand-secondary mb-1">
                    {totalWorkingPopulation} orang
                  </div>
                  <p className="text-sm text-gray-600 font-plus-jakarta-sans">
                    Total Penduduk Bekerja
                  </p>
                  <p className="text-xs text-gray-500">
                    {calculatePercentage(
                      totalWorkingPopulation,
                      totalPopulation.total
                    )}
                    % dari total penduduk
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Territory and Boundaries */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">🗺️</span>
                Luas dan Batas Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 rounded-2xl p-8">
                  <div className="text-4xl font-sentient font-bold text-brand-secondary mb-2">
                    {territoryData.area} km²
                  </div>
                  <p className="text-gray-600 font-plus-jakarta-sans">
                    Luas Desa
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-sentient font-semibold text-lg text-brand-secondary mb-4">
                    Batas Wilayah
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Utara</div>
                      <div className="font-plus-jakarta-sans font-medium">
                        {territoryData.boundaries.north}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Selatan</div>
                      <div className="font-plus-jakarta-sans font-medium">
                        {territoryData.boundaries.south}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Barat</div>
                      <div className="font-plus-jakarta-sans font-medium">
                        {territoryData.boundaries.west}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Timur</div>
                      <div className="font-plus-jakarta-sans font-medium">
                        {territoryData.boundaries.east}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Conditions and Location Distance */}
          <Card className="infographic-card bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center">
                <span className="mr-3">🌍</span>
                Kondisi Geografis & Orbitasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Geographic Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {geographicStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center bg-gray-50 rounded-xl p-4"
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div
                        className={`text-lg md:text-xl font-sentient font-bold ${stat.color} mb-1`}
                      >
                        {stat.value}
                      </div>
                      <p className="text-xs text-gray-600 font-plus-jakarta-sans font-medium mb-1">
                        {stat.label}
                      </p>
                      <p className="text-xs text-gray-500 font-plus-jakarta-sans">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Distance Information */}
                <div className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-xl p-4">
                  <h4 className="font-sentient font-semibold text-lg text-brand-secondary mb-4">
                    Jarak ke Pusat Administrasi
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div>
                        <span className="font-plus-jakarta-sans font-medium">
                          {locationData.distanceToSubDistrict.destination}
                        </span>
                        <p className="text-sm text-gray-500">
                          Kecamatan Bontosikuyu
                        </p>
                      </div>
                      <div className="text-xl font-sentient font-bold text-brand-secondary">
                        {locationData.distanceToSubDistrict.distance}{" "}
                        {locationData.distanceToSubDistrict.unit}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div>
                        <span className="font-plus-jakarta-sans font-medium">
                          {locationData.distanceToRegency.destination}
                        </span>
                        <p className="text-sm text-gray-500">
                          Kabupaten Kepulauan Selayar
                        </p>
                      </div>
                      <div className="text-xl font-sentient font-bold text-brand-accent">
                        {locationData.distanceToRegency.distance}{" "}
                        {locationData.distanceToRegency.unit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-2xl">
          <p className="text-gray-600 font-plus-jakarta-sans mb-2">
            Data berdasarkan pendataan {dataMetadata.lastUpdated} oleh{" "}
            {dataMetadata.updatedBy}
          </p>
          <p className="text-sm text-gray-500 font-plus-jakarta-sans">
            Desa Laiyolo Baru, Kecamatan Bontosikuyu, Kabupaten Kepulauan
            Selayar, Sulawesi Selatan
          </p>
        </div>
      </div>
    </div>
  );
}
