"use client";

import { useRouter } from "next/navigation";
import { ArticleForm } from "@/components/artikel/article-form";
import { Article } from "@/components/artikel/article-types";
import { mockArticles } from "@/components/artikel/article-data";

interface EditArtikelPageProps {
  params: {
    id: string;
  };
}

export default function EditArtikelPage({ params }: EditArtikelPageProps) {
  const router = useRouter();
  const articleId = parseInt(params.id);

  // Find the article to edit
  const article = mockArticles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Artikel Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            Artikel dengan ID {articleId} tidak dapat ditemukan.
          </p>
          <button
            onClick={() => router.push("/dashboard/artikel")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Kembali ke Daftar Artikel
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (articleData: Partial<Article>) => {
    // TODO: Implement actual update functionality (API call)
    console.log("Updating article:", articleData);

    // Simulate save success
    setTimeout(() => {
      alert(`Artikel "${articleData.title}" berhasil diperbarui!`);
      router.push("/dashboard/artikel");
    }, 1000);
  };

  const handleCancel = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang."
      )
    ) {
      router.push("/dashboard/artikel");
    }
  };

  const handlePreview = (articleData: Partial<Article>) => {
    // TODO: Implement preview functionality
    console.log("Preview article:", articleData);
    alert("Fitur preview akan segera tersedia!");
  };

  return (
    <ArticleForm
      article={article}
      isEditing={true}
      onSave={handleSave}
      onCancel={handleCancel}
      onPreview={handlePreview}
    />
  );
}
