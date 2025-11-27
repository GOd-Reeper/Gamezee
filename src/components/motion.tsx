"use client";

import {
  motion as framerMotion,
  AnimatePresence as FramerAnimatePresence,
  type MotionProps
} from "framer-motion";

// Export specific motion components that we use in our app
export const motion = framerMotion;
export const AnimatePresence = FramerAnimatePresence;

// Commonly used motion components with their props
export type { MotionProps }; 