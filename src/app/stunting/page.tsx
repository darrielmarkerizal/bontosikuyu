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
  TrendingUp,
  User,
  Weight,
  Ruler,
  Calendar,
  Baby,
  RotateCcw,
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

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "Tinggi":
      return "bg-red-100 text-red-800 border-red-200";
    case "Sedang":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Rendah":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
};

const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel) {
    case "Tinggi":
      return <AlertTriangle className="h-5 w-5" />;
    case "Sedang":
      return <Info className="h-5 w-5" />;
    default:
      return <CheckCircle className="h-5 w-5" />;
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

      // Animate form card out and results in
      if (formCardRef.current && resultsRef.current && containerRef.current) {
        // First animate form card out
        gsap.to(formCardRef.current, {
          duration: 0.5,
          x: -100,
          opacity: 0,
          ease: "power2.inOut",
          onComplete: () => {
            setShowForm(false);
            // Animate results container from right side
            gsap.fromTo(
              resultsRef.current,
              { x: 100, opacity: 0 },
              {
                duration: 0.6,
                x: 0,
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
          setError("Koneksi timeout. Silakan coba lagi.");
        } else if (err.code === "ERR_NETWORK") {
          setError(
            "Tidak dapat terhubung ke server. Pastikan server AI berjalan di http://127.0.0.1:8080"
          );
        } else {
          setError("Network error occurred.");
        }
      } else {
        setError(
          "Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset form data
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

    // Animate back to form view
    if (resultsRef.current && containerRef.current) {
      gsap.to(resultsRef.current, {
        duration: 0.4,
        x: 100,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => {
          setShowForm(true);

          // Animate form card back in
          if (formCardRef.current) {
            gsap.fromTo(
              formCardRef.current,
              { x: -100, opacity: 0 },
              {
                duration: 0.6,
                x: 0,
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

  // Initial animation on mount
  useEffect(() => {
    if (formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { y: 30, opacity: 0 },
        { duration: 0.8, y: 0, opacity: 1, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Prediksi Stunting dengan AI</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistem prediksi stunting menggunakan artificial intelligence untuk
          melakukan skrining awal berdasarkan data antropometri anak. Hasil ini
          tidak menggantikan pemeriksaan medis profesional.
        </p>
      </div>

      <div ref={containerRef} className="w-full max-w-2xl mx-auto">
        {/* Form Input - Only show when showForm is true */}
        {showForm && (
          <Card ref={formCardRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Anak
              </CardTitle>
              <CardDescription>
                Masukkan data antropometri anak untuk prediksi stunting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Jenis Kelamin with Radio */}
                <div className="space-y-3">
                  <Label>Jenis Kelamin *</Label>
                  <RadioGroup
                    value={formData.sex}
                    onValueChange={(value) => handleInputChange("sex", value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="male" />
                      <Label htmlFor="male">Laki-laki</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="female" />
                      <Label htmlFor="female">Perempuan</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Umur */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Umur (bulan) *
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
                    placeholder="Contoh: 39"
                  />
                </div>

                {/* Data Kelahiran */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Baby className="h-4 w-4" />
                    <Label className="font-medium">Data Kelahiran</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birth_weight">Berat Lahir (kg) *</Label>
                      <Input
                        id="birth_weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.birth_weight || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "birth_weight",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Contoh: 2.8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth_length">Panjang Lahir (cm) *</Label>
                      <Input
                        id="birth_length"
                        type="number"
                        min="0"
                        value={formData.birth_length || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "birth_length",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Contoh: 48"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Saat Ini */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <Label className="font-medium">Data Saat Ini</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="body_weight"
                        className="flex items-center gap-2"
                      >
                        <Weight className="h-4 w-4" />
                        Berat Badan (kg) *
                      </Label>
                      <Input
                        id="body_weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.body_weight || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "body_weight",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Contoh: 7.9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="body_length"
                        className="flex items-center gap-2"
                      >
                        <Ruler className="h-4 w-4" />
                        Tinggi Badan (cm) *
                      </Label>
                      <Input
                        id="body_length"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.body_length || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "body_length",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Contoh: 75.8"
                      />
                    </div>
                  </div>
                </div>

                {/* ASI Eksklusif with Radio */}
                <div className="space-y-3">
                  <Label>ASI Eksklusif *</Label>
                  <RadioGroup
                    value={formData.asi_ekslusif}
                    onValueChange={(value) =>
                      handleInputChange("asi_ekslusif", value)
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="asi-yes" />
                      <Label htmlFor="asi-yes">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="asi-no" />
                      <Label htmlFor="asi-no">Tidak</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid() || loading}
                >
                  {loading ? "Memproses..." : "Prediksi Stunting"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div ref={resultsRef} className="space-y-6">
          {/* Reset Button - Only show when form is hidden and prediction exists */}
          {!showForm && prediction && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Prediksi Baru
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {prediction && (
            <>
              {/* Disclaimer */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Penting</AlertTitle>
                <AlertDescription className="text-sm">
                  {prediction.disclaimer}
                </AlertDescription>
              </Alert>

              {/* Hasil Prediksi */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Hasil Prediksi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border-2 ${getRiskColor(prediction.prediction.risk_level)}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getRiskIcon(prediction.prediction.risk_level)}
                      <div>
                        <div className="font-semibold text-lg">
                          {prediction.prediction.status}
                        </div>
                        <div className="text-sm opacity-75">
                          Risiko: {prediction.prediction.risk_level}
                        </div>
                      </div>
                      <div className="ml-auto text-2xl font-bold">
                        {prediction.prediction.percentage}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Penjelasan:</Label>
                    <p className="text-sm text-muted-foreground">
                      {prediction.interpretation.explanation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Rekomendasi:</Label>
                    <p className="text-sm text-muted-foreground">
                      {prediction.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ringkasan Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Jenis Kelamin:</span>
                      <span className="ml-2">
                        {prediction.input_summary.jenis_kelamin}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Umur:</span>
                      <span className="ml-2">
                        {prediction.input_summary.umur_bulan} bulan
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Berat Lahir:</span>
                      <span className="ml-2">
                        {prediction.input_summary.berat_lahir_kg} kg
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Panjang Lahir:</span>
                      <span className="ml-2">
                        {prediction.input_summary.panjang_lahir_cm} cm
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Berat Badan:</span>
                      <span className="ml-2">
                        {prediction.input_summary.berat_badan_kg} kg
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tinggi Badan:</span>
                      <span className="ml-2">
                        {prediction.input_summary.tinggi_badan_cm} cm
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">ASI Eksklusif:</span>
                      <span className="ml-2">
                        {prediction.input_summary.asi_eksklusif}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Langkah Selanjutnya */}
              <Card>
                <CardHeader>
                  <CardTitle>Langkah Selanjutnya</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {prediction.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Interpretasi Risiko */}
              <Card>
                <CardHeader>
                  <CardTitle>Interpretasi Tingkat Risiko</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(
                      prediction.interpretation.threshold_info
                    ).map(([range, description]) => (
                      <div key={range} className="flex justify-between">
                        <span className="font-medium">{range}:</span>
                        <span className="text-muted-foreground">
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
  );
}
