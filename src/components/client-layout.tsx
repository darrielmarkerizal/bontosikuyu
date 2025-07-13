"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

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
    // Immediately set loading complete and remove loading screen
    setIsLoading(false);

    // Wait a bit then trigger BoxReveal
    setTimeout(() => {
      setIsLoadingComplete(true);
      window.dispatchEvent(new Event("loadingComplete"));
    }, 100);
  };

  return (
    <LoadingContext.Provider value={{ isLoadingComplete }}>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        ref={contentRef}
        style={{
          visibility: "visible",
          position: "relative",
          zIndex: 1,
          opacity: isLoading ? 0 : 1, // Simple opacity control
          transition: isLoading ? "none" : "opacity 0.8s ease-out",
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
