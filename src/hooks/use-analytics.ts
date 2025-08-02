"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsData {
  sessionId: string;
  page: string;
  title: string;
  referrer: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  timezone: string;
}

export function useAnalytics() {
  const pathname = usePathname();
  const sessionId = useRef<string>("");
  const pageStartTime = useRef<number>(Date.now());

  // Generate session ID
  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Track session start
      trackSession();
    }
  }, []);

  // Track page views
  useEffect(() => {
    const currentPage = pathname;

    // Track page view
    trackPageView(currentPage);

    // Update page start time
    pageStartTime.current = Date.now();

    // Track page exit on unmount
    return () => {
      const timeOnPage = Date.now() - pageStartTime.current;
      trackPageExit(currentPage, timeOnPage);
    };
  }, [pathname]);

  const trackSession = async () => {
    try {
      const analyticsData: AnalyticsData = {
        sessionId: sessionId.current,
        page: window.location.pathname + window.location.search,
        title: document.title,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      await fetch("/api/analytics/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analyticsData),
      });
    } catch (error) {
      console.error("Failed to track session:", error);
    }
  };

  const trackPageView = async (page: string) => {
    try {
      await fetch("/api/analytics/pageview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          page,
          title: document.title,
          referrer: document.referrer,
        }),
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  };

  const trackPageExit = async (page: string, timeOnPage: number) => {
    try {
      await fetch("/api/analytics/page-exit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          page,
          timeOnPage,
        }),
      });
    } catch (error) {
      console.error("Failed to track page exit:", error);
    }
  };

  return {
    sessionId: sessionId.current,
  };
}
