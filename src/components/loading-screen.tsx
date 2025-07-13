"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HyperText } from "@/components/magicui/hyper-text";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const texts = ["Selamat Datang", "Salama' ki Datang", "Welcome"];

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;

    if (!container || !circle) return;

    // No initial animation - start immediately visible
    gsap.set(container, { y: "0%", opacity: 1 });
    gsap.set(circle, { scale: 1, opacity: 0.05 });

    // Text sequence with HyperText
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= texts.length) {
          clearInterval(textInterval);
          // Start exit animation
          setTimeout(() => {
            const exitTl = gsap.timeline({
              onComplete: () => {
                setIsAnimating(false);
                onComplete();
              },
            });

            // Circle morphing and expanding
            exitTl
              .to(circle, {
                scale: 0.9,
                opacity: 0.8,
                duration: 0.5,
                ease: "power2.inOut",
              })
              .to(
                circle,
                {
                  scale: 20,
                  opacity: 0,
                  duration: 1.5,
                  ease: "power2.out",
                },
                0.5
              )
              // Container slide up
              .to(
                container,
                {
                  y: "-100%",
                  duration: 1.2,
                  ease: "power2.inOut",
                },
                0.8
              );
          }, 500);
          return prev;
        }
        return nextIndex;
      });
    }, 1500);

    return () => {
      clearInterval(textInterval);
    };
  }, [onComplete, texts.length]);

  if (!isAnimating) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-secondary overflow-hidden"
    >
      {/* Background circle untuk transisi */}
      <div
        ref={circleRef}
        className="absolute w-96 h-96 rounded-full bg-brand-primary/10"
      />

      {/* Loading Text with HyperText */}
      <div className="relative z-10 text-center">
        <HyperText
          className="text-4xl md:text-6xl lg:text-7xl font-sentient font-bold text-brand-primary"
          duration={800}
          delay={0}
          startOnView={false}
          animateOnHover={false}
          key={currentTextIndex}
          style={{
            textShadow: "0 2px 10px rgba(248,183,44,0.3)",
          }}
        >
          {texts[currentTextIndex]}
        </HyperText>
      </div>
    </div>
  );
}
