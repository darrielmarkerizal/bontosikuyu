import { AlertTriangle, CheckCircle, Info, Activity } from "lucide-react";
import { ReactElement } from "react";

// Enhanced color scheme based on percentage and risk level using brand colors
export const getRiskStyle = (riskLevel: string, percentage: string): string => {
  const numPercentage = parseFloat(percentage.replace("%", ""));

  if (riskLevel === "Tinggi" || numPercentage >= 70) {
    return "bg-red-50 text-red-900 border-red-300 shadow-red-100";
  } else if (
    riskLevel === "Sedang" ||
    (numPercentage >= 50 && numPercentage < 70)
  ) {
    return "bg-brand-primary/10 text-brand-secondary border-brand-primary/30 shadow-brand-primary/20";
  } else if (
    riskLevel === "Rendah" ||
    (numPercentage >= 30 && numPercentage < 50)
  ) {
    return "bg-brand-accent/10 text-brand-secondary border-brand-accent/30 shadow-brand-accent/20";
  } else {
    return "bg-green-50 text-green-900 border-green-300 shadow-green-100";
  }
};

export const getRiskIcon = (
  riskLevel: string,
  percentage: string
): ReactElement => {
  const numPercentage = parseFloat(percentage.replace("%", ""));

  if (riskLevel === "Tinggi" || numPercentage >= 70) {
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  } else if (
    riskLevel === "Sedang" ||
    (numPercentage >= 50 && numPercentage < 70)
  ) {
    return <Info className="h-6 w-6 text-brand-primary" />;
  } else if (
    riskLevel === "Rendah" ||
    (numPercentage >= 30 && numPercentage < 50)
  ) {
    return <Activity className="h-6 w-6 text-brand-accent" />;
  } else {
    return <CheckCircle className="h-6 w-6 text-green-600" />;
  }
};
