"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Types
interface ArticleDetail {
  id: number;
  title: string;
  content: string;
  status: "draft" | "publish";
  imageUrl?: string;
  category: {
    id: number;
    name: string;
  };
  writer: {
    id: number;
    fullName: string;
    dusun: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface LexicalNode {
  type: string;
  text?: string;
  format?: number;
  children?: LexicalNode[];
  direction?: string;
  indent?: number;
  textFormat?: number;
  textStyle?: string;
  mode?: string;
  style?: string;
  detail?: number;
  version?: number;
  tag?: string; // For heading nodes
  listType?: string; // For list nodes
  url?: string; // For link nodes
}

// Helper functions untuk formatting Lexical content
const formatLexicalContent = (content: string): JSX.Element[] => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.root && parsed.root.children) {
      return renderLexicalNodes(parsed.root.children);
    }
  } catch (error) {
    console.error("Error parsing Lexical content:", error);
    return renderPlainText(content);
  }
  return renderPlainText(content);
};

const renderLexicalNodes = (nodes: LexicalNode[]): JSX.Element[] => {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-6 leading-relaxed">
            {node.children ? renderInlineNodes(node.children) : ""}
          </p>
        );
      case "heading":
        const level = node.tag || "h2";
        const HeadingComponent = level as keyof JSX.IntrinsicElements;
        return (
          <HeadingComponent
            key={index}
            className={`font-bold mb-4 mt-8 text-brand-navy ${
              level === "h1"
                ? "text-3xl"
                : level === "h2"
                  ? "text-2xl"
                  : level === "h3"
                    ? "text-xl"
                    : level === "h4"
                      ? "text-lg"
                      : level === "h5"
                        ? "text-base"
                        : "text-sm"
            }`}
          >
            {node.children ? renderInlineNodes(node.children) : ""}
          </HeadingComponent>
        );
      case "list":
        const ListComponent = node.listType === "number" ? "ol" : "ul";
        return (
          <ListComponent key={index} className="mb-6 ml-6 space-y-2">
            {node.children ? renderLexicalNodes(node.children) : []}
          </ListComponent>
        );
      case "listitem":
        return (
          <li key={index} className="leading-relaxed">
            {node.children ? renderInlineNodes(node.children) : ""}
          </li>
        );
      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-brand-teal pl-6 py-4 mb-6 bg-gray-50 italic"
          >
            {node.children ? renderLexicalNodes(node.children) : []}
          </blockquote>
        );
      case "code":
        return (
          <pre
            key={index}
            className="bg-gray-900 text-white p-4 rounded-lg mb-6 overflow-x-auto"
          >
            <code>{node.children ? renderInlineNodes(node.children) : ""}</code>
          </pre>
        );
      default:
        if (node.children) {
          return <div key={index}>{renderLexicalNodes(node.children)}</div>;
        }
        return <span key={index}></span>;
    }
  });
};

const renderInlineNodes = (nodes: LexicalNode[]): (JSX.Element | string)[] => {
  return nodes.map((node, index) => {
    if (node.type === "text" && node.text) {
      let text: JSX.Element | string = node.text;

      // Apply formatting based on format number
      if (node.format) {
        const format = node.format;

        // Bold (format & 1)
        if (format & 1) {
          text = <strong key={`bold-${index}`}>{text}</strong>;
        }

        // Italic (format & 2)
        if (format & 2) {
          text = <em key={`italic-${index}`}>{text}</em>;
        }

        // Underline (format & 8)
        if (format & 8) {
          text = <u key={`underline-${index}`}>{text}</u>;
        }

        // Strikethrough (format & 4)
        if (format & 4) {
          text = <s key={`strikethrough-${index}`}>{text}</s>;
        }

        // Code (format & 16)
        if (format & 16) {
          text = (
            <code
              key={`code-${index}`}
              className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
            >
              {text}
            </code>
          );
        }
      }

      return text;
    } else if (node.type === "link") {
      return (
        <a
          key={index}
          href={node.url || "#"}
          className="text-brand-teal hover:text-brand-teal/80 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {node.children ? renderInlineNodes(node.children) : ""}
        </a>
      );
    } else if (node.children) {
      return <span key={index}>{renderInlineNodes(node.children)}</span>;
    }

    return "";
  });
};

const renderPlainText = (content: string): JSX.Element[] => {
  // Fallback untuk content yang bukan Lexical JSON
  const cleanText = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-brand-teal hover:text-brand-teal/80 underline">$1</a>'
    )
    .replace(/\n+/g, "</p><p>")
    .trim();

  return [
    <div
      key="plain-content"
      dangerouslySetInnerHTML={{ __html: `<p>${cleanText}</p>` }}
      className="space-y-6"
    />,
  ];
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

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const cleanText = cleanContentForMeta(content);
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} menit`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

const getFallbackImage = (category: string): string => {
  const fallbackImages: Record<string, string> = {
    Kesehatan:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    Pendidikan:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    Teknologi:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    Ekonomi:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    Olahraga:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    Hiburan:
      "https://images.unsplash.com/photo-1489599162714-0d9b75c3ca1e?w=800&h=400&fit=crop",
    Politik:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop",
    Komunitas:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
    default:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
  };
  return fallbackImages[category] || fallbackImages.default;
};

// Loading skeleton
const ArticleDetailSkeleton = () => (
  <div className="min-h-screen bg-slate-50 overflow-x-hidden">
    {/* Header */}
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Category and meta skeleton */}
        <div className="mb-6">
          <Skeleton className="h-6 w-20 mb-4" />
          <Skeleton className="h-12 mb-4" />
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Image skeleton */}
        <Skeleton className="h-64 md:h-80 lg:h-96 rounded-xl mb-8" />

        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount] = useState(Math.floor(Math.random() * 1000) + 100);

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    // Animate elements when they load
    if (article && !loading) {
      const tl = gsap.timeline();

      tl.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )
        .fromTo(
          metaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          imageRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          contentRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          authorRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
    }
  }, [article, loading]);

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/articles/${id}`);

      if (response.data.success) {
        setArticle(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError("Artikel tidak ditemukan");
        } else {
          const errorMessage = error.response?.data?.message || error.message;
          setError(errorMessage);
        }
      } else {
        setError("Terjadi kesalahan yang tidak terduga");
      }
      toast.error("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const title = article.title;
    const text = `Baca artikel menarik: "${title}" dari Desa Laiyolo Baru`;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        const whatsappText = `${text}\n\n${url}`;
        shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link berhasil disalin!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // Loading state
  if (loading) {
    return <ArticleDetailSkeleton />;
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center overflow-x-hidden">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error === "Artikel tidak ditemukan"
              ? "Artikel Tidak Ditemukan"
              : "Terjadi Kesalahan"}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {error || "Terjadi kesalahan saat memuat artikel"}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <Link href="/artikel">
              <Button>Lihat Artikel Lain</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl =
    article.imageUrl && !article.imageUrl.includes("example.com")
      ? article.imageUrl
      : getFallbackImage(article.category.name);

  const readTime = calculateReadTime(article.content);
  const formattedDate = formatDate(article.createdAt);
  const formattedContent = formatLexicalContent(article.content);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Header Navigation */}
      <div ref={headerRef} className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Link
                href="/artikel"
                className="text-brand-navy hover:text-brand-navy/80"
              >
                Artikel
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-green-600"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382" />
                        </svg>
                      </div>
                      WhatsApp
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("facebook")}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-blue-600"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      Facebook
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("twitter")}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-blue-400"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      Twitter
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleShare("copy")}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Salin Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto">
            <Link href="/" className="hover:text-brand-navy whitespace-nowrap">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link
              href="/artikel"
              className="hover:text-brand-navy whitespace-nowrap"
            >
              Artikel
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-brand-navy truncate">{article.title}</span>
          </nav>

          {/* Article Header */}
          <div ref={metaRef} className="mb-8">
            <Badge
              variant="outline"
              className="border-brand-teal text-brand-teal mb-4"
            >
              {article.category.name}
            </Badge>

            <h1 className="font-sentient text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.writer.fullName}</span>
                <Badge variant="secondary" className="text-xs">
                  {article.writer.dusun}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Article Image */}
          <div ref={imageRef} className="mb-8">
            <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          {/* Article Content */}
          <div ref={contentRef} className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
              <div className="prose prose-gray max-w-none">
                <div className="text-slate-700 leading-relaxed text-base sm:text-lg">
                  {formattedContent}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Share Actions */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan Artikel
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-green-600"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382" />
                          </svg>
                        </div>
                        WhatsApp
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-blue-600"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        Facebook
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter")}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-blue-400"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </div>
                        Twitter
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShare("copy")}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Salin Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div ref={authorRef} className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-brand-navy mb-4">
                  Tentang Penulis
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-brand-teal" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">
                      {article.writer.fullName}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {article.writer.dusun}
                    </p>
                    <p className="text-xs text-slate-500">
                      Penulis dari masyarakat Desa Laiyolo Baru
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation to Other Articles */}
          <div className="flex justify-center">
            <Link href="/artikel">
              <Button className="bg-brand-navy hover:bg-brand-navy/90">
                Lihat Artikel Lainnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
