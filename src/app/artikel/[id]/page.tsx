import ArticleDetailPage from "@/components/artikel/public/article-detail-page";

export default function Page() {
  return <ArticleDetailPage />;
}

// Helper function untuk extract text dari HTML content
const extractTextFromHTML = (htmlContent: string): string => {
  // Remove HTML tags and extract plain text
  return htmlContent
    .replace(/<[^>]*>/g, "") // Remove all HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\n+/g, " ") // Replace multiple newlines with space
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();
};

const cleanContentForMeta = (content: string): string => {
  // Jika mengandung tag HTML, bersihkan sebagai HTML
  if (content.includes("<") && content.includes(">")) {
    return extractTextFromHTML(content);
  }

  // Jika tidak, anggap sebagai markdown/plain text
  return content
    .replace(/#{1,6}\s/g, "") // Hapus heading markdown
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold markdown
    .replace(/\*(.*?)\*/g, "$1") // Italic markdown
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Link markdown
    .replace(/<[^>]*>/g, "") // Remove HTML tags just in case
    .replace(/\n+/g, " ") // Ganti newline
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${params.id}`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const article = data.data;

      const cleanedContent = cleanContentForMeta(article.content);
      const description =
        cleanedContent.substring(0, 160) +
        (cleanedContent.length > 160 ? "..." : "");

      return {
        title: `${article.title} | Desa Laiyolo Baru`,
        description,
        openGraph: {
          title: article.title,
          description,
          images: article.imageUrl ? [article.imageUrl] : [],
          type: "article",
          authors: [article.writer.fullName],
          publishedTime: article.createdAt,
        },
        twitter: {
          card: "summary_large_image",
          title: article.title,
          description,
          images: article.imageUrl ? [article.imageUrl] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Artikel | Desa Laiyolo Baru",
    description: "Baca artikel dari masyarakat Desa Laiyolo Baru",
  };
}
