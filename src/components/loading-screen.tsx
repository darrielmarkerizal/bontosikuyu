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
  const particlesRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  const texts = ["Selamat Datang", "Salama' ki Datang", "Welcome"];

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;
    const particles = particlesRef.current;
    const wave = waveRef.current;
    const morph = morphRef.current;

    if (!container || !circle || !particles || !wave || !morph) return;

    // Initial setup
    gsap.set(container, { y: "0%", opacity: 1 });
    gsap.set(circle, { scale: 1, opacity: 0.05 });
    gsap.set(particles, { opacity: 0 });
    gsap.set(wave, { scaleX: 0, transformOrigin: "center" });
    gsap.set(morph, { scale: 0, opacity: 0 });

    // Start first animation
    setTimeout(() => {
      setTriggerAnimation(1);
    }, 100);

    // Text sequence
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= texts.length) {
          clearInterval(textInterval);

          // SUPER ADVANCED EXIT ANIMATION
          setTimeout(() => {
            const masterTl = gsap.timeline({
              onComplete: () => {
                setIsAnimating(false);
                onComplete();
              },
            });

            // Phase 1: Particle explosion
            masterTl
              .to(particles, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              })
              .to(
                ".particle",
                {
                  scale: 2,
                  opacity: 0,
                  rotation: 360,
                  x: "random(-200, 200)",
                  y: "random(-200, 200)",
                  duration: 1,
                  ease: "power2.out",
                  stagger: {
                    amount: 0.3,
                    from: "random",
                  },
                },
                0.2
              );

            // Phase 2: Morphing circle transformation
            masterTl
              .to(
                circle,
                {
                  scale: 1.5,
                  opacity: 0.3,
                  duration: 0.4,
                  ease: "back.out(1.7)",
                },
                0.5
              )
              .to(
                morph,
                {
                  scale: 1,
                  opacity: 0.8,
                  rotation: 180,
                  duration: 0.6,
                  ease: "elastic.out(1, 0.5)",
                },
                0.7
              );

            // Phase 3: Wave expansion
            masterTl
              .to(
                wave,
                {
                  scaleX: 3,
                  scaleY: 0.1,
                  opacity: 0.6,
                  duration: 0.8,
                  ease: "power3.out",
                },
                1
              )
              .to(
                wave,
                {
                  scaleX: 8,
                  scaleY: 8,
                  opacity: 0,
                  duration: 1.2,
                  ease: "power2.out",
                },
                1.3
              );

            // Phase 4: Liquid morphing effect
            masterTl.to(
              morph,
              {
                scale: 15,
                opacity: 0,
                rotation: 720,
                borderRadius: "0%",
                duration: 1.5,
                ease: "power2.out",
              },
              1.8
            );

            // Phase 5: Final container transformation
            masterTl
              .to(
                container,
                {
                  scale: 1.1,
                  opacity: 0.8,
                  duration: 0.5,
                  ease: "power2.inOut",
                },
                2.5
              )
              .to(
                container,
                {
                  y: "-100%",
                  scale: 0.9,
                  opacity: 0,
                  rotationX: -90,
                  duration: 1,
                  ease: "power3.inOut",
                },
                2.8
              );
          }, 500);
          return prev;
        }
        setTriggerAnimation(nextIndex + 1);
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
      style={{ perspective: "1000px" }}
    >
      {/* Morphing background */}
      <div
        ref={morphRef}
        className="absolute w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(248,183,44,0.3) 0%, rgba(33,188,168,0.2) 50%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />

      {/* Wave effect */}
      <div
        ref={waveRef}
        className="absolute w-96 h-96 rounded-full border-4 border-brand-primary/30"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(248,183,44,0.1), transparent)",
        }}
      />

      {/* Main circle */}
      <div
        ref={circleRef}
        className="absolute w-96 h-96 rounded-full bg-brand-primary/10"
        style={{
          boxShadow:
            "0 0 100px rgba(248,183,44,0.2), inset 0 0 50px rgba(248,183,44,0.1)",
        }}
      />

      {/* Particle system */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 rounded-full bg-brand-primary"
            style={{
              left: `${50 + Math.sin(i * 0.5) * 20}%`,
              top: `${50 + Math.cos(i * 0.5) * 20}%`,
              opacity: 0.6,
              filter: "blur(0.5px)",
              boxShadow: "0 0 10px rgba(248,183,44,0.5)",
            }}
          />
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-32 h-32 border border-brand-primary/20 rotate-45"
          style={{
            left: "20%",
            top: "30%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-24 h-24 rounded-full border border-brand-accent/20"
          style={{
            right: "25%",
            bottom: "35%",
            animation: "float 4s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-16 h-16 bg-brand-primary/10 rotate-12"
          style={{
            left: "70%",
            top: "20%",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            animation: "float 5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="relative z-10 text-center">
        <HyperText
          className="text-4xl md:text-6xl lg:text-7xl font-sentient font-bold text-brand-primary"
          duration={800}
          delay={0}
          startOnView={false}
          animateOnHover={false}
          key={`${currentTextIndex}-${triggerAnimation}`}
          style={{
            textShadow:
              "0 4px 20px rgba(248,183,44,0.4), 0 0 40px rgba(248,183,44,0.2)",
            filter: "drop-shadow(0 0 10px rgba(248,183,44,0.3))",
          }}
        >
          {texts[currentTextIndex]}
        </HyperText>
      </div>

      {/* Ambient light effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-full h-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(248,183,44,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(33,188,168,0.1) 0%, transparent 50%)",
            animation: "pulse 4s ease-in-out infinite alternate",
          }}
        />
      </div>
    </div>
  );
}
