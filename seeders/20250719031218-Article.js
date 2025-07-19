"use strict";

module.exports = {
  up: async (queryInterface) => {
    const titles = [
      "Mengenal Budaya Lokal di Dusun Laiyolo",
      "Perkembangan Teknologi di Indonesia",
      "Tips Kesehatan di Musim Hujan",
      "Olahraga Tradisional yang Hampir Terlupakan",
      "Ekonomi Digital di Era Modern",
      "Politik dan Partisipasi Masyarakat",
      "Pentingnya Pelestarian Lingkungan",
      "Seni Tari Tradisional Indonesia",
      "Destinasi Pariwisata di Sulawesi",
      "Resep Kuliner Nusantara yang Lezat",
      "Hiburan dan Media Sosial di Kalangan Milenial",
      "Peran Agama dalam Kehidupan",
      "Isu Sosial di Perkotaan",
      "Hukum dan Keadilan di Indonesia",
      "Inovasi Teknologi untuk Pendidikan",
      "Sejarah Nusantara yang Menarik",
      "Gaya Hidup Sehat di Era Digital",
      "Komunitas Lokal dan Gotong Royong",
      "Tren Fashion di Indonesia",
      "Edukasi Lingkungan untuk Generasi Muda",
    ];
    const imageUrls = [
      "https://example.com/images/culture.jpg",
      "https://example.com/images/tech.jpg",
      "https://example.com/images/health.jpg",
      "https://example.com/images/sports.jpg",
      "https://example.com/images/economy.jpg",
      "https://example.com/images/politics.jpg",
      null,
    ];
    const contentTemplates = [
      `# {title}\n\n**Pendahuluan**\n{intro}\n\n## Manfaat dan Dampak\n- {benefit1}\n- {benefit2}\n\n## Tantangan\n{challenge}\n\n**Kesimpulan**\n{conclusion}`,
      `# {title}\n\n**Latar Belakang**\n{background}\n\n### Fakta Menarik\n1. {fact1}\n2. {fact2}\n\n**Solusi**\n{solution}\n\n[Selengkapnya](https://example.com)`,
      `# {title}\n\n**Pengantar**\n{intro}\n\n## Langkah-Langkah\n1. {step1}\n2. {step2}\n\n**Penutup**\n{conclusion}`,
    ];
    const contentData = {
      Berita: {
        intro: "Berita terkini tentang peristiwa di Indonesia.",
        benefit1: "Meningkatkan kesadaran masyarakat.",
        benefit2: "Memberikan informasi aktual.",
        challenge: "Menghadapi hoaks dan misinformasi.",
        conclusion: "Berita yang akurat sangat penting untuk masyarakat.",
        background:
          "Peristiwa terbaru di Indonesia memengaruhi kehidupan sehari-hari.",
        fact1: "Media sosial mempercepat penyebaran berita.",
        fact2: "Verifikasi fakta menjadi tantangan utama.",
        solution: "Gunakan sumber terpercaya untuk informasi.",
        step1: "Baca berita dari sumber resmi.",
        step2: "Lakukan verifikasi sebelum menyebarkan.",
      },
      Kebudayaan: {
        intro: "Kebudayaan Indonesia kaya akan tradisi.",
        benefit1: "Memperkuat identitas nasional.",
        benefit2: "Meningkatkan pariwisata budaya.",
        challenge: "Modernisasi mengancam tradisi lokal.",
        conclusion: "Pelestarian budaya adalah tanggung jawab bersama.",
        background: "Indonesia memiliki lebih dari 300 kelompok etnis.",
        fact1: "Setiap daerah memiliki tarian tradisional.",
        fact2: "Bahasa da enamel yang berbeda.",
        solution: "Edukasi budaya di sekolah.",
        step1: "Pelajari tradisi lokal.",
        step2: "Dukung festival budaya.",
      },
      Teknologi: {
        intro: "Teknologi mengubah cara kita hidup.",
        benefit1: "Mempermudah komunikasi.",
        benefit2: "Meningkatkan efisiensi kerja.",
        challenge: "Ketergantungan pada teknologi.",
        conclusion: "Teknologi harus digunakan dengan bijak.",
        background: "Revolusi digital sedang berlangsung.",
        fact1: "Indonesia memiliki jutaan pengguna internet.",
        fact2: "Startup teknologi terus bertumbuh.",
        solution: "Tingkatkan literasi digital.",
        step1: "Pelajari teknologi baru.",
        step2: "Gunakan teknologi secara bertanggung jawab.",
      },
      // Add more for other categories if needed
    };

    const articles = Array.from({ length: 50 }, (_, index) => {
      const categoryId = Math.floor(Math.random() * 20) + 1; // 1-20
      const writerId = Math.floor(Math.random() * 100) + 1; // 1-100
      const status = Math.random() > 0.3 ? "publish" : "draft";
      const title = titles[index % titles.length];
      const timestamp = new Date(
        Date.now() - Math.floor(Math.random() * 150 * 24 * 60 * 60 * 1000)
      ); // Last 5 months
      const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

      // Select content template and fill with category-specific data
      const template =
        contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
      const categoryName =
        [
          "Berita",
          "Kebudayaan",
          "Teknologi",
          "Pendidikan",
          "Kesehatan",
          "Olahraga",
          "Ekonomi",
          "Politik",
          "Lingkungan",
          "Seni",
          "Pariwisata",
          "Kuliner",
          "Hiburan",
          "Agama",
          "Sosial",
          "Hukum",
          "Inovasi",
          "Sejarah",
          "Lifestyle",
          "Komunitas",
        ][categoryId - 1] || "Berita";
      const data = contentData[categoryName] || contentData["Berita"];

      const content = template
        .replace("{title}", title)
        .replace("{intro}", data.intro)
        .replace("{benefit1}", data.benefit1)
        .replace("{benefit2}", data.benefit2)
        .replace("{challenge}", data.challenge)
        .replace("{conclusion}", data.conclusion)
        .replace("{background}", data.background || data.intro)
        .replace("{fact1}", data.fact1)
        .replace("{fact2}", data.fact2)
        .replace("{solution}", data.solution)
        .replace("{step1}", data.step1)
        .replace("{step2}", data.step2);

      return {
        articleCategoryId: categoryId,
        writerId,
        status,
        content,
        imageUrl,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    });

    await queryInterface.bulkInsert("Articles", articles, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Articles", null, {});
  },
};
