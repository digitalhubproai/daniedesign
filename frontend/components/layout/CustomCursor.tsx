"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { gsap, prefersReducedMotion, isCoarsePointer } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-active");

    const xTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: "auto" });
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (target) {
        const text =
          target.getAttribute("data-cursor-label") ??
          target.getAttribute("data-cursor") ??
          "OPEN";
        setLabel(text);
        gsap.to(ring, {
          width: 88,
          height: 88,
          backgroundColor: "rgba(244,242,238,0.95)",
          borderColor: "rgba(255,77,31,0.9)",
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      } else {
        setLabel(null);
        gsap.to(ring, {
          width: 40,
          height: 40,
          backgroundColor: "transparent",
          borderColor: "rgba(244,242,238,0.35)",
          duration: 0.3,
        });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };
    const onEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-accent opacity-0"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/35 opacity-0"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          {label}
        </span>
      </div>
    </div>
  );
}