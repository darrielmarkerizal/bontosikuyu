"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ActivityStats, DeviceStats, TrafficStats } from "./statistics-types";

interface StatisticsChartsProps {
  activityStats: ActivityStats;
  deviceStats: DeviceStats;
  trafficStats: TrafficStats;
  browserStats: Record<string, number>;
  weeklyPatterns: Array<{
    dayOfWeek: number;
    dayName: string;
    sessions: number;
    pageViews: number;
  }>;
}

export function StatisticsCharts({
  activityStats,
  deviceStats,
  trafficStats,
  browserStats,
  weeklyPatterns,
}: StatisticsChartsProps) {
  // Chart configurations
  const chartConfig = {
    sessions: {
      label: "Sesi",
      color: "hsl(var(--chart-1))",
    },
    pageViews: {
      label: "Tayangan",
      color: "hsl(var(--chart-2))",
    },
    uniqueVisitors: {
      label: "Pengunjung Unik",
      color: "hsl(var(--chart-3))",
    },
    newUsers: {
      label: "Pengguna Baru",
      color: "hsl(var(--chart-4))",
    },
  };

  // Device breakdown data for pie chart
  const deviceData = [
    {
      name: "Mobile",
      value: deviceStats.deviceBreakdown.mobile,
      color: "#0088FE",
    },
    {
      name: "Desktop",
      value: deviceStats.deviceBreakdown.desktop,
      color: "#00C49F",
    },
    {
      name: "Tablet",
      value: deviceStats.deviceBreakdown.tablet,
      color: "#FFBB28",
    },
    {
      name: "Unknown",
      value: deviceStats.deviceBreakdown.unknown,
      color: "#FF8042",
    },
  ].filter((item) => item.value > 0);

  // Browser stats data for bar chart
  const browserData = Object.entries(browserStats)
    .map(([browser, count]) => ({
      browser: browser.length > 8 ? browser.slice(0, 8) + "..." : browser,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Top countries data
  const countryData = Object.entries(trafficStats.topCountries)
    .map(([country, count]) => ({
      country: country.length > 8 ? country.slice(0, 8) + "..." : country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Format daily trends for better display
  const formattedDailyTrends = activityStats.dailyTrends
    .slice(-20) // Only show last 20 days for mobile
    .map((trend) => ({
      ...trend,
      date: new Date(trend.date).toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      }),
    }));

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* First Row - Daily Trends and Device Breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Daily Trends Line Chart */}
        <Card className="lg:col-span-2 w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Tren Harian - 20 Hari Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedDailyTrends}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="var(--color-sessions)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      stroke="var(--color-pageViews)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown Pie Chart */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Jenis Perangkat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ChartContainer config={{}} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="font-medium text-sm">{data.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {data.value.toLocaleString()} pengunjung
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Hourly Activity and Weekly Patterns */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Hourly Activity Area Chart */}
        <Card className="lg:col-span-2 w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Aktivitas Per Jam
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityStats.hourlyActivity}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(value) => `${value}h`}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      labelFormatter={(value) => `Jam ${value}:00`}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stackId="1"
                      stroke="var(--color-sessions)"
                      fill="var(--color-sessions)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      stackId="2"
                      stroke="var(--color-pageViews)"
                      fill="var(--color-pageViews)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Patterns Bar Chart */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Pola Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyPatterns}
                    margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="dayName"
                      tickFormatter={(value) => value.slice(0, 3)}
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="sessions"
                      fill="var(--color-sessions)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Browser and Country Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Top Browsers Horizontal Bar Chart */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Browser Teratas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ChartContainer config={{}} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={browserData}
                    layout="horizontal"
                    margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis
                      dataKey="browser"
                      type="category"
                      width={35}
                      tick={{ fontSize: 9 }}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="font-medium text-sm">{label}</p>
                              <p className="text-xs text-muted-foreground">
                                {payload[0].value?.toLocaleString()} pengunjung
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-3))"
                      radius={[0, 2, 2, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Countries Bar Chart */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">
              Negara Teratas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ChartContainer config={{}} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={countryData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="country"
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="font-medium text-sm">{label}</p>
                              <p className="text-xs text-muted-foreground">
                                {payload[0].value?.toLocaleString()} pengunjung
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-4))"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
