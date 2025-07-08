import { AlertTriangle, CheckCircle, Info, Activity } from "lucide-react";
import { ReactElement } from "react";

// Enhanced color scheme based on percentage and risk level
export const getRiskStyle = (riskLevel: string, percentage: string): string => {
  const numPercentage = parseFloat(percentage.replace("%", ""));

  if (riskLevel === "Tinggi" || numPercentage >= 70) {
    return "bg-red-50 text-red-900 border-red-200 shadow-red-100";
  } else if (
    riskLevel === "Sedang" ||
    (numPercentage >= 50 && numPercentage < 70)
  ) {
    return "bg-amber-50 text-amber-900 border-amber-200 shadow-amber-100";
  } else if (
    riskLevel === "Rendah" ||
    (numPercentage >= 30 && numPercentage < 50)
  ) {
    return "bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100";
  } else {
    return "bg-green-50 text-green-900 border-green-200 shadow-green-100";
  }
};

export const getRiskIcon = (
  riskLevel: string,
  percentage: string
): ReactElement => {
  const numPercentage = parseFloat(percentage.replace("%", ""));

  if (riskLevel === "Tinggi" || numPercentage >= 70) {
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  } else if (
    riskLevel === "Sedang" ||
    (numPercentage >= 50 && numPercentage < 70)
  ) {
    return <Info className="h-5 w-5 text-amber-600" />;
  } else if (
    riskLevel === "Rendah" ||
    (numPercentage >= 30 && numPercentage < 50)
  ) {
    return <Activity className="h-5 w-5 text-blue-600" />;
  } else {
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  }
};
