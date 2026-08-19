"use client";

import Link from "next/link";
import { useRef } from "react";
import { useEffect } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { heroStats } from "@/data/stats";
import Counter from "@/components/animations/Counter";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const eyebrow = section.querySelector("[data-hero-eyebrow]");
      const lines = section.querySelectorAll("[data-hero-line]");
      const copy = section.querySelector("[data-hero-copy]");
      const ctas = section.querySelector("[data-hero-ctas]");
      const stats = section.querySelector("[data-hero-stats]");
      const hint = section.querySelector("[data-hero-hint]");
      const heading = section.querySelector("[data-hero-heading]");
      const video = section.querySelector("[data-hero-video]");
      const curtainTop = section.querySelector("[data-hero-curtain-top]");
      const curtainBottom = section.querySelector("[data-hero-curtain-bottom]");

      if (reduce) {
        gsap.set(
          [eyebrow, copy, ctas, stats, hint, curtainTop, curtainBottom],
          { opacity: 1, y: 0, scaleY: 0 }
        );
        gsap.set(video, { scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(curtainTop, { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: "power4.inOut" })
        .fromTo(
          curtainBottom,
          { scaleY: 1 },
          { scaleY: 0, duration: 1.1, ease: "power4.inOut" },
          "<"
        )
        .fromTo(video, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "power3.out" }, "-=0.9")
        .fromTo(eyebrow, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.8")
        .fromTo(
          lines,
          { yPercent: 120 },
          { yPercent: 0, duration: 1, stagger: 0.1 },
          "-=0.5"
        )
        .fromTo(copy, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6")
        .fromTo(ctas, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .fromTo(stats, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.4");

      gsap.to(heading, {
        yPercent: -45,
        scale: 0.55,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });
      gsap.to(video, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <video
          ref={videoRef}
          data-hero-video
          src="https://cdn.pixabay.com/video/2020/06/18/42521-431738825_large.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full scale-125 object-cover opacity-60 transition-opacity duration-700 will-change-transform"
        />
        {/* Soft elegant vignette so colors show through beautifully */}
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-paper/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-paper/30 to-paper/80" />
      </div>

      <div
        data-hero-curtain-top
        className="absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-[#0e0e0e]"
        aria-hidden="true"
      />
      <div
        data-hero-curtain-bottom
        className="absolute inset-x-0 bottom-0 z-20 h-1/2 origin-bottom bg-[#0e0e0e]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-36">
        <p
          data-hero-eyebrow
          className="eyebrow mb-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          <span>Full-Stack Web Development &amp; Brand Studio</span>
        </p>

        <h1
          data-hero-heading
          className="display max-w-5xl text-3xl font-bold leading-[1.08] tracking-tight will-change-transform sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.4rem]"
        >
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block will-change-transform">
              Creative, Design &amp;
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block text-accent will-change-transform">
              Web Development
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block text-ink/75 will-change-transform">
              for Growing Brands
            </span>
          </span>
        </h1>

        <div className="mt-5 flex max-w-3xl flex-col gap-6 md:mt-6">
          <p
            data-hero-copy
            className="max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg"
          >
            We engineer high-performance web applications, bespoke design systems, and converting digital experiences for modern brands.
          </p>

          <div data-hero-ctas className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              data-cursor="OPEN"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#0e0e0e] shadow-[0_10px_30px_rgba(255,77,31,0.35)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_15px_40px_rgba(255,77,31,0.5)] md:text-sm"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:text-accent md:text-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e]">
                <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
              </span>
              View Our Work
            </Link>
          </div>
        </div>

        <div
          data-hero-stats
          className="mt-16 grid max-w-3xl grid-cols-3 divide-x divide-ink/15 border-t border-ink/15 pt-8"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="display block text-3xl font-bold text-ink md:text-4xl"
              />
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-ink/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        data-hero-hint
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
      >
        <span className="eyebrow">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-accent" />
      </div>
    </section>
  );
}