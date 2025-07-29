"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WriterForm } from "@/components/penulis/writer-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Writer {
  id: number;
  fullName: string;
  phoneNumber: string;
  dusun: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditWriterPage() {
  const params = useParams();
  const router = useRouter();
  const [writer, setWriter] = useState<Writer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriter = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/writers/${params.id}`);

        if (response.data.success) {
          setWriter(response.data.data);
        } else {
          toast.error("Gagal memuat data penulis", {
            description: response.data.message,
          });
          router.push("/dashboard/penulis");
        }
      } catch (error) {
        console.error("Error fetching writer:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            toast.error("Penulis tidak ditemukan");
            router.push("/dashboard/penulis");
          } else {
            toast.error("Gagal memuat data penulis", {
              description: error.response?.data?.message || error.message,
            });
          }
        } else {
          toast.error("Terjadi kesalahan", {
            description: "Gagal memuat data penulis",
          });
        }
        router.push("/dashboard/penulis");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchWriter();
    }
  }, [params.id, router]);

  const handleSave = async (updatedData: {
    fullName: string;
    phoneNumber: string;
    dusun: string;
  }) => {
    try {
      const response = await axios.put(
        `/api/writers/${params.id}`,
        updatedData
      );

      if (response.data.success) {
        toast.success("Penulis berhasil diperbarui", {
          description: `${updatedData.fullName} telah diperbarui`,
        });
        router.push("/dashboard/penulis");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating writer:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error("Gagal memperbarui penulis", {
          description: errorMessage,
        });
      } else {
        toast.error("Terjadi kesalahan", {
          description: "Gagal memperbarui penulis",
        });
      }
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/penulis");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Memuat data penulis...</p>
        </div>
      </div>
    );
  }

  if (!writer) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Penulis tidak ditemukan</h3>
          <p className="text-muted-foreground mb-4">
            Penulis yang Anda cari tidak dapat ditemukan.
          </p>
          <Button onClick={() => router.push("/dashboard/penulis")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Penulis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      <WriterForm
        writer={writer}
        isEditing={true}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
