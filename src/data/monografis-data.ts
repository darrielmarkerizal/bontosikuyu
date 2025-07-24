import monografisJson from "@/components/monografis/monografis-data.json";

// Types
interface PopulationData {
  total: number;
  male: number;
  female: number;
  households: number;
}

interface ReligionData {
  religion: string;
  count: number;
  percentage: number;
}

interface AgeGroupData {
  ageGroup: string;
  count: number;
  description: string;
  color: string;
}

interface EducationData {
  level: string;
  count: number;
  color: string;
}

interface OccupationData {
  category: string;
  count: number;
  color: string;
}

interface LandUsageData {
  category: string;
  area: number;
  unit: string;
  color: string;
}

interface InfrastructureData {
  type: string;
  count: number;
  icon: string;
}

interface EducationFacilityData {
  level: string;
  public: { buildings: number; teachers: number; students: number };
  private: { buildings: number; teachers: number; students: number };
}

// Extract and process data from JSON
const rawData = monografisJson.desa;

// Population data
export const totalPopulation: PopulationData = {
  total:
    rawData.kependudukan.jumlah_penduduk.jenis_kelamin.laki_laki +
    rawData.kependudukan.jumlah_penduduk.jenis_kelamin.perempuan,
  male: rawData.kependudukan.jumlah_penduduk.jenis_kelamin.laki_laki,
  female: rawData.kependudukan.jumlah_penduduk.jenis_kelamin.perempuan,
  households: rawData.kependudukan.jumlah_penduduk.kepala_keluarga,
};

// Religion data
export const religionData: ReligionData[] = Object.entries(
  rawData.kependudukan.agama
)
  .map(([religion, count]) => ({
    religion:
      religion === "islam"
        ? "Islam"
        : religion === "kristen"
          ? "Kristen"
          : religion === "katholik"
            ? "Katolik"
            : religion === "hindu"
              ? "Hindu"
              : religion === "budha"
                ? "Buddha"
                : "Penghayat",
    count: count as number,
    percentage: Math.round(((count as number) / totalPopulation.total) * 100),
  }))
  .filter((item) => item.count > 0);

// Age group data
export const ageGroupData: AgeGroupData[] = [
  {
    ageGroup: "0-3 tahun",
    count: rawData.kependudukan.usia.kelompok_pendidikan["0_3"],
    description: "Balita",
    color: "#FF6B6B",
  },
  {
    ageGroup: "4-6 tahun",
    count: rawData.kependudukan.usia.kelompok_pendidikan["4_6"],
    description: "Pra Sekolah",
    color: "#4ECDC4",
  },
  {
    ageGroup: "7-12 tahun",
    count: rawData.kependudukan.usia.kelompok_pendidikan["7_12"],
    description: "Sekolah Dasar",
    color: "#45B7D1",
  },
  {
    ageGroup: "13-15 tahun",
    count: rawData.kependudukan.usia.kelompok_pendidikan["13_15"],
    description: "Sekolah Menengah Pertama",
    color: "#96CEB4",
  },
  {
    ageGroup: "16-18 tahun",
    count: rawData.kependudukan.usia.kelompok_pendidikan["16_18"],
    description: "Sekolah Menengah Atas",
    color: "#FFEAA7",
  },
  {
    ageGroup: "19+ tahun",
    count: rawData.kependudukan.usia.kelompok_pendidikan["19_ke_atas"],
    description: "Dewasa",
    color: "#DDA0DD",
  },
];

// Education data
export const educationData: EducationData[] = [
  {
    level: "TK",
    count: rawData.kependudukan.pendidikan.tk,
    color: "#FF6B6B",
  },
  {
    level: "SD",
    count: rawData.kependudukan.pendidikan.sd,
    color: "#4ECDC4",
  },
  {
    level: "SMP",
    count: rawData.kependudukan.pendidikan.smp,
    color: "#45B7D1",
  },
  {
    level: "SMA",
    count: rawData.kependudukan.pendidikan.sma,
    color: "#96CEB4",
  },
  {
    level: "D1-D3",
    count: rawData.kependudukan.pendidikan.d1_d3,
    color: "#FFEAA7",
  },
  {
    level: "Sarjana",
    count: rawData.kependudukan.pendidikan.sarjana,
    color: "#DDA0DD",
  },
];

// Occupation data
export const occupationData: OccupationData[] = [
  {
    category: "PNS",
    count: rawData.kependudukan.mata_pencaharian.pns,
    color: "#173A57",
  },
  {
    category: "TNI/POLRI",
    count: rawData.kependudukan.mata_pencaharian.abri,
    color: "#21BCA8",
  },
  {
    category: "Petani",
    count: rawData.kependudukan.mata_pencaharian.tani,
    color: "#4CAF50",
  },
  {
    category: "Nelayan",
    count: rawData.kependudukan.mata_pencaharian.nelayan,
    color: "#2196F3",
  },
  {
    category: "Pertukangan",
    count: rawData.kependudukan.mata_pencaharian.pertukangan,
    color: "#FF9800",
  },
  {
    category: "Wiraswasta",
    count: rawData.kependudukan.mata_pencaharian.wiraswasta,
    color: "#9C27B0",
  },
  {
    category: "Jasa",
    count: rawData.kependudukan.mata_pencaharian.jasa,
    color: "#607D8B",
  },
  {
    category: "Pensiunan",
    count: rawData.kependudukan.mata_pencaharian.pensiunan,
    color: "#795548",
  },
].filter((item) => item.count > 0);

// Territory data
export const territoryData = {
  area: rawData.bidang_pemerintahan.umum.luas_desa_km2,
  boundaries: {
    north: rawData.bidang_pemerintahan.umum.batas_wilayah.utara,
    south: rawData.bidang_pemerintahan.umum.batas_wilayah.selatan,
    west: rawData.bidang_pemerintahan.umum.batas_wilayah.barat,
    east: rawData.bidang_pemerintahan.umum.batas_wilayah.timur,
  },
};

// Geographic data
export const geographicStats = [
  {
    icon: "🏔️",
    label: "Ketinggian",
    value: rawData.bidang_pemerintahan.umum.kondisi_geografis.ketinggian_m,
    description: "meter dpl",
    color: "text-blue-600",
  },
  {
    icon: "🌧️",
    label: "Curah Hujan",
    value: `${rawData.bidang_pemerintahan.umum.kondisi_geografis.curah_hujan_mm_per_tahun}`,
    description: "mm/tahun",
    color: "text-cyan-600",
  },
  {
    icon: "🌡️",
    label: "Suhu Rata-rata",
    value: `${rawData.bidang_pemerintahan.umum.kondisi_geografis.suhu_celcius}°C`,
    description: "celcius",
    color: "text-orange-600",
  },
  {
    icon: "🏠",
    label: "Jumlah Rumah",
    value: rawData.bidang_pembangunan.penduduk.jumlah_rumah,
    description: "unit",
    color: "text-purple-600",
  },
];

// Distance data
export const locationData = {
  distanceToSubDistrict: {
    destination: "Pusat Kecamatan",
    distance: rawData.bidang_pemerintahan.umum.orbitasi.ke_kecamatan_km,
    unit: "km",
  },
  distanceToRegency: {
    destination: "Pusat Kabupaten",
    distance: rawData.bidang_pemerintahan.umum.orbitasi.ke_kabupaten_km,
    unit: "km",
  },
};

// Land usage data
export const landUsageData: LandUsageData[] = [
  {
    category: "Pemukiman",
    area: rawData.pertanahan.peruntukan.pemukiman,
    unit: "ha",
    color: "#FF6B6B",
  },
  {
    category: "Perkebunan Rakyat",
    area: rawData.pertanahan.penggunaan.tanah_kering.perkebunan_rakyat,
    unit: "ha",
    color: "#4CAF50",
  },
  {
    category: "Hutan",
    area: rawData.pertanahan.penggunaan.belum_dikelola.hutan,
    unit: "ha",
    color: "#2E7D32",
  },
  {
    category: "Jalur Hijau",
    area: rawData.pertanahan.peruntukan.jalur_hijau,
    unit: "ha",
    color: "#66BB6A",
  },
  {
    category: "Perladangan",
    area: rawData.pertanahan.penggunaan.tanah_kering.perladangan,
    unit: "ha",
    color: "#8BC34A",
  },
  {
    category: "Rawa",
    area: rawData.pertanahan.penggunaan.belum_dikelola.rawa,
    unit: "ha",
    color: "#00BCD4",
  },
  {
    category: "Tegalan",
    area: rawData.pertanahan.penggunaan.tanah_kering.tegalan,
    unit: "ha",
    color: "#FFC107",
  },
  {
    category: "Jalan",
    area: rawData.pertanahan.peruntukan.jalan,
    unit: "ha",
    color: "#9E9E9E",
  },
].filter((item) => item.area > 0);

// Infrastructure data
export const infrastructureData: InfrastructureData[] = [
  {
    type: "Masjid",
    count: rawData.bidang_pembangunan.agama.masjid,
    icon: "🕌",
  },
  {
    type: "Puskesmas",
    count: rawData.bidang_pembangunan.kesehatan.puskesmas,
    icon: "🏥",
  },
  {
    type: "Sekolah Dasar",
    count:
      rawData.bidang_pembangunan.pendidikan.pendidikan_umum.find(
        (p) => p.jenis === "Sekolah Dasar"
      )?.negeri.gedung || 0,
    icon: "🏫",
  },
  {
    type: "TK",
    count:
      rawData.bidang_pembangunan.pendidikan.pendidikan_umum.find(
        (p) => p.jenis === "TK"
      )?.swasta.gedung || 0,
    icon: "🎒",
  },
  {
    type: "SMP",
    count:
      rawData.bidang_pembangunan.pendidikan.pendidikan_umum.find(
        (p) => p.jenis === "SMP/SLTP"
      )?.negeri.gedung || 0,
    icon: "📚",
  },
  {
    type: "Lapangan Sepak Bola",
    count:
      rawData.bidang_pembangunan.sarana_olahraga_kesenian_dan_sosial.olahraga
        .sepak_bola,
    icon: "⚽",
  },
  {
    type: "Lapangan Volly",
    count:
      rawData.bidang_pembangunan.sarana_olahraga_kesenian_dan_sosial.olahraga
        .volly,
    icon: "🏐",
  },
  {
    type: "Lapangan Takraw",
    count:
      rawData.bidang_pembangunan.sarana_olahraga_kesenian_dan_sosial.olahraga
        .takraw,
    icon: "🤾",
  },
].filter((item) => item.count > 0);

// Education facilities
export const educationFacilities: EducationFacilityData[] =
  rawData.bidang_pembangunan.pendidikan.pendidikan_umum
    .filter((edu) => edu.negeri.gedung + edu.swasta.gedung > 0)
    .map((edu) => ({
      level: edu.jenis,
      public: {
        buildings: edu.negeri.gedung,
        teachers: edu.negeri.guru,
        students: edu.negeri.murid,
      },
      private: {
        buildings: edu.swasta.gedung,
        teachers: edu.swasta.guru,
        students: edu.swasta.murid,
      },
    }));

// Government finance data
export const financeData = {
  income: {
    silpa: rawData.keuangan_desa.belanja.silpa,
    danaDesa: rawData.keuangan_desa.belanja.dana_desa,
    add: rawData.keuangan_desa.belanja.add,
  },
  poverty: {
    male: rawData.keuangan_desa.penduduk_miskin.laki_laki,
    female: rawData.keuangan_desa.penduduk_miskin.perempuan,
    totalFamilies: rawData.keuangan_desa.penduduk_miskin.jumlah_kk_miskin,
  },
};

// Village officials data
export const villageOfficials = {
  kaur: rawData.perangkat_desa.kaur,
  kadus: rawData.perangkat_desa.kadus,
  staff: rawData.perangkat_desa.staf,
  rt: rawData.rk_rt.jumlah_rt,
  rk: rawData.rk_rt.jumlah_rk,
};

// Security data
export const securityData = {
  hansip: {
    male: rawData.keamanan.hansip.jumlah_laki_laki,
    female: rawData.keamanan.hansip.jumlah_perempuan,
    trained: rawData.keamanan.hansip.terlatih,
  },
  posKamling: rawData.keamanan.ketertiban.pos_kamling,
  patrol: rawData.keamanan.ketertiban.peronda,
  counseling: rawData.keamanan.ketertiban.penyuluhan,
};

// Summary stats
export const summaryStats = [
  {
    icon: "👥",
    label: "Total Penduduk",
    value: totalPopulation.total.toLocaleString(),
    color: "text-brand-secondary",
  },
  {
    icon: "🏠",
    label: "Kepala Keluarga",
    value: totalPopulation.households.toLocaleString(),
    color: "text-brand-primary",
  },
  {
    icon: "🗺️",
    label: "Luas Wilayah",
    value: `${territoryData.area} km²`,
    color: "text-brand-accent",
  },
  {
    icon: "🏘️",
    label: "Jumlah Dusun",
    value: villageOfficials.kadus.toString(),
    color: "text-orange-600",
  },
];

// Metadata
export const dataMetadata = {
  lastUpdated: "2024",
  updatedBy: "Pemerintah Desa Laiyolo Baru",
  source: "Monografi Desa Laiyolo Baru",
};
