"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type MarqueeProps = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
};

export default function Marquee({
  items,
  speed = 60,
  className,
  separator = "—",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: items.length * (120 / speed),
        ease: "none",
        repeat: -1,
      });

      track.addEventListener("mouseenter", () => tween.pause());
      track.addEventListener("mouseleave", () => tween.resume());

      return () => {
        track.removeEventListener("mouseenter", () => tween.pause());
        track.removeEventListener("mouseleave", () => tween.resume());
      };
    }, track);

    return () => ctx.revert();
  }, [items, speed]);

  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div
        ref={trackRef}
        className="flex w-max items-center whitespace-nowrap will-change-transform"
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="display text-[9vw] leading-none font-bold uppercase tracking-tight md:text-[6.5vw]">
              {item}
            </span>
            <span className="mx-[3vw] text-[3vw] text-accent md:mx-[2.5vw] md:text-[2vw]">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}