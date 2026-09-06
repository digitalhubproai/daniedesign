"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [firstPath] = useState(pathname);
  const isFirstLoad = pathname === firstPath;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!isFirstLoad && (
        <motion.div
          key={`overlay-${pathname}`}
          initial={{ y: "100%" }}
          animate={{ y: ["100%", "0%", "0%", "-100%"] }}
          transition={{
            duration: 0.85,
            times: [0, 0.3, 0.55, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
          className="pointer-events-none fixed inset-0 z-[150] bg-accent"
          aria-hidden="true"
        />
      )}
    </>
  );
}