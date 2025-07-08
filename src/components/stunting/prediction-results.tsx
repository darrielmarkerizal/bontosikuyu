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
      <div ref={ref} className="space-y-6">
        {/* Reset Button */}
        {prediction && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2 border-slate-200 hover:border-slate-300"
            >
              <RotateCcw className="h-4 w-4" />
              Evaluasi Baru
            </Button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-red-900">Terjadi Kesalahan</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {prediction && (
          <>
            {/* Important Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Catatan Penting</AlertTitle>
              <AlertDescription className="text-blue-700 text-sm leading-relaxed">
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
