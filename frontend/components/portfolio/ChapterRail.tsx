"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Chapter = { key: string; label: string };

type ChapterRailProps = {
  chapters: Chapter[];
};

/**
 * Vertical chapter rail for the case-study narrative.
 *
 * Renders one dot + label per narrative step and tracks which step is
 * currently crossing the middle of the viewport, highlighting it. Pure
 * IntersectionObserver — no scroll listeners, no layout thrash. Clicking a
 * chapter smooth-scrolls to its block.
 */
export default function ChapterRail({ chapters }: ChapterRailProps) {
  const [active, setActive] = useState(0);
  const observed = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    const visible = () =>
      [...observed.current.values()].filter((e) => e.isIntersecting);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observed.current.set(entry.target.id, entry);
        });
        const shown = visible();
        if (!shown.length) return;
        // Pick the entry whose top is closest above viewport middle.
        const mid = window.innerHeight / 2;
        const winner = shown.reduce((a, b) => {
          const da = Math.abs(a.boundingClientRect.top - mid);
          const db = Math.abs(b.boundingClientRect.top - mid);
          return da <= db ? a : b;
        });
        const idx = chapters.findIndex((c) => `step-${c.key}` === winner.target.id);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    chapters.forEach((c) => {
      const el = document.getElementById(`step-${c.key}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [chapters]);

  const jump = (key: string) => {
    const el = document.getElementById(`step-${key}`);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav aria-label="Case study chapters" className="space-y-1">
      {chapters.map((c, i) => {
        const isActive = i === active;
        return (
          <button
            key={c.key}
            onClick={() => jump(c.key)}
            className="group flex w-full items-center gap-3 py-1.5 text-left"
          >
            <span
              className={`relative h-px shrink-0 transition-all duration-500 ${
                isActive ? "w-8 bg-accent" : "w-4 bg-ink/20 group-hover:w-6 group-hover:bg-ink/40"
              }`}
            />
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-ink/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`display truncate text-sm transition-colors duration-300 ${
                isActive ? "font-semibold text-ink" : "text-muted group-hover:text-ink/80"
              }`}
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
