"use client";

import { useState, useEffect, createContext, useContext } from "react";
import LoadingScreen from "@/components/loading-screen";

interface LoadingContextType {
  isLoadingComplete: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoadingComplete: false,
});

export const useLoadingContext = () => useContext(LoadingContext);

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    // Remove loading screen immediately
    setIsLoading(false);

    // Trigger BoxReveal after loading is done
    setTimeout(() => {
      setIsLoadingComplete(true);
      window.dispatchEvent(new Event("loadingComplete"));
    }, 100);
  };

  return (
    <LoadingContext.Provider value={{ isLoadingComplete }}>
      {/* Normal document flow - can scroll */}
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          visibility: isLoading ? "hidden" : "visible",
          opacity: isLoading ? 0 : 1,
          transition: isLoading ? "none" : "opacity 0.3s ease-out",
        }}
      >
        {children}
      </div>

      {/* Loading screen overlays content */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
    </LoadingContext.Provider>
  );
}
