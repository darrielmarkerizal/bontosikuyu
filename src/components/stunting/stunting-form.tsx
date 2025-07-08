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
  ChevronRight,
  Shield,
  Brain,
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
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Gender Selection */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-medium">
                Jenis Kelamin
              </Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) => onInputChange("sex", value)}
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
                  onInputChange("age", parseInt(e.target.value) || 0)
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
                  <Label htmlFor="birth_weight" className="text-slate-700">
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
                      onInputChange(
                        "birth_weight",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Contoh: 3.2"
                    className="border-slate-200 focus:border-slate-400 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_length" className="text-slate-700">
                    Panjang Lahir (cm)
                  </Label>
                  <Input
                    id="birth_length"
                    type="number"
                    min="0"
                    max="70"
                    value={formData.birth_length || ""}
                    onChange={(e) =>
                      onInputChange(
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
                      onInputChange(
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
                      onInputChange(
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
                onValueChange={(value) => onInputChange("asi_ekslusif", value)}
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
    );
  }
);

StuntingForm.displayName = "StuntingForm";
