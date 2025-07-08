interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export async function generateGeminiSuggestion(
  predictionData: {
    status: string;
    risk_level: string;
    percentage: string;
    explanation: string;
    recommendation: string;
  },
  childData: {
    age: number;
    sex: string;
    weight: number;
    height: number;
    birth_weight: number;
    birth_length: number;
    asi_exclusive: string;
  }
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const apiUrl =
    process.env.NEXT_PUBLIC_GEMINI_API_URL ||
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables."
    );
  }

  const prompt = `
Sebagai ahli gizi dan kesehatan anak, berikan saran lengkap dan spesifik berdasarkan hasil prediksi stunting berikut:

HASIL PREDIKSI:
- Status: ${predictionData.status}
- Tingkat Risiko: ${predictionData.risk_level}
- Persentase: ${predictionData.percentage}
- Penjelasan: ${predictionData.explanation}
- Rekomendasi Dasar: ${predictionData.recommendation}

DATA ANAK:
- Usia: ${childData.age} bulan
- Jenis Kelamin: ${childData.sex === "M" ? "Laki-laki" : "Perempuan"}
- Berat Badan: ${childData.weight} kg
- Tinggi Badan: ${childData.height} cm
- Berat Lahir: ${childData.birth_weight} kg
- Panjang Lahir: ${childData.birth_length} cm
- ASI Eksklusif: ${childData.asi_exclusive}

Berikan saran yang mencakup:
1. **Nutrisi Spesifik**: Menu makanan harian yang sesuai usia
2. **Stimulasi**: Aktivitas untuk mendukung tumbuh kembang
3. **Pemantauan**: Jadwal kontrol dan parameter yang harus dipantau
4. **Pencegahan**: Langkah-langkah pencegahan stunting
5. **Kapan ke Dokter**: Tanda-tanda yang mengharuskan konsultasi segera

Format dalam bahasa Indonesia yang mudah dipahami orang tua. Maksimal 500 kata.
`;

  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini AI");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal menghasilkan saran dari AI. Silakan coba lagi.");
  }
}
