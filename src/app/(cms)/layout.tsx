"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard/layout";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const sentient = localFont({
  src: [
    {
      path: "../fonts/Sentient-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Sentient-ExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/Sentient-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Sentient-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Sentient-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Sentient-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Sentient-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Sentient-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Sentient-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Sentient-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sentient",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPages = ["/login", "/register", "/forgot-password"];
  const isPublicPage = publicPages.some((page) => pathname.includes(page));

  const fontClasses = `${plusJakartaSans.variable} ${geistSans.variable} ${geistMono.variable} ${sentient.variable} antialiased font-plus-jakarta-sans`;

  if (isPublicPage) {
    return (
      <html lang="id">
        <body className={fontClasses}>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="id">
      <body className={fontClasses}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
