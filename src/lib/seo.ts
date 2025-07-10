export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export function generateMetadata({
  title,
  description,
  image = "/og-image.jpg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: SEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://laiyolobaru.com";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullTitle = title
    ? `${title} | Desa Laiyolo Baru`
    : "Desa Laiyolo Baru - Komunitas Sehat dengan Teknologi AI";

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: "Desa Laiyolo Baru",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || "Desa Laiyolo Baru",
        },
      ],
      type,
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : [],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export const defaultKeywords = [
  "laiyolo baru",
  "desa laiyolo baru",
  "stunting",
  "deteksi stunting",
  "AI stunting",
  "kesehatan anak",
  "gizi balita",
  "posyandu",
  "komunitas sehat",
  "pencegahan stunting",
  "teknologi kesehatan",
  "artikel kesehatan",
  "edukasi gizi",
];

export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Desa Laiyolo Baru",
    url: "https://laiyolobaru.com",
    logo: "https://laiyolobaru.com/logo.png",
    description:
      "Website resmi Desa Laiyolo Baru dengan layanan AI deteksi stunting dan informasi kesehatan masyarakat",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressRegion: "Sulawesi Utara",
      addressLocality: "Laiyolo Baru",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "ID",
    },
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Desa Laiyolo Baru",
    url: "https://laiyolobaru.com",
    description:
      "Website resmi Desa Laiyolo Baru dengan teknologi AI deteksi stunting",
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://laiyolobaru.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  healthService: {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "Layanan AI Deteksi Stunting Desa Laiyolo Baru",
    url: "https://laiyolobaru.com/stunting",
    description:
      "Layanan deteksi dini stunting menggunakan teknologi AI untuk masyarakat Desa Laiyolo Baru",
    medicalSpecialty: "Pediatrics",
    serviceType: "Stunting Detection",
    areaServed: {
      "@type": "Place",
      name: "Desa Laiyolo Baru, Sulawesi Utara, Indonesia",
    },
  },
};
