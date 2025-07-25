import ArticleDetailPage from "@/components/artikel/public/article-detail-page";

export default function Page() {
  return <ArticleDetailPage />;
}

interface LexicalNode {
  type?: string;
  text?: string;
  children?: LexicalNode[];
}

// Helper function untuk extract text dari Lexical
const extractTextFromLexical = (children: LexicalNode[]): string => {
  let text = "";
  for (const child of children) {
    if (child.type === "text" && child.text) {
      text += child.text + " ";
    } else if (child.children) {
      text += extractTextFromLexical(child.children) + " ";
    }
  }
  return text.trim();
};

const cleanContentForMeta = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.root && parsed.root.children) {
      return extractTextFromLexical(parsed.root.children);
    }
  } catch {
    return content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/<[^>]*>/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return content;
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    // Fetch article data for meta tags
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${params.id}`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const article = data.data;

      // Clean content untuk description
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
