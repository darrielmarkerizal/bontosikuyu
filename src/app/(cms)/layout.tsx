"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard/layout";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPages = ["/login", "/register", "/forgot-password"];
  const isPublicPage = publicPages.some((page) => pathname.includes(page));

  // For public pages (login, register, etc.), return children directly
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </div>
    );
  }

  // For dashboard pages, wrap with DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
}
