import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { NumberTicker } from "@/components/magicui/number-ticker";

export default function VillageSection() {
  const villageStats = [
    {
      value: 29.28,
      unit: "Ha",
      label: "Luas Wilayah",
      color: "text-brand-primary",
      decimalPlaces: 2,
      delay: 0,
    },
    {
      value: 4,
      unit: "Dusun",
      label: "Jumlah Dusun",
      color: "text-brand-accent",
      decimalPlaces: 0,
      delay: 0.2,
    },
    {
      value: 52,
      unit: "UMKM",
      label: "Jumlah UMKM",
      color: "text-brand-secondary",
      decimalPlaces: 0,
      delay: 0.4,
    },
    {
      value: 4,
      unit: "RT",
      label: "Jumlah RT",
      color: "text-brand-primary",
      decimalPlaces: 0,
      delay: 0.6,
    },
  ];

  const dusunList = [
    "Dusun Laiyolo",
    "Dusun Pangkaje'ne",
    "Dusun Timoro",
    "Dusun Kilotepo",
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="fit-content"
            textAlign="center"
          >
            <div className="inline-flex items-center px-6 py-3 bg-brand-primary/10 rounded-full border border-brand-primary/20 mb-6">
              <span className="text-sm font-medium text-brand-primary font-plus-jakarta-sans tracking-wide uppercase">
                Tentang Desa
              </span>
            </div>
          </BoxReveal>

          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="100%"
            textAlign="center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sentient font-bold text-brand-secondary mb-6">
              Desa Laiyolo Baru
            </h2>
          </BoxReveal>

          <BoxReveal
            boxColor="#F8B72C"
            duration={0.5}
            width="100%"
            textAlign="center"
          >
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto font-plus-jakarta-sans leading-relaxed">
              Membangun masa depan bersama di wilayah kepulauan yang strategis
            </p>
          </BoxReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Village Description */}
          <BoxReveal
            boxColor="#173A57"
            duration={0.6}
            width="100%"
            textAlign="left"
          >
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-sentient font-semibold text-brand-secondary mb-4">
                Profil Desa
              </h3>

              <div className="prose prose-lg text-gray-700 font-plus-jakarta-sans space-y-4">
                <p className="leading-relaxed">
                  Desa Laiyolo Baru adalah salah satu desa di Kecamatan
                  Bontosikuyu, Kabupaten Kepulauan Selayar, Provinsi Sulawesi
                  Selatan, Indonesia. Desa ini memiliki kode pos 92855.
                </p>

                <p className="leading-relaxed">
                  Desa ini terletak di wilayah kepulauan yang strategis, dengan
                  akses transportasi melalui pelabuhan ferry dari Bira,
                  Bulukumba, ke Pelabuhan Pamatata di Kecamatan Bontomatene,
                  atau melalui Bandar Udara H. Aroeppala di Desa Bontosunggu,
                  Kecamatan Bontoharu.
                </p>
              </div>

              {/* Dusun List */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-sentient font-semibold text-brand-secondary mb-4">
                  Daftar Dusun
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-plus-jakarta-sans">
                  {dusunList.map((dusun, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                      <span className="font-medium text-gray-800">{dusun}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boundaries */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-sentient font-semibold text-brand-secondary mb-4">
                  Batas Wilayah
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-plus-jakarta-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sebelah Barat:</span>
                    <span className="font-medium text-gray-800">
                      Laut Flores
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sebelah Utara:</span>
                    <span className="font-medium text-gray-800">
                      Desa Harapan
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sebelah Timur:</span>
                    <span className="font-medium text-gray-800">
                      Laut Flores
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sebelah Selatan:</span>
                    <span className="font-medium text-gray-800">
                      Desa Laiyolo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BoxReveal>

          {/* Village Statistics */}
          <BoxReveal
            boxColor="#21BCA8"
            duration={0.6}
            width="100%"
            textAlign="center"
          >
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-sentient font-semibold text-brand-secondary mb-6">
                Data Desa
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {villageStats.map((stat, index) => (
                  <BoxReveal
                    key={index}
                    boxColor="#F8B72C"
                    duration={0.5 + index * 0.1}
                    width="100%"
                    textAlign="center"
                  >
                    <Card className="bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md">
                      <CardHeader className="pb-2">
                        <div
                          className={`text-3xl md:text-4xl font-sentient font-bold ${stat.color}`}
                        >
                          <NumberTicker
                            value={stat.value}
                            delay={stat.delay}
                            decimalPlaces={stat.decimalPlaces}
                            className={`${stat.color} font-sentient font-bold`}
                          />
                          <span className="text-lg text-gray-600 ml-1">
                            {stat.unit}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardTitle className="text-sm text-gray-600 font-plus-jakarta-sans font-medium">
                          {stat.label}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  </BoxReveal>
                ))}
              </div>

              {/* Economic Sectors */}
              <div className="mt-8 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-xl p-6 border border-brand-primary/10">
                <h4 className="font-sentient font-semibold text-brand-secondary mb-4 text-left">
                  Sektor Ekonomi Utama
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-plus-jakarta-sans">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-brand-primary text-xl">🌾</span>
                    </div>
                    <span className="font-medium text-gray-800 block">
                      Pertanian
                    </span>
                    <span className="text-xs text-gray-600">
                      Kelapa, Cengkih, Jambu Mete
                    </span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-brand-accent text-xl">🐟</span>
                    </div>
                    <span className="font-medium text-gray-800 block">
                      Perikanan
                    </span>
                    <span className="text-xs text-gray-600">
                      Mata Pencaharian Utama
                    </span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-brand-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-brand-secondary text-xl">🏖️</span>
                    </div>
                    <span className="font-medium text-gray-800 block">
                      Pariwisata
                    </span>
                    <span className="text-xs text-gray-600">
                      Pantai, Air Terjun, Sungai
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BoxReveal>
        </div>
      </div>
    </section>
  );
}
