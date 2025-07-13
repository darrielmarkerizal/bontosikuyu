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
        className="shadow-2xl border-2 border-brand-accent/20 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
      >
        <CardHeader className="text-center pb-6 border-b border-brand-accent/20 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5">
          <CardTitle className="text-2xl font-sentient font-bold text-brand-secondary flex items-center justify-center gap-3">
            <div className="p-2 bg-brand-accent/10 rounded-xl">
              <User className="h-6 w-6 text-brand-accent" />
            </div>
            Data Anak
          </CardTitle>
          <CardDescription className="text-gray-600 mt-3 font-plus-jakarta-sans">
            Masukkan data lengkap anak untuk mendapatkan prediksi akurat
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Jenis Kelamin */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans">
                <User className="h-4 w-4 text-brand-accent" />
                Jenis Kelamin
              </Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) => onInputChange("sex", value)}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-brand-primary/5 transition-colors">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="border-brand-accent text-brand-accent data-[state=checked]:bg-brand-accent"
                  />
                  <Label
                    htmlFor="male"
                    className="text-gray-700 font-plus-jakarta-sans cursor-pointer"
                  >
                    Laki-laki
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-brand-primary/5 transition-colors">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="border-brand-accent text-brand-accent data-[state=checked]:bg-brand-accent"
                  />
                  <Label
                    htmlFor="female"
                    className="text-gray-700 font-plus-jakarta-sans cursor-pointer"
                  >
                    Perempuan
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Umur */}
            <div className="space-y-4">
              <Label
                htmlFor="age"
                className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans"
              >
                <Calendar className="h-4 w-4 text-brand-accent" />
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
                className="border-2 border-brand-accent/30 focus:border-brand-accent focus:ring-brand-accent/20 rounded-xl py-3 font-plus-jakarta-sans"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Berat Lahir */}
              <div className="space-y-4">
                <Label
                  htmlFor="birth_weight"
                  className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans"
                >
                  <Weight className="h-4 w-4 text-brand-accent" />
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
                  className="border-2 border-brand-accent/30 focus:border-brand-accent focus:ring-brand-accent/20 rounded-xl py-3 font-plus-jakarta-sans"
                />
              </div>

              {/* Panjang Lahir */}
              <div className="space-y-4">
                <Label
                  htmlFor="birth_length"
                  className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans"
                >
                  <Ruler className="h-4 w-4 text-brand-accent" />
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
                  className="border-2 border-brand-accent/30 focus:border-brand-accent focus:ring-brand-accent/20 rounded-xl py-3 font-plus-jakarta-sans"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Berat Badan Saat Ini */}
              <div className="space-y-4">
                <Label
                  htmlFor="body_weight"
                  className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans"
                >
                  <Activity className="h-4 w-4 text-brand-accent" />
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
                  className="border-2 border-brand-accent/30 focus:border-brand-accent focus:ring-brand-accent/20 rounded-xl py-3 font-plus-jakarta-sans"
                />
              </div>

              {/* Tinggi Badan Saat Ini */}
              <div className="space-y-4">
                <Label
                  htmlFor="body_length"
                  className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans"
                >
                  <Ruler className="h-4 w-4 text-brand-accent" />
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
                  className="border-2 border-brand-accent/30 focus:border-brand-accent focus:ring-brand-accent/20 rounded-xl py-3 font-plus-jakarta-sans"
                />
              </div>
            </div>

            {/* ASI Eksklusif */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-brand-secondary flex items-center gap-2 font-plus-jakarta-sans">
                <Baby className="h-4 w-4 text-brand-accent" />
                ASI Eksklusif
              </Label>
              <RadioGroup
                value={formData.asi_ekslusif}
                onValueChange={(value) => onInputChange("asi_ekslusif", value)}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-brand-primary/5 transition-colors">
                  <RadioGroupItem
                    value="yes"
                    id="asi-yes"
                    className="border-brand-accent text-brand-accent data-[state=checked]:bg-brand-accent"
                  />
                  <Label
                    htmlFor="asi-yes"
                    className="text-gray-700 font-plus-jakarta-sans cursor-pointer"
                  >
                    Ya
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-brand-primary/5 transition-colors">
                  <RadioGroupItem
                    value="no"
                    id="asi-no"
                    className="border-brand-accent text-brand-accent data-[state=checked]:bg-brand-accent"
                  />
                  <Label
                    htmlFor="asi-no"
                    className="text-gray-700 font-plus-jakarta-sans cursor-pointer"
                  >
                    Tidak
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full bg-gradient-to-r from-brand-secondary to-brand-secondary/90 hover:from-brand-secondary/90 hover:to-brand-secondary text-white py-6 text-lg font-semibold font-plus-jakarta-sans transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 group shadow-xl rounded-xl border-2 border-brand-secondary/20"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menganalisis...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
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
