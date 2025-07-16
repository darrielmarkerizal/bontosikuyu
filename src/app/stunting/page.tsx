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
        "https://stunting-prediction-api-e7b75f979c9b.herokuapp.com/predict";

      // Transform data to match API expectations
      const transformedData = {
        sex: formData.sex === "male" ? "M" : "F", // Transform male/female to M/F
        age: formData.age,
        birth_weight: formData.birth_weight,
        birth_length: formData.birth_length,
        body_weight: formData.body_weight,
        body_length: formData.body_length,
        asi_ekslusif: formData.asi_ekslusif === "yes" ? "Yes" : "No", // Transform yes/no to Yes/No
      };

      console.log("Original form data:", formData); // Debug log
      console.log("Transformed data for API:", transformedData); // Debug log

      const response = await axios.post<PredictionResponse>(
        apiUrl,
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("API Response:", response.data); // Debug log
      setPrediction(response.data);

      // Animate transition to results
      if (formCardRef.current) {
        gsap.to(formCardRef.current, {
          duration: 0.4,
          y: -20,
          opacity: 0,
          ease: "power2.inOut",
          onComplete: () => {
            setShowForm(false); // Hide form after animation
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
    // Reset all states first
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

    // Animate transition back to form
    if (resultsRef.current) {
      gsap.to(resultsRef.current, {
        duration: 0.3,
        y: 20,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => {
          setShowForm(true); // Show form after animation
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

  // Animation for results when prediction is available
  useEffect(() => {
    if (prediction && !showForm && resultsRef.current) {
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
    }
  }, [prediction, showForm]);

  // Initial form animation
  useEffect(() => {
    if (showForm && formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { y: 20, opacity: 0 },
        { duration: 0.6, y: 0, opacity: 1, ease: "power2.out" }
      );
    }
  }, [showForm]);

  // Debug logs
  useEffect(() => {
    console.log("Current state:", { showForm, prediction, error, loading });
  }, [showForm, prediction, error, loading]);

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
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
          {!showForm && (prediction || error) && (
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
