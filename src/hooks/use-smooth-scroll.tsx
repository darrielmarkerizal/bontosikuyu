"use client";

import { useCallback } from "react";

export function useSmoothScroll() {
  const scrollToElement = useCallback(
    (elementId: string, offset: number = 0) => {
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.offsetTop - offset;
        window.lenis?.scrollTo(elementPosition, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    },
    []
  );

  const scrollToTop = useCallback(() => {
    window.lenis?.scrollTo(0, {
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, []);

  return { scrollToElement, scrollToTop };
}
