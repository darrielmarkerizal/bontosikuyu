"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";
import {
  StuntingHeader,
  StuntingForm,
  PredictionResults,
  type PredictionInput,
  type PredictionResponse,
  getRiskStyle,
  getRiskIcon,
} from "@/components/stunting";

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

  const isFormValid = (): boolean => {
    return Boolean(
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
        <StuntingHeader />

        <div ref={containerRef} className="w-full max-w-3xl mx-auto">
          {/* Form Input */}
          {showForm && (
            <StuntingForm
              ref={formCardRef}
              formData={formData}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isFormValid={isFormValid}
            />
          )}

          {/* Results Section */}
          {!showForm && (
            <PredictionResults
              ref={resultsRef}
              prediction={prediction}
              error={error}
              formData={formData}
              onReset={handleReset}
              getRiskStyle={getRiskStyle}
              getRiskIcon={getRiskIcon}
            />
          )}
        </div>
      </div>
    </div>
  );
}
