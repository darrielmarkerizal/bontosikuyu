import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/conditional-layout";

import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const sentient = localFont({
  src: [
    {
      path: "./fonts/Sentient-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Sentient-ExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/Sentient-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Sentient-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/Sentient-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Sentient-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Sentient-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Sentient-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/Sentient-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Sentient-BoldItalic.otf",
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

export const metadata: Metadata = {
  title: "Laiyolobaru.com - Desa Laiyolo Baru",
  description:
    "Website resmi Desa Laiyolo Baru dengan fitur AI Deteksi Stunting dan artikel informasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${geistSans.variable} ${geistMono.variable} ${sentient.variable} antialiased font-plus-jakarta-sans`}
        style={{
          backgroundColor: "#173A57",
          margin: 0,
          padding: 0,
        }}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="bottom-right" richColors closeButton expand={true} />
      </body>
    </html>
  );
}
