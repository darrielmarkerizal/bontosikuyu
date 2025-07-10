"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

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

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    } else {
      slideControls.start("hidden");
      mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

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
        transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
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
        transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
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
