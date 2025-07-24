"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  totalPopulation,
  religionData,
  ageGroupData,
  educationData,
  occupationData,
  summaryStats,
  territoryData,
  locationData,
  geographicStats,
  landUsageData,
  infrastructureData,
  educationFacilities,
  financeData,
  villageOfficials,
  securityData,
  dataMetadata,
} from "@/data/monografis-data";

gsap.registerPlugin(ScrollTrigger);

export default function MonografisPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    const header = headerRef.current;
    const stats = statsRef.current;

    if (!page || !header || !stats) return;

    // Set initial states
    gsap.set([header, stats], { opacity: 0, y: 50 });

    // Animate elements on page load
    const tl = gsap.timeline();

    tl.to(header, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }).to(
      stats,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Animate cards on scroll
    const cards = page.querySelectorAll(".monografis-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Data row component for consistent styling
  const DataRow = ({
    label,
    value,
    unit = "",
    indent = 0,
    isHeader = false,
  }: {
    label: string;
    value: string | number;
    unit?: string;
    indent?: number;
    isHeader?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center py-2 ${indent > 0 ? `ml-${indent * 4}` : ""} ${indent > 0 ? "border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <span
        className={`font-plus-jakarta-sans ${isHeader ? "font-semibold text-brand-secondary" : "text-gray-700"} ${indent === 0 ? "font-medium" : ""}`}
      >
        {label}
      </span>
      <span
        className={`font-sentient ${isHeader ? "font-bold text-lg text-brand-primary" : "font-semibold text-gray-900"}`}
      >
        {value} {unit}
      </span>
    </div>
  );

  // Section component for consistent styling
  const Section = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <Card className="monografis-card bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-secondary/5 to-brand-accent/5">
        <CardTitle className="text-xl md:text-2xl font-sentient font-bold text-brand-secondary flex items-center">
          <span className="mr-3 text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">{children}</CardContent>
    </Card>
  );

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-gradient-to-r from-brand-secondary to-gray-900 text-white"
      >
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sentient font-bold mb-4 md:mb-6">
              Monografi Desa Laiyolo Baru
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200 font-plus-jakarta-sans leading-relaxed max-w-3xl mx-auto mb-4">
              Data lengkap monografi Desa Laiyolo Baru, Kecamatan Bontosikuyu,
              Kabupaten Kepulauan Selayar, Sulawesi Selatan
            </p>
            <div className="text-sm text-gray-300 font-plus-jakarta-sans">
              Terakhir diperbarui: {dataMetadata.lastUpdated} oleh{" "}
              {dataMetadata.updatedBy}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Summary Statistics */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
        >
          {summaryStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-4 md:p-6">
                <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                <div
                  className={`text-lg md:text-2xl lg:text-3xl font-sentient font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-plus-jakarta-sans">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Bidang Pemerintahan */}
          <Section title="Bidang Pemerintahan" icon="🏛️">
            <div className="space-y-6">
              {/* Umum */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Umum
                </h3>

                {/* Luas dan Batas Wilayah */}
                <div className="mb-6">
                  <h4 className="font-plus-jakarta-sans font-medium text-gray-800 mb-3">
                    Luas dan Batas Wilayah
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    <DataRow
                      label="Luas Desa"
                      value={territoryData.area}
                      unit="KM²"
                      indent={1}
                    />
                  </div>

                  <div className="mt-4">
                    <h5 className="font-plus-jakarta-sans font-medium text-gray-700 mb-2">
                      Batas Wilayah
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <DataRow
                          label="Utara"
                          value={territoryData.boundaries.north}
                          indent={1}
                        />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <DataRow
                          label="Selatan"
                          value={territoryData.boundaries.south}
                          indent={1}
                        />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <DataRow
                          label="Barat"
                          value={territoryData.boundaries.west}
                          indent={1}
                        />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <DataRow
                          label="Timur"
                          value={territoryData.boundaries.east}
                          indent={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kondisi Geografis */}
                <div className="mb-6">
                  <h4 className="font-plus-jakarta-sans font-medium text-gray-800 mb-3">
                    Kondisi Geografis
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    {geographicStats.map((stat, index) => (
                      <DataRow
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        unit={stat.description}
                        indent={1}
                      />
                    ))}
                  </div>
                </div>

                {/* Orbitasi */}
                <div className="mb-6">
                  <h4 className="font-plus-jakarta-sans font-medium text-gray-800 mb-3">
                    Orbitasi (Jarak dari pusat pemerintahan dengan desa)
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    <DataRow
                      label={`Jarak dari ${locationData.distanceToSubDistrict.destination}`}
                      value={locationData.distanceToSubDistrict.distance}
                      unit={locationData.distanceToSubDistrict.unit.toUpperCase()}
                      indent={1}
                    />
                    <DataRow
                      label={`Jarak dari ${locationData.distanceToRegency.destination}`}
                      value={locationData.distanceToRegency.distance}
                      unit={locationData.distanceToRegency.unit.toUpperCase()}
                      indent={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Pertanahan */}
          <Section title="Pertanahan" icon="🏞️">
            <div className="space-y-6">
              {/* Penggunaan Lahan */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Penggunaan Lahan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {landUsageData.map((land, index) => (
                    <DataRow
                      key={index}
                      label={land.category}
                      value={land.area.toLocaleString()}
                      unit={land.unit.toUpperCase()}
                      indent={1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Kependudukan */}
          <Section title="Kependudukan" icon="👥">
            <div className="space-y-6">
              {/* Jumlah Penduduk */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Jumlah Penduduk
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <DataRow
                    label="Total Penduduk"
                    value={totalPopulation.total.toLocaleString()}
                    unit="jiwa"
                    indent={1}
                  />
                  <DataRow
                    label="Laki-laki"
                    value={totalPopulation.male.toLocaleString()}
                    unit="jiwa"
                    indent={1}
                  />
                  <DataRow
                    label="Perempuan"
                    value={totalPopulation.female.toLocaleString()}
                    unit="jiwa"
                    indent={1}
                  />
                  <DataRow
                    label="Kepala Keluarga"
                    value={totalPopulation.households.toLocaleString()}
                    unit="KK"
                    indent={1}
                  />
                </div>
              </div>

              {/* Agama */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Agama
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {religionData.map((religion, index) => (
                    <DataRow
                      key={index}
                      label={religion.religion}
                      value={`${religion.count.toLocaleString()} (${religion.percentage}%)`}
                      unit="jiwa"
                      indent={1}
                    />
                  ))}
                </div>
              </div>

              {/* Kelompok Usia */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Kelompok Usia
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {ageGroupData.map((age, index) => (
                    <DataRow
                      key={index}
                      label={`${age.ageGroup} (${age.description})`}
                      value={age.count.toLocaleString()}
                      unit="jiwa"
                      indent={1}
                    />
                  ))}
                </div>
              </div>

              {/* Tingkat Pendidikan */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Tingkat Pendidikan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {educationData.map((edu, index) => (
                    <DataRow
                      key={index}
                      label={edu.level}
                      value={edu.count.toLocaleString()}
                      unit="orang"
                      indent={1}
                    />
                  ))}
                </div>
              </div>

              {/* Mata Pencaharian */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Mata Pencaharian
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  {occupationData.map((occupation, index) => (
                    <DataRow
                      key={index}
                      label={occupation.category}
                      value={occupation.count.toLocaleString()}
                      unit="orang"
                      indent={1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Fasilitas Pendidikan */}
          <Section title="Fasilitas Pendidikan" icon="🎓">
            <div className="space-y-6">
              {educationFacilities.map((facility, index) => (
                <div key={index}>
                  <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                    {facility.level}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-plus-jakarta-sans font-medium text-gray-800 mb-3">
                        Negeri
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                        <DataRow
                          label="Gedung"
                          value={facility.public.buildings}
                          unit="buah"
                          indent={1}
                        />
                        <DataRow
                          label="Guru"
                          value={facility.public.teachers}
                          unit="orang"
                          indent={1}
                        />
                        <DataRow
                          label="Murid"
                          value={facility.public.students}
                          unit="orang"
                          indent={1}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-plus-jakarta-sans font-medium text-gray-800 mb-3">
                        Swasta
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                        <DataRow
                          label="Gedung"
                          value={facility.private.buildings}
                          unit="buah"
                          indent={1}
                        />
                        <DataRow
                          label="Guru"
                          value={facility.private.teachers}
                          unit="orang"
                          indent={1}
                        />
                        <DataRow
                          label="Murid"
                          value={facility.private.students}
                          unit="orang"
                          indent={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Infrastruktur */}
          <Section title="Infrastruktur" icon="🏗️">
            <div>
              <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                Fasilitas Umum
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                {infrastructureData.map((infra, index) => (
                  <DataRow
                    key={index}
                    label={`${infra.icon} ${infra.type}`}
                    value={infra.count}
                    unit="buah"
                    indent={1}
                  />
                ))}
              </div>
            </div>
          </Section>

          {/* Perangkat Desa */}
          <Section title="Perangkat Desa" icon="👨‍💼">
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <DataRow
                label="Kepala Urusan/Kepala Seksi/KAUR"
                value={villageOfficials.kaur}
                unit="orang"
              />
              <DataRow
                label="Kepala Dusun/Lingkungan"
                value={villageOfficials.kadus}
                unit="orang"
              />
              <DataRow
                label="Staf"
                value={villageOfficials.staff}
                unit="orang"
              />
              <DataRow
                label="Jumlah RK"
                value={villageOfficials.rk}
                unit="buah"
              />
              <DataRow
                label="Jumlah RT"
                value={villageOfficials.rt}
                unit="buah"
              />
            </div>
          </Section>

          {/* Keamanan */}
          <Section title="Keamanan Desa" icon="🛡️">
            <div className="space-y-6">
              {/* Hansip */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Pembinaan Hansip
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <DataRow
                    label="Anggota Laki-laki"
                    value={securityData.hansip.male}
                    unit="orang"
                    indent={1}
                  />
                  <DataRow
                    label="Anggota Perempuan"
                    value={securityData.hansip.female || "-"}
                    unit="orang"
                    indent={1}
                  />
                  <DataRow
                    label="Hansip Terlatih"
                    value={securityData.hansip.trained}
                    unit="orang"
                    indent={1}
                  />
                </div>
              </div>

              {/* Ketertiban */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Ketentraman dan Ketertiban
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <DataRow
                    label="Jumlah Penyuluhan"
                    value={securityData.counseling}
                    unit="kali"
                    indent={1}
                  />
                  <DataRow
                    label="Jumlah Pos Kamling"
                    value={securityData.posKamling}
                    unit="buah"
                    indent={1}
                  />
                  <DataRow
                    label="Jumlah Peronda Kampung"
                    value={securityData.patrol}
                    unit="kelompok"
                    indent={1}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Keuangan Desa */}
          <Section title="Keuangan Desa" icon="💰">
            <div className="space-y-6">
              {/* Pendapatan */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Pendapatan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <DataRow
                    label="Sisa Anggaran Tahun Lalu (SILPA)"
                    value={`Rp ${financeData.income.silpa.toLocaleString("id-ID")}`}
                    indent={1}
                  />
                  <DataRow
                    label="Dana Desa"
                    value={`Rp ${financeData.income.danaDesa.toLocaleString("id-ID")}`}
                    indent={1}
                  />
                  <DataRow
                    label="ADD (Alokasi Dana Desa)"
                    value={`Rp ${financeData.income.add.toLocaleString("id-ID")}`}
                    indent={1}
                  />
                </div>
              </div>

              {/* Data Kemiskinan */}
              <div>
                <h3 className="text-lg font-sentient font-semibold text-brand-secondary mb-4 border-b border-gray-200 pb-2">
                  Data Penduduk Miskin
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                  <DataRow
                    label="Laki-laki"
                    value={financeData.poverty.male}
                    unit="orang"
                    indent={1}
                  />
                  <DataRow
                    label="Perempuan"
                    value={financeData.poverty.female}
                    unit="orang"
                    indent={1}
                  />
                  <DataRow
                    label="Jumlah KK Miskin"
                    value={financeData.poverty.totalFamilies}
                    unit="KK"
                    indent={1}
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer dengan informasi sumber data */}
        <div className="mt-12 bg-gradient-to-r from-brand-secondary/5 to-brand-accent/5 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 font-plus-jakarta-sans">
            Data monografi ini disusun berdasarkan data resmi dari{" "}
            {dataMetadata.updatedBy}
          </p>
          <p className="text-xs text-gray-500 font-plus-jakarta-sans mt-2">
            Sumber: {dataMetadata.source} - Terakhir diperbarui:{" "}
            {dataMetadata.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
