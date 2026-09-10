"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Reading-progress line pinned to the very top of the page.
 *
 * A 3px accent bar that scales horizontally with scroll position, so visitors
 * on long case-study pages always know how far they are through the project.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-accent"
      aria-hidden="true"
    />
  );
}
