import { useState } from "react";
import { Brain, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateGeminiSuggestion } from "@/lib/gemini";
import { PredictionResponse } from "./types";

interface AISuggestionsProps {
  prediction: PredictionResponse;
  childData: {
    age: number;
    sex: string;
    weight: number;
    height: number;
    birth_weight: number;
    birth_length: number;
    asi_exclusive: string;
  };
}

export function AISuggestions({ prediction, childData }: AISuggestionsProps) {
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const suggestion = await generateGeminiSuggestion(
        {
          status: prediction.prediction.status,
          risk_level: prediction.prediction.risk_level,
          percentage: prediction.prediction.percentage,
          explanation: prediction.interpretation.explanation,
          recommendation: prediction.recommendation,
        },
        childData
      );
      setAiSuggestion(suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <div className="p-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          Saran Personal dari AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!aiSuggestion && !isGenerating && (
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <p className="text-slate-600 mb-4 text-sm">
              Dapatkan saran nutrisi dan tumbuh kembang yang dipersonalisasi
              berdasarkan kondisi anak Anda menggunakan AI Gemini.
            </p>
            <Button
              onClick={generateSuggestion}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Buat Saran Personal
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
                <div className="absolute -top-1 -right-1">
                  <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                </div>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              AI sedang menganalisis dan membuat saran khusus untuk anak Anda...
            </p>
            <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button
              onClick={generateSuggestion}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        )}

        {aiSuggestion && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                <Sparkles className="h-4 w-4" />
                Saran dari Gemini AI
              </div>
              <Button
                onClick={generateSuggestion}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                disabled={isGenerating}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Buat Ulang
              </Button>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                  {aiSuggestion}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <strong>Catatan:</strong> Saran ini dihasilkan oleh AI dan
              bersifat informatif. Selalu konsultasikan dengan dokter anak atau
              ahli gizi untuk mendapatkan penanganan yang tepat.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
