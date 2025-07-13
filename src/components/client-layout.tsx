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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Show content immediately on mount
    setShowContent(true);

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

  const handleTransitionStart = () => {
    // This will be called when loading screen starts exit animation
    // Content is already visible, no need to do anything
  };

  return (
    <LoadingContext.Provider value={{ isLoadingComplete }}>
      {/* Content always visible behind loading screen */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          visibility: showContent ? "visible" : "hidden",
        }}
      >
        {children}
      </div>

      {/* Loading screen overlays content */}
      {isLoading && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          onTransitionStart={handleTransitionStart}
        />
      )}
    </LoadingContext.Provider>
  );
}
