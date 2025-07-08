"use client";

import { forwardRef } from "react";
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
  User,
  Weight,
  Ruler,
  Calendar,
  Baby,
  Activity,
  Send,
} from "lucide-react";
import { PredictionInput } from "./types";

interface StuntingFormProps {
  formData: PredictionInput;
  loading: boolean;
  onInputChange: (field: keyof PredictionInput, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isFormValid: () => boolean;
}

export const StuntingForm = forwardRef<HTMLDivElement, StuntingFormProps>(
  ({ formData, loading, onInputChange, onSubmit, isFormValid }, ref) => {
    return (
      <Card
        ref={ref}
        className="shadow-xl border-2 border-brand-teal/20 bg-white/95 backdrop-blur-sm"
      >
        <CardHeader className="text-center pb-6 border-b border-brand-teal/10">
          <CardTitle className="text-2xl font-bold text-brand-navy flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-brand-teal" />
            Data Anak
          </CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            Masukkan data lengkap anak untuk mendapatkan prediksi akurat
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Jenis Kelamin */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-brand-navy flex items-center gap-2">
                <User className="h-4 w-4 text-brand-teal" />
                Jenis Kelamin
              </Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) => onInputChange("sex", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="border-brand-teal text-brand-teal"
                  />
                  <Label htmlFor="male" className="text-slate-700">
                    Laki-laki
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="border-brand-teal text-brand-teal"
                  />
                  <Label htmlFor="female" className="text-slate-700">
                    Perempuan
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Umur */}
            <div className="space-y-3">
              <Label
                htmlFor="age"
                className="text-sm font-semibold text-brand-navy flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-brand-teal" />
                Umur (bulan)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Contoh: 24"
                min="0"
                max="60"
                value={formData.age || ""}
                onChange={(e) =>
                  onInputChange("age", parseInt(e.target.value) || 0)
                }
                className="border-brand-teal/30 focus:border-brand-teal focus:ring-brand-teal/20"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Berat Lahir */}
              <div className="space-y-3">
                <Label
                  htmlFor="birth_weight"
                  className="text-sm font-semibold text-brand-navy flex items-center gap-2"
                >
                  <Weight className="h-4 w-4 text-brand-teal" />
                  Berat Lahir (kg)
                </Label>
                <Input
                  id="birth_weight"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 3.2"
                  min="0"
                  max="10"
                  value={formData.birth_weight || ""}
                  onChange={(e) =>
                    onInputChange(
                      "birth_weight",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-brand-teal/30 focus:border-brand-teal focus:ring-brand-teal/20"
                />
              </div>

              {/* Panjang Lahir */}
              <div className="space-y-3">
                <Label
                  htmlFor="birth_length"
                  className="text-sm font-semibold text-brand-navy flex items-center gap-2"
                >
                  <Ruler className="h-4 w-4 text-brand-teal" />
                  Panjang Lahir (cm)
                </Label>
                <Input
                  id="birth_length"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 50"
                  min="0"
                  max="100"
                  value={formData.birth_length || ""}
                  onChange={(e) =>
                    onInputChange(
                      "birth_length",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-brand-teal/30 focus:border-brand-teal focus:ring-brand-teal/20"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Berat Badan Saat Ini */}
              <div className="space-y-3">
                <Label
                  htmlFor="body_weight"
                  className="text-sm font-semibold text-brand-navy flex items-center gap-2"
                >
                  <Activity className="h-4 w-4 text-brand-teal" />
                  Berat Badan Saat Ini (kg)
                </Label>
                <Input
                  id="body_weight"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 12.5"
                  min="0"
                  max="50"
                  value={formData.body_weight || ""}
                  onChange={(e) =>
                    onInputChange(
                      "body_weight",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-brand-teal/30 focus:border-brand-teal focus:ring-brand-teal/20"
                />
              </div>

              {/* Tinggi Badan Saat Ini */}
              <div className="space-y-3">
                <Label
                  htmlFor="body_length"
                  className="text-sm font-semibold text-brand-navy flex items-center gap-2"
                >
                  <Ruler className="h-4 w-4 text-brand-teal" />
                  Tinggi Badan Saat Ini (cm)
                </Label>
                <Input
                  id="body_length"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 85"
                  min="0"
                  max="200"
                  value={formData.body_length || ""}
                  onChange={(e) =>
                    onInputChange(
                      "body_length",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-brand-teal/30 focus:border-brand-teal focus:ring-brand-teal/20"
                />
              </div>
            </div>

            {/* ASI Eksklusif */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-brand-navy flex items-center gap-2">
                <Baby className="h-4 w-4 text-brand-teal" />
                ASI Eksklusif
              </Label>
              <RadioGroup
                value={formData.asi_ekslusif}
                onValueChange={(value) => onInputChange("asi_ekslusif", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="asi-yes"
                    className="border-brand-teal text-brand-teal"
                  />
                  <Label htmlFor="asi-yes" className="text-slate-700">
                    Ya
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="asi-no"
                    className="border-brand-teal text-brand-teal"
                  />
                  <Label htmlFor="asi-no" className="text-slate-700">
                    Tidak
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menganalisis...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  Analisis Stunting
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

StuntingForm.displayName = "StuntingForm";
