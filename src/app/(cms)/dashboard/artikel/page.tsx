"use client";

import { useState } from "react";
import { ArticleHeader } from "@/components/artikel/article-header";
import { ArticleStats } from "@/components/artikel/article-stats";
import { mockArticles } from "@/components/artikel/article-data";

export default function ArtikelPage() {
  const [articles] = useState(mockArticles);

  return (
    <div className="space-y-6">
      <ArticleHeader />

      <ArticleStats articles={articles} />
    </div>
  );
}
