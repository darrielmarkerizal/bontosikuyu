import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionResponse } from "./types";

interface RiskInterpretationProps {
  prediction: PredictionResponse;
}

export function RiskInterpretation({ prediction }: RiskInterpretationProps) {
  return (
    <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Panduan Tingkat Risiko</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(prediction.interpretation.threshold_info).map(
            ([range, description]) => (
              <div
                key={range}
                className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <span className="font-medium text-slate-900">{range}</span>
                <span className="text-sm text-slate-700">{description}</span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
