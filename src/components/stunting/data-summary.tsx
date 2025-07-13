import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { PredictionResponse } from "./types";

interface DataSummaryProps {
  prediction: PredictionResponse;
}

export function DataSummary({ prediction }: DataSummaryProps) {
  return (
    <Card className="shadow-2xl border-2 border-brand-accent/20 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 border-b border-brand-accent/20">
        <CardTitle className="flex items-center gap-3 text-brand-secondary font-sentient font-bold text-xl">
          <div className="p-2 bg-brand-accent/10 rounded-xl">
            <BarChart3 className="h-6 w-6 text-brand-accent" />
          </div>
          Ringkasan Data
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              Jenis Kelamin
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.jenis_kelamin}
            </span>
          </div>
          <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/20">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              Usia
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.umur_bulan} bulan
            </span>
          </div>
          <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              Berat Lahir
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.berat_lahir_kg} kg
            </span>
          </div>
          <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/20">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              Panjang Lahir
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.panjang_lahir_cm} cm
            </span>
          </div>
          <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              Berat Badan
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.berat_badan_kg} kg
            </span>
          </div>
          <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/20">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              Tinggi Badan
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.tinggi_badan_cm} cm
            </span>
          </div>
          <div className="p-4 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-xl border border-brand-accent/20 sm:col-span-2 lg:col-span-1">
            <span className="font-semibold text-brand-secondary block mb-1 font-plus-jakarta-sans">
              ASI Eksklusif
            </span>
            <span className="text-gray-700 font-plus-jakarta-sans">
              {prediction.input_summary.asi_eksklusif}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
