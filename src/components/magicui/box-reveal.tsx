"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLoadingContext } from "@/components/client-layout";

interface BoxRevealProps {
  children: JSX.Element;
  width?: "fit-content" | "100%" | string;
  boxColor?: string;
  duration?: number;
  textAlign?: "left" | "center" | "right";
}

export const BoxReveal = ({
  children,
  width = "fit-content",
  boxColor = "#5046e6",
  duration,
  textAlign = "left",
}: BoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const { isLoadingComplete } = useLoadingContext();

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -50px 0px",
  });

  // Main animation trigger
  useEffect(() => {
    if (isLoadingComplete && isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        slideControls.start("visible");
        mainControls.start("visible");
        setHasAnimated(true);
      }, 200); // Slightly longer delay

      return () => clearTimeout(timer);
    }
  }, [isLoadingComplete, isInView, mainControls, slideControls, hasAnimated]);

  // Reset on loading state change
  useEffect(() => {
    if (!isLoadingComplete) {
      setHasAnimated(false);
      mainControls.set("hidden");
      slideControls.set("hidden");
    }
  }, [isLoadingComplete, mainControls, slideControls]);

  const containerStyles = {
    position: "relative" as const,
    width,
    overflow: "hidden" as const,
    margin:
      textAlign === "center"
        ? "0 auto"
        : textAlign === "right"
          ? "0 0 0 auto"
          : "0 auto 0 0",
  };

  return (
    <div ref={ref} style={containerStyles} className={`text-${textAlign}`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: duration ? duration : 0.6, delay: 0.25 }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ? duration : 0.6, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
        }}
      />
    </div>
  );
};
