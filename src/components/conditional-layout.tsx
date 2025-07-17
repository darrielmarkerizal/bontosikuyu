"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { LenisProvider } from "@/components/lenis-provider";
import Footer from "@/components/footer";
import ClientLayout from "@/components/client-layout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current path is CMS route
  const isCMSRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  // For CMS routes, return children directly without ClientLayout
  if (isCMSRoute) {
    return <>{children}</>;
  }

  // For website routes, use ClientLayout with navbar and footer
  return (
    <ClientLayout>
      <LenisProvider>
        <Navbar />
        {children}
        <Footer />
      </LenisProvider>
    </ClientLayout>
  );
}
