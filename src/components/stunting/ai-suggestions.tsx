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
          className="font-sentient font-bold text-brand-secondary text-base mt-6 mb-3 first:mt-0 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
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
                <p className="text-gray-700 text-sm leading-relaxed mb-3 font-plus-jakarta-sans">
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
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed font-plus-jakarta-sans">
                        {parts.map((part, partIdx) => {
                          if (partIdx % 2 === 1) {
                            return (
                              <strong
                                key={partIdx}
                                className="font-semibold text-brand-secondary"
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
                  className="text-gray-700 text-sm leading-relaxed mb-3 font-plus-jakarta-sans"
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
    <Card className="shadow-2xl border-2 border-brand-accent/20 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20">
        <CardTitle className="flex items-center gap-3 text-brand-secondary font-sentient font-bold text-xl">
          <div className="p-2 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 rounded-xl">
            <Sparkles className="h-6 w-6 text-brand-accent" />
          </div>
          Saran Personal dari AI
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        {!aiSuggestion && !isGenerating && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="p-4 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center border-2 border-brand-accent/20">
                <Brain className="h-10 w-10 text-brand-accent" />
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-sm font-plus-jakarta-sans leading-relaxed max-w-md mx-auto">
              Dapatkan saran nutrisi dan tumbuh kembang yang dipersonalisasi
              berdasarkan kondisi anak Anda menggunakan AI Gemini.
            </p>
            <Button
              onClick={generateSuggestion}
              className="bg-gradient-to-r from-brand-secondary to-brand-secondary/90 hover:from-brand-secondary/90 hover:to-brand-secondary text-white font-plus-jakarta-sans font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              disabled={isGenerating}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Buat Saran Personal
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Brain className="h-10 w-10 text-brand-accent" />
                <div className="absolute -top-1 -right-1">
                  <RefreshCw className="h-5 w-5 text-brand-primary animate-spin" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-plus-jakarta-sans mb-6">
              AI sedang menganalisis dan membuat saran khusus untuk anak Anda...
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden max-w-xs mx-auto">
              <div className="bg-gradient-to-r from-brand-secondary to-brand-accent h-full rounded-full w-3/4 transition-all duration-300"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm mb-6 font-plus-jakarta-sans">
              {error}
            </p>
            <Button
              onClick={generateSuggestion}
              variant="outline"
              className="border-2 border-red-200 text-red-600 hover:bg-red-50 font-plus-jakarta-sans rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        )}

        {aiSuggestion && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-brand-accent font-medium font-plus-jakarta-sans">
                <Sparkles className="h-4 w-4" />
                Saran dari Gemini AI
              </div>
              <Button
                onClick={generateSuggestion}
                variant="ghost"
                size="sm"
                className="text-brand-accent hover:text-brand-accent/80 hover:bg-brand-accent/10 font-plus-jakarta-sans rounded-xl"
                disabled={isGenerating}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Buat Ulang
              </Button>
            </div>

            {/* Formatted AI Response */}
            <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-2 border-brand-accent/20 rounded-2xl p-8">
              <div className="prose prose-sm max-w-none">
                {formatAIResponse(aiSuggestion)}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border-2 border-brand-primary/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-brand-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                </div>
                <div className="text-xs text-brand-secondary font-plus-jakarta-sans">
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
