export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  category: string;
  publishDate: string;
  status: "published" | "draft" | "archived";
  views: number;
  image: string;
}

export const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800",
};

export const statusLabels = {
  published: "Dipublikasi",
  draft: "Draft",
  archived: "Diarsipkan",
};
