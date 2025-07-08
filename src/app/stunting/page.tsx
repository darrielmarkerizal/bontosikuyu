"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Info,
  User,
  Weight,
  Ruler,
  Calendar,
  Baby,
  RotateCcw,
  ChevronRight,
  Shield,
  Zap,
  Activity,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PredictionInput {
  sex: string;
  age: number;
  birth_weight: number;
  birth_length: number;
  body_weight: number;
  body_length: number;
  asi_ekslusif: string;
}

interface PredictionResponse {
  disclaimer: string;
  input_summary: {
    asi_eksklusif: string;
    berat_badan_kg: number;
    berat_lahir_kg: number;
    jenis_kelamin: string;
    panjang_lahir_cm: number;
    tinggi_badan_cm: number;
    umur_bulan: number;
  };
  interpretation: {
    explanation: string;
    threshold_info: {
      "30-49%": string;
      "50-69%": string;
      "<30%": string;
      "≥70%": string;
    };
  };
  next_steps: string[];
  prediction: {
    percentage: string;
    raw_score: number;
    risk_level: string;
    status: string;
  };
  recommendation: string;
}

// Enhanced color scheme based on percentage and risk level
const getRiskStyle = (riskLevel: string, percentage: string) => {
  const numPercentage = parseFloat(percentage.replace("%", ""));

  if (riskLevel === "Tinggi" || numPercentage >= 70) {
    return "bg-red-50 text-red-900 border-red-200 shadow-red-100";
  } else if (
    riskLevel === "Sedang" ||
    (numPercentage >= 50 && numPercentage < 70)
  ) {
    return "bg-amber-50 text-amber-900 border-amber-200 shadow-amber-100";
  } else if (
    riskLevel === "Rendah" ||
    (numPercentage >= 30 && numPercentage < 50)
  ) {
    return "bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100";
  } else {
    return "bg-green-50 text-green-900 border-green-200 shadow-green-100";
  }
};

const getRiskIcon = (riskLevel: string, percentage: string) => {
  const numPercentage = parseFloat(percentage.replace("%", ""));

  if (riskLevel === "Tinggi" || numPercentage >= 70) {
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  } else if (
    riskLevel === "Sedang" ||
    (numPercentage >= 50 && numPercentage < 70)
  ) {
    return <Info className="h-5 w-5 text-amber-600" />;
  } else if (
    riskLevel === "Rendah" ||
    (numPercentage >= 30 && numPercentage < 50)
  ) {
    return <Activity className="h-5 w-5 text-blue-600" />;
  } else {
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  }
};

export default function StuntingPredictionPage() {
  const [formData, setFormData] = useState<PredictionInput>({
    sex: "",
    age: 0,
    birth_weight: 0,
    birth_length: 0,
    body_weight: 0,
    body_length: 0,
    asi_ekslusif: "",
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Refs for animation
  const formCardRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    field: keyof PredictionInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_STUNTING_API_URL ||
        "http://127.0.0.1:8080/predict";

      const response = await axios.post<PredictionResponse>(apiUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      setPrediction(response.data);

      // Smooth transition animation
      if (formCardRef.current && resultsRef.current && containerRef.current) {
        gsap.to(formCardRef.current, {
          duration: 0.4,
          y: -20,
          opacity: 0,
          ease: "power2.inOut",
          onComplete: () => {
            setShowForm(false);
            gsap.fromTo(
              resultsRef.current,
              { y: 20, opacity: 0 },
              {
                duration: 0.5,
                y: 0,
                opacity: 1,
                ease: "power2.out",
              }
            );
          },
        });
      }
    } catch (err: unknown) {
      console.error("Prediction error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.code === "ECONNABORTED") {
          setError("Koneksi terputus. Silakan coba lagi.");
        } else if (err.code === "ERR_NETWORK") {
          setError(
            "Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil."
          );
        } else {
          setError("Terjadi kesalahan jaringan.");
        }
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      sex: "",
      age: 0,
      birth_weight: 0,
      birth_length: 0,
      body_weight: 0,
      body_length: 0,
      asi_ekslusif: "",
    });
    setPrediction(null);
    setError(null);

    if (resultsRef.current && containerRef.current) {
      gsap.to(resultsRef.current, {
        duration: 0.3,
        y: 20,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => {
          setShowForm(true);
          if (formCardRef.current) {
            gsap.fromTo(
              formCardRef.current,
              { y: -20, opacity: 0 },
              {
                duration: 0.4,
                y: 0,
                opacity: 1,
                ease: "power2.out",
              }
            );
          }
        },
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.sex &&
      formData.age > 0 &&
      formData.birth_weight > 0 &&
      formData.birth_length > 0 &&
      formData.body_weight > 0 &&
      formData.body_length > 0 &&
      formData.asi_ekslusif
    );
  };

  useEffect(() => {
    if (formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { y: 20, opacity: 0 },
        { duration: 0.6, y: 0, opacity: 1, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Enhanced Header with AI warning */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative p-3 bg-white rounded-2xl shadow-lg border border-slate-200">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                Cek Risiko Stunting
              </h1>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                <Zap className="h-4 w-4" />
                Powered by AI
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Evaluasi awal risiko stunting menggunakan kecerdasan buatan
              berdasarkan data tumbuh kembang anak.
            </p>

            {/* AI Warning Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mx-auto max-w-2xl">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    🤖 Hasil Prediksi AI
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Hasil ini adalah prediksi AI untuk skrining awal dan{" "}
                    <strong>
                      tidak menggantikan diagnosa medis profesional
                    </strong>
                    . Konsultasikan dengan dokter anak untuk evaluasi lebih
                    lanjut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="w-full max-w-3xl mx-auto">
          {/* Form Input - Enhanced responsive design */}
          {showForm && (
            <Card
              ref={formCardRef}
              className="shadow-lg border-slate-200 bg-white/95 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-slate-900">
                  <User className="h-5 w-5 text-slate-600" />
                  Data Anak
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Masukkan data tumbuh kembang anak dengan lengkap dan akurat
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Gender Selection - Improved mobile layout */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">
                      Jenis Kelamin
                    </Label>
                    <RadioGroup
                      value={formData.sex}
                      onValueChange={(value) => handleInputChange("sex", value)}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <RadioGroupItem
                          value="M"
                          id="male"
                          className="text-slate-600"
                        />
                        <Label
                          htmlFor="male"
                          className="cursor-pointer text-slate-700"
                        >
                          Laki-laki
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <RadioGroupItem
                          value="F"
                          id="female"
                          className="text-slate-600"
                        />
                        <Label
                          htmlFor="female"
                          className="cursor-pointer text-slate-700"
                        >
                          Perempuan
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Age Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <Calendar className="h-4 w-4 text-slate-500" />
                      Usia (bulan)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      max="60"
                      value={formData.age || ""}
                      onChange={(e) =>
                        handleInputChange("age", parseInt(e.target.value) || 0)
                      }
                      placeholder="Contoh: 24"
                      className="border-slate-200 focus:border-slate-400 h-11"
                    />
                    <p className="text-xs text-slate-500">
                      Usia anak dalam bulan (0-60 bulan)
                    </p>
                  </div>

                  {/* Birth Data Section */}
                  <div className="space-y-4 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Baby className="h-4 w-4 text-slate-500" />
                      <Label className="font-medium text-slate-700">
                        Data Kelahiran
                      </Label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="birth_weight"
                          className="text-slate-700"
                        >
                          Berat Lahir (kg)
                        </Label>
                        <Input
                          id="birth_weight"
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.birth_weight || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "birth_weight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Contoh: 3.2"
                          className="border-slate-200 focus:border-slate-400 h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="birth_length"
                          className="text-slate-700"
                        >
                          Panjang Lahir (cm)
                        </Label>
                        <Input
                          id="birth_length"
                          type="number"
                          min="0"
                          max="70"
                          value={formData.birth_length || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "birth_length",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="Contoh: 48"
                          className="border-slate-200 focus:border-slate-400 h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Data Section */}
                  <div className="space-y-4 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-slate-500" />
                      <Label className="font-medium text-slate-700">
                        Data Saat Ini
                      </Label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="body_weight"
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <Weight className="h-4 w-4 text-slate-500" />
                          Berat Badan (kg)
                        </Label>
                        <Input
                          id="body_weight"
                          type="number"
                          step="0.1"
                          min="0"
                          max="50"
                          value={formData.body_weight || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "body_weight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Contoh: 12.5"
                          className="border-slate-200 focus:border-slate-400 h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="body_length"
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <Ruler className="h-4 w-4 text-slate-500" />
                          Tinggi Badan (cm)
                        </Label>
                        <Input
                          id="body_length"
                          type="number"
                          step="0.1"
                          min="0"
                          max="150"
                          value={formData.body_length || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "body_length",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Contoh: 85.5"
                          className="border-slate-200 focus:border-slate-400 h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ASI Section */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">
                      Pemberian ASI Eksklusif
                    </Label>
                    <p className="text-xs text-slate-500">
                      ASI eksklusif 6 bulan pertama tanpa makanan/minuman lain
                    </p>
                    <RadioGroup
                      value={formData.asi_ekslusif}
                      onValueChange={(value) =>
                        handleInputChange("asi_ekslusif", value)
                      }
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <RadioGroupItem
                          value="Yes"
                          id="asi-yes"
                          className="text-slate-600"
                        />
                        <Label
                          htmlFor="asi-yes"
                          className="cursor-pointer text-slate-700"
                        >
                          Ya
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <RadioGroupItem
                          value="No"
                          id="asi-no"
                          className="text-slate-600"
                        />
                        <Label
                          htmlFor="asi-no"
                          className="cursor-pointer text-slate-700"
                        >
                          Tidak
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses dengan AI...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Mulai Evaluasi AI
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Results Section - Enhanced with colored alerts */}
          <div ref={resultsRef} className="space-y-6">
            {!showForm && prediction && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2 border-slate-200 hover:border-slate-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Evaluasi Baru
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-red-900">
                  Terjadi Kesalahan
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {prediction && (
              <>
                {/* Important Notice */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">
                    Catatan Penting
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 text-sm leading-relaxed">
                    {prediction.disclaimer}
                  </AlertDescription>
                </Alert>

                {/* Main Result Card - Enhanced with colors */}
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

                {/* Data Summary */}
                <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      Ringkasan Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900 block">
                          Jenis Kelamin
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.jenis_kelamin}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900 block">
                          Usia
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.umur_bulan} bulan
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900 block">
                          Berat Lahir
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.berat_lahir_kg} kg
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900 block">
                          Panjang Lahir
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.panjang_lahir_cm} cm
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900 block">
                          Berat Badan
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.berat_badan_kg} kg
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium text-slate-900 block">
                          Tinggi Badan
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.tinggi_badan_cm} cm
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg sm:col-span-2 lg:col-span-1">
                        <span className="font-medium text-slate-900 block">
                          ASI Eksklusif
                        </span>
                        <span className="text-slate-700">
                          {prediction.input_summary.asi_eksklusif}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      Langkah Selanjutnya
                    </CardTitle>
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

                {/* Risk Interpretation */}
                <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      Panduan Tingkat Risiko
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        prediction.interpretation.threshold_info
                      ).map(([range, description]) => (
                        <div
                          key={range}
                          className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100"
                        >
                          <span className="font-medium text-slate-900">
                            {range}
                          </span>
                          <span className="text-sm text-slate-700">
                            {description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
