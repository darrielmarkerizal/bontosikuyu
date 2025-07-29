import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Smartphone, Monitor, Tablet } from "lucide-react";
import { formatNumber } from "./utils";
import { DashboardData } from "./types";

interface DeviceBreakdownProps {
  data: DashboardData;
}

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Breakdown Perangkat
        </CardTitle>
        <CardDescription>
          Distribusi pengunjung berdasarkan jenis perangkat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Smartphone className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">Mobile</p>
              <p className="text-2xl font-bold">
                {formatNumber(data.trafficInsights.deviceBreakdown.mobile)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Monitor className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium">Desktop</p>
              <p className="text-2xl font-bold">
                {formatNumber(data.trafficInsights.deviceBreakdown.desktop)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Tablet className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-medium">Tablet</p>
              <p className="text-2xl font-bold">
                {formatNumber(data.trafficInsights.deviceBreakdown.tablet)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
