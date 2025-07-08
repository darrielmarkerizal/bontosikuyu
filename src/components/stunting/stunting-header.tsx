import { Brain, Zap } from "lucide-react";

export function StuntingHeader() {
  return (
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
                <strong>tidak menggantikan diagnosa medis profesional</strong>.
                Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
