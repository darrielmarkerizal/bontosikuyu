export interface PredictionInput {
  sex: string;
  age: number;
  birth_weight: number;
  birth_length: number;
  body_weight: number;
  body_length: number;
  asi_ekslusif: string;
}

export interface PredictionResponse {
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
