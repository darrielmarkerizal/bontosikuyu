"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HyperText } from "@/components/magicui/hyper-text";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  const texts = ["Selamat Datang", "Salama' ki Datang", "Welcome"];

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem("hasVisitedSite");

    if (hasVisited) {
      // Skip loading screen for subsequent navigations
      setIsAnimating(false);
      onComplete();
      return;
    }

    // Mark as visited for this session
    sessionStorage.setItem("hasVisitedSite", "true");

    const container = containerRef.current;
    const logo = logoRef.current;
    const progress = progressRef.current;
    const overlay = overlayRef.current;

    if (!container || !logo || !progress || !overlay) return;

    // Initial setup - clean and minimal
    gsap.set(container, { opacity: 1 });
    gsap.set(logo, { y: 20, opacity: 0 });
    gsap.set(progress, { scaleX: 0, transformOrigin: "left" });
    gsap.set(overlay, { opacity: 1 });

    // Elegant entrance
    gsap.to(logo, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2,
    });

    // Start first text animation
    setTimeout(() => {
      setTriggerAnimation(1);
    }, 300);

    // Text sequence with shorter intervals
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= texts.length) {
          clearInterval(textInterval);

          // Sophisticated exit animation
          setTimeout(() => {
            const exitTl = gsap.timeline({
              onComplete: () => {
                setIsAnimating(false);
                onComplete();
              },
            });

            // Progress bar completion
            exitTl.to(progress, {
              scaleX: 1,
              duration: 0.6,
              ease: "power2.out",
            });

            // Logo elegant fade with slight scale
            exitTl.to(
              logo,
              {
                y: -30,
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                ease: "power2.inOut",
              },
              0.3
            );

            // Smooth overlay fade - premium feel
            exitTl.to(
              overlay,
              {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
              },
              0.6
            );

            // Container slide up elegantly
            exitTl.to(
              container,
              {
                y: "-100%",
                duration: 0.6,
                ease: "power2.inOut",
              },
              0.8
            );
          }, 150);
          return prev;
        }
        setTriggerAnimation(nextIndex + 1);
        return nextIndex;
      });
    }, 1000); // Faster transitions

    return () => {
      clearInterval(textInterval);
    };
  }, [onComplete, texts.length]);

  if (!isAnimating) return null;

  return (
    <>
      {/* Clean background overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[99] bg-brand-secondary"
      />

      {/* Minimal loading screen */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle geometric accent */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-brand-primary/30 to-transparent"></div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-px h-32 bg-gradient-to-t from-transparent via-brand-primary/30 to-transparent"></div>

        {/* Main content container */}
        <div ref={logoRef} className="text-center space-y-12">
          {/* Elegant logo/brand */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-primary/20 bg-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-brand-primary"></div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-sentient font-bold text-brand-primary tracking-wide">
                Laiyolo Baru
              </h1>
              <div className="w-16 h-px bg-brand-primary/40 mx-auto"></div>
            </div>
          </div>

          {/* Premium text animation */}
          <div className="min-h-[80px] flex items-center justify-center">
            <HyperText
              className="text-3xl md:text-4xl font-sentient font-medium text-brand-primary tracking-wide"
              duration={600}
              delay={0}
              startOnView={false}
              animateOnHover={false}
              key={`${currentTextIndex}-${triggerAnimation}`}
            >
              {texts[currentTextIndex]}
            </HyperText>
          </div>
        </div>

        {/* Minimal progress indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48">
          <div className="h-px bg-brand-primary/20 relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-0 h-full bg-brand-primary"
            ></div>
          </div>
          <div className="flex justify-between mt-3 text-xs text-brand-primary/60 font-plus-jakarta-sans tracking-widest">
            <span>LOADING</span>
            <span>EXPERIENCE</span>
          </div>
        </div>

        {/* Sophisticated corner accents */}
        <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-brand-primary/20"></div>
        <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-brand-primary/20"></div>
        <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-brand-primary/20"></div>
        <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-brand-primary/20"></div>
      </div>
    </>
  );
}
