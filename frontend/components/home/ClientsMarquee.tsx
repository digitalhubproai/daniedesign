"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { clients } from "@/data/clients";

/**
 * Client logo/name strip: an infinitely scrolling marquee of brand
 * names rendered between two hairline borders.
 */
export default function ClientsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Respect OS reduced-motion preference: leave the strip static
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Slide the track left by 50% of its width and loop — because the
    // client row is rendered twice, this reads as a seamless marquee
    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, []);

  // One copy of the client row; rendered twice below to enable the -50% loop
  const row = (
    <div className="flex shrink-0 items-center">
      {clients.map((client) => (
        <div key={client} className="flex shrink-0 items-center gap-8 px-8 md:gap-12 md:px-12">
          <span className="display text-2xl font-medium italic text-ink/50 transition-colors hover:text-ink md:text-3xl">
            {client}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="border-y border-ink/10 bg-panel/60 py-6 md:py-8">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow mb-6 text-center">
          Trusted by brands that ship — big and small
        </p>
        <div className="overflow-hidden" aria-hidden="true">
          <div ref={trackRef} className="flex w-max items-center">
            {row}
            {row}
          </div>
        </div>
      </div>
    </section>
  );
}