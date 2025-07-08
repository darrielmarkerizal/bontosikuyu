"use client";

import { useState } from "react";
import { ArticleHeader } from "@/components/artikel/article-header";
import { ArticleStats } from "@/components/artikel/article-stats";
import { ArticleList } from "@/components/artikel/article-list";
import { mockArticles } from "@/components/artikel/article-data";

export default function ArtikelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState(mockArticles);

  const handleMoreOptions = (id: number) => {
    // TODO: Implement more options functionality (delete, duplicate, etc.)
    console.log("More options for article:", id);
  };

  return (
    <div className="space-y-6">
      <ArticleHeader />

      <ArticleStats articles={articles} />

      <ArticleList
        articles={articles}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMoreOptions={handleMoreOptions}
      />
    </div>
  );
}
