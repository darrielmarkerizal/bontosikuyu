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
    <Card className="shadow-lg border-slate-200 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Brain className="h-5 w-5 text-blue-600" />
          Hasil Evaluasi AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`p-6 rounded-xl border-2 shadow-lg ${getRiskStyle(
            prediction.prediction.risk_level,
            prediction.prediction.percentage
          )}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              {getRiskIcon(
                prediction.prediction.risk_level,
                prediction.prediction.percentage
              )}
              <div>
                <div className="font-semibold text-lg">
                  {prediction.prediction.status}
                </div>
                <div className="text-sm opacity-75">
                  Tingkat Risiko: {prediction.prediction.risk_level}
                </div>
              </div>
            </div>
            <div className="sm:ml-auto">
              <div className="text-3xl font-bold">
                {prediction.prediction.percentage}
              </div>
              <div className="text-xs opacity-75 text-center">
                Confidence Score
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label className="font-medium text-slate-900 mb-2 block">
              Penjelasan AI
            </Label>
            <p className="text-sm text-slate-700 leading-relaxed">
              {prediction.interpretation.explanation}
            </p>
          </div>

          <div>
            <Label className="font-medium text-slate-900 mb-2 block">
              Rekomendasi
            </Label>
            <p className="text-sm text-slate-700 leading-relaxed">
              {prediction.recommendation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
