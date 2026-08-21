"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type SplitTextProps = {
  text: string;
  as?: React.ElementType;
  className?: string;
  mode?: "words" | "chars";
  delay?: number;
  stagger?: number;
  once?: boolean;
  start?: string;
};

export default function SplitText({
  text,
  as: Tag = "p",
  className,
  mode = "words",
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
    const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-char]"));
    if (!words.length && !chars.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([...words, ...chars], { y: 0, rotateX: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, paused: true });

      if (mode === "chars") {
        tl.fromTo(
          chars,
          { yPercent: 120, rotateX: -85, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.8,
            stagger: stagger / 3,
            ease: "power3.out",
            transformPerspective: 700,
          }
        );
      } else {
        tl.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger, ease: "power3.out" }
        );
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };

      // IntersectionObserver: bulletproof — fires whenever the element
      // enters the viewport, no scroll-position math involved.
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              play();
              io.disconnect();
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
    }, el);

    return () => ctx.revert();
  }, [text, mode, delay, stagger, once, start]);

  if (mode === "chars") {
    return (
      <Tag ref={ref as React.Ref<never>} className={className} aria-label={text}>
        {text.split(" ").map((word, i) => (
          <span
            key={i}
            className="inline-block whitespace-nowrap"
            aria-hidden="true"
          >
            {Array.from(word).map((char, j) => (
              <span
                key={j}
                className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
              >
                <span data-char className="inline-block will-change-transform">
                  {char}
                </span>
              </span>
            ))}
            {i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </Tag>
    );
  }

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