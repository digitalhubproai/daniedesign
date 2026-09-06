"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, prefersReducedMotion, isCoarsePointer } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const textEl = textRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-active");

    // Ultra-snappy dot tracking + smooth spring trailing for the outer ring
    const xTo = gsap.quickTo(dot, "x", { duration: 0.06, ease: "power2.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.06, ease: "power2.out" });
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });

    let isHoveringInteractive = false;
    let isHoveringBadge = false;

    const onMove = (e: MouseEvent) => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: "auto" });
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15, ease: "power2.in" });
      gsap.to(dot, { scale: 0.5, duration: 0.15, ease: "power2.in" });
    };

    const onMouseUp = () => {
      const targetScale = isHoveringBadge ? 1 : isHoveringInteractive ? 1.4 : 1;
      gsap.to(ring, { scale: targetScale, duration: 0.25, ease: "back.out(2)" });
      gsap.to(dot, { scale: 1, duration: 0.2, ease: "back.out(2)" });
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      );

      if (target) {
        const customText =
          target.getAttribute("data-cursor-label") ??
          target.getAttribute("data-cursor") ??
          null;

        if (customText) {
          isHoveringBadge = true;
          isHoveringInteractive = false;
          setLabel(customText);

          gsap.to(ring, {
            width: 80,
            height: 80,
            scale: 1,
            backgroundColor: "rgba(255, 77, 31, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 0 35px rgba(255, 77, 31, 0.45)",
            duration: 0.28,
            ease: "power3.out",
          });
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.18 });
          if (textEl) {
            gsap.fromTo(
              textEl,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.25, delay: 0.05, ease: "power2.out" }
            );
          }
        } else {
          isHoveringBadge = false;
          isHoveringInteractive = true;
          setLabel(null);

          gsap.to(ring, {
            width: 48,
            height: 48,
            scale: 1,
            backgroundColor: "rgba(255, 77, 31, 0.12)",
            borderColor: "rgba(255, 77, 31, 0.75)",
            boxShadow: "0 0 20px rgba(255, 77, 31, 0.25)",
            duration: 0.25,
            ease: "power3.out",
          });
          gsap.to(dot, {
            scale: 1.5,
            opacity: 1,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 12px rgba(255, 255, 255, 0.9)",
            duration: 0.2,
          });
        }
      } else {
        isHoveringBadge = false;
        isHoveringInteractive = false;
        setLabel(null);

        gsap.to(ring, {
          width: 32,
          height: 32,
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(244, 242, 238, 0.25)",
          boxShadow: "none",
          duration: 0.28,
          ease: "power3.out",
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          backgroundColor: "#ff4d1f",
          boxShadow: "0 0 8px rgba(255, 77, 31, 0.7)",
          duration: 0.2,
        });
      }
    };

    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const onEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[999]" aria-hidden="true">
      {/* Sleek Outer Floating Follower */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/25 opacity-0 backdrop-blur-[0.5px] transition-[border-color,background-color] duration-200"
      >
        {label && (
          <span
            ref={textRef}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#0e0e0e] drop-shadow-sm select-none"
          >
            {label}
          </span>
        )}
      </div>

      {/* High-Precision Inner Accent Dot */}
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-accent opacity-0 shadow-[0_0_8px_rgba(255,77,31,0.7)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}