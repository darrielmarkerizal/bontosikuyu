import { TrendingUp, TrendingDown } from "lucide-react";

interface GrowthIconProps {
  value: number;
}

export function GrowthIcon({ value }: GrowthIconProps) {
  return value >= 0 ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-500" />
  );
}
