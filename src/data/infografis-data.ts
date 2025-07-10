// Data Demografis Desa Laiyolo Baru

// Total Populasi
export const totalPopulation = {
  total: 999,
  male: 497,
  female: 502,
  households: 330,
};

// Data Agama
export const religionData = [
  {
    religion: "Islam",
    count: 994,
    percentage: 99.5,
  },
  {
    religion: "Kristen",
    count: 4,
    percentage: 0.4,
  },
  {
    religion: "Lainnya",
    count: 1,
    percentage: 0.1,
  },
];

// Data Kelompok Usia Pendidikan
export const ageGroupData = [
  {
    ageGroup: "0-3 tahun",
    count: 48,
    description: "Usia Balita",
    color: "#F8B72C",
  },
  {
    ageGroup: "4-6 tahun",
    count: 45,
    description: "Usia Pra Sekolah",
    color: "#21BCA8",
  },
  {
    ageGroup: "7-12 tahun",
    count: 87,
    description: "Usia Sekolah Dasar",
    color: "#173A57",
  },
  {
    ageGroup: "13-15 tahun",
    count: 37,
    description: "Usia SMP",
    color: "#F8B72C",
  },
  {
    ageGroup: "16-18 tahun",
    count: 46,
    description: "Usia SMA",
    color: "#21BCA8",
  },
  {
    ageGroup: "19+ tahun",
    count: 736,
    description: "Usia Dewasa",
    color: "#173A57",
  },
];

// Data Tingkat Pendidikan
export const educationData = [
  {
    level: "Taman Kanak-Kanak",
    count: 41,
    color: "#F8B72C",
  },
  {
    level: "SD/Sederajat",
    count: 184,
    color: "#21BCA8",
  },
  {
    level: "SMP/SLTP",
    count: 110,
    color: "#173A57",
  },
  {
    level: "SMA/SLTA",
    count: 175,
    color: "#F8B72C",
  },
  {
    level: "Akademi/D1-D3",
    count: 29,
    color: "#21BCA8",
  },
  {
    level: "Sarjana (S1-S3)",
    count: 32,
    color: "#173A57",
  },
];

// Data Mata Pencaharian
export const occupationData = [
  {
    category: "Karyawan",
    subcategories: [
      {
        name: "PNS",
        count: 29,
      },
      {
        name: "ABRI",
        count: 2,
      },
    ],
    total: 31,
    color: "#173A57",
  },
  {
    category: "Wiraswasta/Pedagang",
    count: 9,
    color: "#F8B72C",
  },
  {
    category: "Petani",
    count: 184,
    color: "#21BCA8",
  },
  {
    category: "Pertukangan",
    count: 31,
    color: "#173A57",
  },
  {
    category: "Pensiunan",
    count: 7,
    color: "#F8B72C",
  },
  {
    category: "Nelayan",
    count: 50,
    color: "#21BCA8",
  },
  {
    category: "Jasa",
    count: 8,
    color: "#173A57",
  },
];

// Data Luas dan Batas Wilayah
export const territoryData = {
  area: 29.28, // km²
  boundaries: {
    north: "Desa Harapan",
    south: "Desa Laiyolo",
    west: "Laut Flores",
    east: "Laut Flores",
  },
};

// Data Kondisi Geografis
export const geographicData = {
  elevation: {
    min: 0,
    max: 500,
    unit: "M",
    description: "dari permukaan laut",
  },
  rainfall: {
    amount: 2000,
    unit: "MM/Tahun",
  },
  temperature: {
    average: 20,
    unit: "°C",
  },
};

// Data Orbitasi (Jarak)
export const locationData = {
  distanceToSubDistrict: {
    distance: 3,
    unit: "KM",
    destination: "Pusat Pemerintahan Kecamatan",
  },
  distanceToRegency: {
    distance: 23,
    unit: "KM",
    destination: "Ibukota Kabupaten",
  },
};

// Metadata
export const dataMetadata = {
  lastUpdated: "Desember 2024",
  updatedBy: "Pemerintah Desa Laiyolo Baru",
};

// Summary Statistics
export const summaryStats = [
  {
    label: "Total Penduduk",
    value: totalPopulation.total,
    icon: "👥",
    color: "text-brand-primary",
  },
  {
    label: "Kepala Keluarga",
    value: totalPopulation.households,
    icon: "🏠",
    color: "text-brand-accent",
  },
  {
    label: "Luas Wilayah",
    value: `${territoryData.area} km²`,
    icon: "🗺️",
    color: "text-brand-secondary",
  },
  {
    label: "Kepadatan per KK",
    value:
      Math.round((totalPopulation.total / totalPopulation.households) * 10) /
      10,
    icon: "📊",
    color: "text-brand-primary",
  },
];

// Geographic Statistics for Cards
export const geographicStats = [
  {
    label: "Ketinggian Tanah",
    value: `${geographicData.elevation.min}-${geographicData.elevation.max} ${geographicData.elevation.unit}`,
    icon: "⛰️",
    color: "text-brand-secondary",
    description: geographicData.elevation.description,
  },
  {
    label: "Curah Hujan",
    value: `${geographicData.rainfall.amount} ${geographicData.rainfall.unit}`,
    icon: "🌧️",
    color: "text-brand-accent",
    description: "rata-rata tahunan",
  },
  {
    label: "Suhu Udara",
    value: `${geographicData.temperature.average}${geographicData.temperature.unit}`,
    icon: "🌡️",
    color: "text-brand-primary",
    description: "rata-rata",
  },
  {
    label: "Jarak ke Kecamatan",
    value: `${locationData.distanceToSubDistrict.distance} ${locationData.distanceToSubDistrict.unit}`,
    icon: "🏛️",
    color: "text-brand-secondary",
    description: "pusat pemerintahan",
  },
];
