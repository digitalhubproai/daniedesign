"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type SplitTextProps = {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  start?: string;
};

export default function SplitText({
  text,
  as: Tag = "p",
  className,
  delay = 0,
  stagger = 0.04,
  once = true,
  start = "top 85%",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (!words.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          once,
        },
      });
      tl.fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger, ease: "power3.out" }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger, once, start]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          aria-hidden="true"
        >
          <span data-word className="inline-block will-change-transform">
            {word}
          </span>
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}