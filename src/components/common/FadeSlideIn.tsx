"use client";

import { motion } from "framer-motion";
import React from "react";

import type { HTMLMotionProps } from "framer-motion";

type FadeSlideInProps = {
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<"div">;

export default function FadeSlideIn({
  children,
  className = "",
  ...motionProps
}: FadeSlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
