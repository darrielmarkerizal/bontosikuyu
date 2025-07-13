import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { PredictionResponse } from "./types";

interface RiskInterpretationProps {
  prediction: PredictionResponse;
}

export function RiskInterpretation({ prediction }: RiskInterpretationProps) {
  return (
    <Card className="shadow-2xl border-2 border-brand-accent/20 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20">
        <CardTitle className="flex items-center gap-3 text-brand-secondary font-sentient font-bold text-xl">
          <div className="p-2 bg-brand-accent/10 rounded-xl">
            <Info className="h-6 w-6 text-brand-accent" />
          </div>
          Panduan Tingkat Risiko
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="space-y-4">
          {Object.entries(prediction.interpretation.threshold_info).map(
            ([range, description]) => (
              <div
                key={range}
                className="flex flex-col sm:flex-row sm:justify-between gap-3 p-5 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-xl border border-brand-accent/20"
              >
                <span className="font-semibold text-brand-secondary font-plus-jakarta-sans">
                  {range}
                </span>
                <span className="text-sm text-gray-700 font-plus-jakarta-sans leading-relaxed">
                  {description}
                </span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
