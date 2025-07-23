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
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top countries data
  const countryData = Object.entries(trafficStats.topCountries)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Format daily trends for better display
  const formattedDailyTrends = activityStats.dailyTrends.map((trend) => ({
    ...trend,
    date: new Date(trend.date).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Daily Trends Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tren Harian - 30 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={formattedDailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="var(--color-sessions)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="var(--color-pageViews)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Device Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Jenis Perangkat</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px]">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
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
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value.toLocaleString()} pengunjung
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Hourly Activity Area Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Aktivitas Per Jam</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={activityStats.hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
              <YAxis />
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
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weekly Patterns Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pola Mingguan</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={weeklyPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dayName"
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="sessions"
                fill="var(--color-sessions)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Browsers Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Browser Teratas</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px]">
            <BarChart data={browserData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="browser" type="category" width={80} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
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
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Countries Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Negara Teratas</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px]">
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="country"
                tickFormatter={(value) => value.slice(0, 8)}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
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
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
