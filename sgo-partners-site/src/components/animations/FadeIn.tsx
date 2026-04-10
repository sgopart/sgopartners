"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  duration?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.6,
}: FadeInProps) {
  const directionOffset = 30;
  const initial = {
    opacity: 0,
    y: direction === "up" ? directionOffset : direction === "down" ? -directionOffset : 0,
    x: direction === "left" ? directionOffset : direction === "right" ? -directionOffset : 0,
  };

  if (direction === "none") {
    initial.y = 0;
    initial.x = 0;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
