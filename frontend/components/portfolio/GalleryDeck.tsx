"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { X, ArrowLeft, ArrowRight, ZoomIn } from "lucide-react";

type GalleryDeckProps = {
  images: string[];
  title: string;
};

export default function GalleryDeck({ images, title }: GalleryDeckProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
  }, [images.length]);

  // Keyboard + body scroll lock
  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((p) => (p === null ? null : (p + 1) % images.length));
      if (e.key === "ArrowLeft") setLightboxIndex((p) => (p === null ? null : (p - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images.length]);

  // GSAP scroll animation
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 80);

        const cards = Array.from(
          track.querySelectorAll<HTMLElement>("[data-deck-card]")
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "gallery-deck",
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + 250}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const idx = Math.min(images.length - 1, Math.floor(p * images.length));
              if (counterRef.current) {
                counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
              }
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
              }
            },
          },
        });

        tl.to(track, { x: () => -distance(), duration: 1 });

        cards.forEach((card, i) => {
          if (i % 2 === 0) return;
          tl.fromTo(card, { yPercent: 4 }, { yPercent: -4, duration: 1 }, 0);
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [images.length]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden border-t border-ink/10 lg:h-[100svh] lg:py-0"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col justify-center px-5 pt-16 md:px-10 md:pt-24 lg:h-full lg:px-0 lg:pt-0">
          <p className="eyebrow mb-8 flex items-center gap-3 px-5 lg:hidden md:px-10">
            Gallery
            <span className="h-px flex-1 bg-ink/10" />
            <span className="font-mono text-[10px] text-muted">
              {String(images.length).padStart(2, "0")} views
            </span>
          </p>

          <div
            ref={trackRef}
            className="[-ms-overflow-style:none] [scrollbar-width:none] flex w-full snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden lg:snap-none lg:overflow-visible lg:pb-0 lg:w-max lg:pl-10"
          >
            {images.map((image, i) => (
              <figure
                key={image}
                data-deck-card
                onClick={() => openLightbox(i)}
                className="group relative aspect-[4/5] w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-ink/10 transition-all duration-500 hover:border-accent/30 cursor-pointer sm:w-[56vw] md:w-[42vw] lg:aspect-[3/4] lg:w-[34vw] lg:max-w-[520px]"
              >
                <Image
                  src={image}
                  alt={`${title} — gallery image ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 34vw, 78vw"
                  className="object-cover grayscale contrast-[1.15] brightness-[0.8] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md">
                    <ZoomIn className="h-5 w-5" />
                  </span>
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/80">
                    {title}
                  </span>
                  <span className="display text-4xl font-medium leading-none text-white/25 transition-colors duration-500 group-hover:text-accent md:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}

            <div className="flex aspect-[4/5] w-[78vw] shrink-0 snap-center items-center justify-center rounded-2xl border border-dashed border-ink/15 sm:w-[56vw] md:w-[42vw] lg:aspect-[3/4] lg:w-[34vw] lg:max-w-[520px] lg:mr-10">
              <p className="display max-w-[16ch] text-center text-2xl font-medium leading-tight tracking-tight text-ink/40 lg:text-3xl">
                Every pixel of {title}, up close.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-10">
            <span
              ref={counterRef}
              className="font-mono text-[11px] font-medium tracking-[0.3em] text-muted"
            >
              01 / {String(images.length).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-ink/10">
              <div
                ref={barRef}
                className="h-full w-full origin-left bg-accent"
                style={{ transform: "scaleX(0.04)" }}
              />
            </div>
            <span className="eyebrow text-ink/40">Scroll &rarr;</span>
          </div>
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          {/* Ambient glow behind image */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="h-[60vh] w-[60vh] rounded-full bg-accent/8 blur-[150px]" />
          </div>

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="lightbox-ui absolute right-5 top-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] md:right-8 md:top-8"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="lightbox-ui absolute left-5 top-5 z-[120] md:left-8 md:top-8">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-xs font-medium tracking-[0.2em] text-white/80">
                {String(lightboxIndex + 1).padStart(2, "0")}
                <span className="mx-1.5 text-white/30">/</span>
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Image + buttons container */}
          <div
            className="lightbox-image relative h-[85vh] w-[92vw] max-w-[1400px] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle border glow */}
            <div className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-b from-white/10 via-transparent to-white/5 z-[1]" aria-hidden="true" />

            {/* Image */}
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image
                src={images[lightboxIndex]}
                alt={`${title} — gallery image ${lightboxIndex + 1}`}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Prev button — inside image, left side */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="lightbox-ui absolute left-3 top-1/2 z-[10] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] hover:scale-110 sm:left-4 md:left-5 md:h-14 md:w-14"
              aria-label="Previous"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {/* Next button — inside image, right side */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="lightbox-ui absolute right-3 top-1/2 z-[10] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] hover:scale-110 sm:right-4 md:right-5 md:h-14 md:w-14"
              aria-label="Next"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Bottom bar */}
          <div className="lightbox-ui absolute bottom-0 inset-x-0 z-[120]">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 md:py-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                {title}
              </p>

              {/* Thumbnail dots */}
              <div className="flex items-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === lightboxIndex
                        ? "w-6 bg-accent"
                        : "w-1.5 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                <span className="hidden md:inline">Click image to close</span>
                <span className="md:hidden">Tap to close</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
