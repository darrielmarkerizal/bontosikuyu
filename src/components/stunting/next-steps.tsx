import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionResponse } from "./types";

interface NextStepsProps {
  prediction: PredictionResponse;
}

export function NextSteps({ prediction }: NextStepsProps) {
  return (
    <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Langkah Selanjutnya</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prediction.next_steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="text-sm text-slate-700 leading-relaxed">
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
