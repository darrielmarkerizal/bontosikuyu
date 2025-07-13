import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PredictionResponse } from "./types";

interface PredictionResultProps {
  prediction: PredictionResponse;
  getRiskStyle: (riskLevel: string, percentage: string) => string;
  getRiskIcon: (riskLevel: string, percentage: string) => JSX.Element;
}

export function PredictionResult({
  prediction,
  getRiskStyle,
  getRiskIcon,
}: PredictionResultProps) {
  return (
    <Card className="shadow-2xl border-2 border-brand-accent/20 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20">
        <CardTitle className="flex items-center gap-3 text-brand-secondary font-sentient font-bold text-xl">
          <div className="p-2 bg-brand-accent/10 rounded-xl">
            <Brain className="h-6 w-6 text-brand-accent" />
          </div>
          Hasil Evaluasi AI
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div
          className={`p-8 rounded-2xl border-2 shadow-xl ${getRiskStyle(
            prediction.prediction.risk_level,
            prediction.prediction.percentage
          )}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              {getRiskIcon(
                prediction.prediction.risk_level,
                prediction.prediction.percentage
              )}
              <div>
                <div className="font-sentient font-bold text-xl mb-1">
                  {prediction.prediction.status}
                </div>
                <div className="text-sm opacity-80 font-plus-jakarta-sans">
                  Tingkat Risiko: {prediction.prediction.risk_level}
                </div>
              </div>
            </div>
            <div className="sm:ml-auto text-center">
              <div className="text-4xl font-sentient font-bold mb-1">
                {prediction.prediction.percentage}
              </div>
              <div className="text-xs opacity-80 font-plus-jakarta-sans">
                Confidence Score
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <Label className="font-semibold text-brand-secondary mb-3 block font-plus-jakarta-sans flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
              Penjelasan AI
            </Label>
            <p className="text-sm text-gray-700 leading-relaxed font-plus-jakarta-sans">
              {prediction.interpretation.explanation}
            </p>
          </div>

          <div className="bg-brand-primary/5 rounded-xl p-6 border border-brand-primary/20">
            <Label className="font-semibold text-brand-secondary mb-3 block font-plus-jakarta-sans flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
              Rekomendasi
            </Label>
            <p className="text-sm text-brand-secondary/80 leading-relaxed font-plus-jakarta-sans">
              {prediction.recommendation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
