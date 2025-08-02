"use client";

import { Suspense } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
