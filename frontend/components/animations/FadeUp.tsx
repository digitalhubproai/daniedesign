"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once the element scrolls into view. */
  delay?: number;
  /** Starting offset in px. */
  y?: number;
};

/**
 * Scroll-triggered fade-and-rise wrapper.
 *
 * Children render invisible until the block enters the viewport, then animate
 * up with a power3 ease. Respects prefers-reduced-motion (content just shows).
 */
export default function FadeUp({ children, className, delay = 0, y = 32 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 87%", once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={`opacity-0 ${className ?? ""}`}>
      {children}
    </div>
  );
}
