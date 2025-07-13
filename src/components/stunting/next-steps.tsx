import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { PredictionResponse } from "./types";

interface NextStepsProps {
  prediction: PredictionResponse;
}

export function NextSteps({ prediction }: NextStepsProps) {
  return (
    <Card className="shadow-2xl border-2 border-brand-accent/20 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20">
        <CardTitle className="flex items-center gap-3 text-brand-secondary font-sentient font-bold text-xl">
          <div className="p-2 bg-brand-accent/10 rounded-xl">
            <ArrowRight className="h-6 w-6 text-brand-accent" />
          </div>
          Langkah Selanjutnya
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="space-y-4">
          {prediction.next_steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-xl border border-brand-accent/20 hover:border-brand-accent/30 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-brand-accent/20 rounded-full flex-shrink-0 mt-1">
                <span className="text-brand-secondary font-sentient font-bold text-sm">
                  {index + 1}
                </span>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed font-plus-jakarta-sans">
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
