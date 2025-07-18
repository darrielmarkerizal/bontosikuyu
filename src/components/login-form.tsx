"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Add type definitions
interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token?: string;
    expiresIn?: string;
  };
  timestamp?: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  required?: string[];
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("🔐 Login attempt started:", {
      identifier: formData.identifier,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    try {
      console.log("📡 Sending login request to /api/login");

      const response = await axios.post<LoginResponse>("/api/login", {
        identifier: formData.identifier,
        password: formData.password,
      });

      console.log("✅ Login API response received:", {
        status: response.status,
        success: response.data.success,
        message: response.data.message,
        hasToken: !!response.data.data?.token,
        timestamp: response.data.timestamp,
      });

      if (response.data.success) {
        // Show success toast
        toast.success("Login berhasil!", {
          description: response.data.message || "Selamat datang kembali",
        });

        // Store token in cookies for 24 hours
        if (response.data.data?.token) {
          console.log("🍪 Storing token in cookies");
          Cookies.set("token", response.data.data.token, {
            expires: 1, // 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          console.log("✅ Token stored successfully");
        } else {
          console.warn("⚠️ No token received in response");
        }

        console.log("🔄 Redirecting to dashboard");
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        console.error(
          "❌ Login unsuccessful despite 200 response:",
          response.data
        );
        // Handle unsuccessful response (shouldn't happen but good practice)
        toast.error("Login gagal", {
          description: response.data.message || "Terjadi kesalahan saat login",
        });
      }
    } catch (error: unknown) {
      console.error("💥 Login error occurred:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const errorData = error.response?.data;
        const errorStatus = error.response?.status;

        console.error("🔍 Axios error details:", {
          status: errorStatus,
          statusText: error.response?.statusText,
          data: errorData,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          },
        });

        if (errorStatus === 400) {
          console.error("🚫 400 - Validation Error:", errorData);
          // Validation errors (missing fields)
          toast.error("Data tidak lengkap", {
            description:
              errorData?.message ||
              "Mohon lengkapi semua field yang diperlukan",
          });
        } else if (errorStatus === 401) {
          console.error("🔒 401 - Authentication Error:", errorData);
          // Authentication errors (wrong credentials)
          toast.error("Login gagal", {
            description:
              errorData?.message || "Email/username atau password tidak valid",
          });
        } else if (errorStatus === 500) {
          console.error("⚡ 500 - Server Error:", errorData);
          // Server errors
          toast.error("Kesalahan server", {
            description:
              errorData?.message ||
              "Terjadi kesalahan pada server. Silakan coba lagi.",
          });
        } else {
          console.error("❓ Other HTTP Error:", {
            status: errorStatus,
            data: errorData,
          });
          // Other HTTP errors
          toast.error("Login gagal", {
            description:
              errorData?.message || "Terjadi kesalahan yang tidak terduga",
          });
        }
      } else if (error instanceof Error) {
        console.error("⚠️ Non-Axios Error:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });

        // Network or other errors
        if (error.message.includes("Network Error")) {
          console.error("🌐 Network Error detected");
          toast.error("Kesalahan jaringan", {
            description:
              "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
          });
        } else {
          console.error("🚨 Generic Error:", error.message);
          toast.error("Login gagal", {
            description:
              error.message || "Terjadi kesalahan yang tidak terduga",
          });
        }
      } else {
        console.error("❌ Unknown Error Type:", {
          error,
          type: typeof error,
          constructor: error?.constructor?.name,
        });

        // Unknown errors
        toast.error("Login gagal", {
          description: "Terjadi kesalahan yang tidak terduga",
        });
      }
    } finally {
      console.log("🏁 Login attempt completed");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Salama&apos;ki! Selamat Datang
                </h1>
                <p className="text-balance text-muted-foreground">
                  Masuk ke akun CMS Desa Laiyolo Baru
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="identifier">Email atau Username</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="email@contoh.com atau username"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Kata Sandi</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi Anda"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"}
                    </span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login_photo.jpg"
              alt="Pemandangan Pantai Bontosikuyu"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={500}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Dengan melanjutkan, Anda menyetujui <a href="#">Syarat Layanan</a> dan{" "}
        <a href="#">Kebijakan Privasi</a> kami.
      </div>
    </div>
  );
}
