"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

type FadeSlideInProps = {
  children: React.ReactNode;
  className?: string;
} & MotionProps;

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
