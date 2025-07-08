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

// Function to format AI response with proper styling
const formatAIResponse = (text: string) => {
  // Split by double asterisks for main sections
  const sections = text.split(/\*\*([^*]+)\*\*/);
  const formattedContent = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (i % 2 === 1) {
      // This is a heading (between **)
      formattedContent.push(
        <h3
          key={i}
          className="font-bold text-slate-900 text-base mt-6 mb-3 first:mt-0 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          {section}
        </h3>
      );
    } else {
      // This is content
      if (section.trim()) {
        // Split by single asterisks for sub-items
        const subItems = section.split(/\*\s+/);

        if (subItems.length > 1) {
          // Has bullet points
          formattedContent.push(
            <div key={i} className="space-y-2">
              {subItems[0].trim() && (
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  {subItems[0].trim()}
                </p>
              )}
              <ul className="space-y-2 ml-4">
                {subItems.slice(1).map((item, idx) => {
                  if (!item.trim()) return null;

                  // Check if item has bold parts (with ** around them)
                  const parts = item.split(/\*\*([^*]+)\*\*/);

                  return (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700 leading-relaxed">
                        {parts.map((part, partIdx) => {
                          if (partIdx % 2 === 1) {
                            return (
                              <strong
                                key={partIdx}
                                className="font-semibold text-slate-900"
                              >
                                {part}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        } else {
          // Regular paragraph
          const paragraphs = section.split("\n").filter((p) => p.trim());
          paragraphs.forEach((paragraph, idx) => {
            if (paragraph.trim()) {
              formattedContent.push(
                <p
                  key={`${i}-${idx}`}
                  className="text-slate-700 text-sm leading-relaxed mb-3"
                >
                  {paragraph.trim()}
                </p>
              );
            }
          });
        }
      }
    }
  }

  return formattedContent;
};

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

            {/* Formatted AI Response */}
            <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 border border-purple-200/50 rounded-xl p-6">
              <div className="prose prose-sm max-w-none">
                {formatAIResponse(aiSuggestion)}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                </div>
                <div className="text-xs text-amber-800">
                  <strong className="font-semibold">Catatan Penting:</strong>{" "}
                  Saran ini dihasilkan oleh AI dan bersifat informatif. Selalu
                  konsultasikan dengan dokter anak atau ahli gizi untuk
                  mendapatkan penanganan yang tepat sesuai kondisi spesifik anak
                  Anda.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
