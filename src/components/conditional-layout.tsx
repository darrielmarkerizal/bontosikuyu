"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LoadingScreen from "@/components/loading-screen";
import ClientLayout from "@/components/client-layout";
import { LenisProvider } from "@/components/lenis-provider";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [showLoading, setShowLoading] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Check if current route should show CMS layout
  const isCMSRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem("hasVisitedSite");

    if (hasVisited || isCMSRoute) {
      // Skip loading screen for subsequent visits or CMS routes
      setShowLoading(false);
      setIsLoadingComplete(true);
    }
  }, [isCMSRoute]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setIsLoadingComplete(true);
  };

  // Don't show anything until loading is resolved
  if (!isLoadingComplete && showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // CMS routes (dashboard, login) - no navbar/footer
  if (isCMSRoute) {
    return <>{children}</>;
  }

  // Public routes - with navbar/footer
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
