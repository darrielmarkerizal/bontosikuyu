"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const dusunOptions = [
  "Dusun Laiyolo",
  "Dusun Pangkaje'ne",
  "Dusun Timoro",
  "Dusun Kilotepo",
];

interface WriterFormState {
  fullName: string;
  phoneNumber: string;
  dusun: string;
}

export default function WriterForm() {
  const [form, setForm] = useState<WriterFormState>({
    fullName: "",
    phoneNumber: "",
    dusun: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDusunChange = (value: string) => {
    setForm({ ...form, dusun: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/writers", form);
      toast.success("Penulis berhasil ditambahkan!", {
        description: `${form.fullName} telah ditambahkan ke sistem.`,
      });
      router.push("/dashboard/penulis");
    } catch (err: unknown) {
      let message = "Terjadi kesalahan tidak diketahui";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || "Gagal menambah penulis";
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      toast.error("Gagal menambah penulis", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/penulis")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold leading-tight">
              Tambah Penulis
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Isi data penulis untuk menambah penulis baru ke sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Data Penulis</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off"
            >
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Nama Lengkap"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor HP *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={20}
                  pattern="[0-9]+"
                  placeholder="08xxxxxxxxxx"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dusun">Dusun *</Label>
                <Select onValueChange={handleDusunChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Dusun" />
                  </SelectTrigger>
                  <SelectContent>
                    {dusunOptions.map((dusun) => (
                      <SelectItem key={dusun} value={dusun}>
                        {dusun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/penulis")}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
