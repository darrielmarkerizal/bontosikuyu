import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionResponse } from "./types";

interface DataSummaryProps {
  prediction: PredictionResponse;
}

export function DataSummary({ prediction }: DataSummaryProps) {
  return (
    <Card className="shadow-sm border-slate-200 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Ringkasan Data</CardTitle>
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
            <span className="font-medium text-slate-900 block">Usia</span>
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
  );
}
