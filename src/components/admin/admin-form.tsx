"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Admin, AdminFormData } from "./admin-types";

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminFormData) => Promise<void>;
  admin?: Admin | null;
  loading?: boolean;
}

export function AdminForm({
  isOpen,
  onClose,
  onSubmit,
  admin,
  loading,
}: AdminFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [errors, setErrors] = useState<Partial<AdminFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Reset form when dialog opens/closes or admin changes
  useEffect(() => {
    if (isOpen) {
      if (admin) {
        // Edit mode - populate existing data
        setFormData({
          fullName: admin.fullName,
          email: admin.email,
          username: admin.username,
          password: "",
          confirmPassword: "",
          currentPassword: "",
        });
      } else {
        // Create mode - empty form
        setFormData({
          fullName: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          currentPassword: "",
        });
      }
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowCurrentPassword(false);
    }
  }, [isOpen, admin]);

  const handleInputChange = (field: keyof AdminFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AdminFormData> = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    } else if (formData.fullName.length < 2 || formData.fullName.length > 100) {
      newErrors.fullName = "Nama lengkap harus antara 2-100 karakter";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = "Username harus antara 3-50 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    // Password validation
    const isCreating = !admin;
    const isChangingPassword = admin && formData.password.trim() !== "";

    if (isCreating) {
      // New admin - password required
      if (!formData.password) {
        newErrors.password = "Password wajib diisi";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }

      // Confirm password required for new admin
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password tidak cocok";
      }
    } else if (isChangingPassword) {
      // Existing admin changing password
      if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }

      // Current password required when changing
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Password saat ini wajib diisi untuk mengubah password";
      }

      // Confirm password required when changing
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password tidak cocok";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== FORM SUBMIT DEBUG ===");
    console.log("Form data before validation:", {
      fullName: formData.fullName,
      email: formData.email,
      username: formData.username,
      password: formData.password ? "[PROVIDED]" : "[EMPTY]",
      confirmPassword: formData.confirmPassword ? "[PROVIDED]" : "[EMPTY]",
      isCreating: !admin,
    });

    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    try {
      // Prepare data - ensure confirmPassword is always included for new admins
      const submitData: AdminFormData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        currentPassword: formData.currentPassword,
      };

      console.log("✅ Validation passed, submitting:", {
        ...submitData,
        password: submitData.password ? "[HIDDEN]" : "",
        confirmPassword: submitData.confirmPassword ? "[HIDDEN]" : "",
        currentPassword: submitData.currentPassword ? "[HIDDEN]" : "",
      });

      await onSubmit(submitData);
      // Form will be closed by parent component on success
    } catch (error) {
      console.error("Form submission error:", error);
      // Don't close form on error
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {admin ? "Edit Admin" : "Tambah Admin Baru"}
          </DialogTitle>
          <DialogDescription>
            {admin
              ? "Perbarui informasi admin yang sudah ada."
              : "Tambahkan admin baru ke dalam sistem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Masukkan nama lengkap..."
              disabled={loading}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="contoh@email.com"
              disabled={loading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="username_admin"
              disabled={loading}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Hanya huruf, angka, dan underscore yang diperbolehkan
            </p>
          </div>

          {/* Current Password (for editing) */}
          {admin && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Password Saat Ini {formData.password ? "*" : "(opsional)"}
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  placeholder="Masukkan password saat ini..."
                  disabled={loading}
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={loading}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {admin ? "Password Baru (opsional)" : "Password *"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={
                  admin
                    ? "Biarkan kosong jika tidak ingin mengubah..."
                    : "Masukkan password (minimal 6 karakter)..."
                }
                disabled={loading}
                className={errors.password ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          {(!admin || formData.password.trim() !== "") && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Ulangi password..."
                  disabled={loading}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {admin ? "Mengupdate..." : "Menyimpan..."}
                </>
              ) : admin ? (
                "Update Admin"
              ) : (
                "Simpan Admin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
