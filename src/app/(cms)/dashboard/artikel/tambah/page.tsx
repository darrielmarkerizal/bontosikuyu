"use client";

import { useRouter } from "next/navigation";
import { ArticleForm } from "@/components/artikel/article-form";
import { Article } from "@/components/artikel/article-types";

export default function TambahArtikelPage() {
  const router = useRouter();

  const handleSave = (articleData: Partial<Article>) => {
    // TODO: Implement actual save functionality (API call)
    console.log("Saving article:", articleData);

    // Simulate save success
    setTimeout(() => {
      alert(
        `Artikel "${articleData.title}" berhasil ${
          articleData.status === "published"
            ? "dipublikasikan"
            : "disimpan sebagai draft"
        }!`
      );
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

  return <ArticleForm onSave={handleSave} onCancel={handleCancel} />;
}
