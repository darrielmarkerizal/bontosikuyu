"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, RotateCcw } from "lucide-react";
import { PredictionResponse, PredictionInput } from "./types";
import { PredictionResult } from "./prediction-result";
import { AISuggestions } from "./ai-suggestions";
import { DataSummary } from "./data-summary";
import { NextSteps } from "./next-steps";
import { RiskInterpretation } from "./risk-interpretation";

interface PredictionResultsProps {
  prediction: PredictionResponse | null;
  error: string | null;
  formData: PredictionInput;
  onReset: () => void;
  getRiskStyle: (riskLevel: string, percentage: string) => string;
  getRiskIcon: (riskLevel: string, percentage: string) => JSX.Element;
}

export const PredictionResults = forwardRef<
  HTMLDivElement,
  PredictionResultsProps
>(
  (
    { prediction, error, formData, onReset, getRiskStyle, getRiskIcon },
    ref
  ) => {
    return (
      <div ref={ref} className="space-y-8">
        {/* Reset Button */}
        {prediction && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2 border-2 border-brand-accent/30 hover:border-brand-accent hover:bg-brand-accent/10 text-brand-secondary font-plus-jakarta-sans font-medium rounded-xl px-6 py-3 transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4" />
              Evaluasi Baru
            </Button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="border-2 border-red-200 bg-red-50/80 backdrop-blur-sm rounded-xl"
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-900 font-sentient font-bold">
              Terjadi Kesalahan
            </AlertTitle>
            <AlertDescription className="text-red-700 font-plus-jakarta-sans">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {prediction && (
          <>
            {/* Important Notice */}
            <Alert className="border-2 border-brand-primary/30 bg-brand-primary/10 backdrop-blur-sm rounded-xl">
              <Info className="h-5 w-5 text-brand-primary" />
              <AlertTitle className="text-brand-secondary font-sentient font-bold">
                Catatan Penting
              </AlertTitle>
              <AlertDescription className="text-brand-secondary/80 text-sm leading-relaxed font-plus-jakarta-sans">
                {prediction.disclaimer}
              </AlertDescription>
            </Alert>

            {/* Main Result */}
            <PredictionResult
              prediction={prediction}
              getRiskStyle={getRiskStyle}
              getRiskIcon={getRiskIcon}
            />

            {/* AI Generated Suggestions */}
            <AISuggestions
              prediction={prediction}
              childData={{
                age: formData.age,
                sex: formData.sex,
                weight: formData.body_weight,
                height: formData.body_length,
                birth_weight: formData.birth_weight,
                birth_length: formData.birth_length,
                asi_exclusive: formData.asi_ekslusif,
              }}
            />

            {/* Data Summary */}
            <DataSummary prediction={prediction} />

            {/* Next Steps */}
            <NextSteps prediction={prediction} />

            {/* Risk Interpretation */}
            <RiskInterpretation prediction={prediction} />
          </>
        )}
      </div>
    );
  }
);

PredictionResults.displayName = "PredictionResults";
