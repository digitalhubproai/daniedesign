"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { clients } from "@/data/clients";

export default function ClientsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 32,
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, []);

  const row = (
    <>
      {clients.map((client) => (
        <span
          key={client}
          className="display flex shrink-0 items-center gap-10 px-10 text-2xl font-medium italic text-ink/45 md:text-3xl"
        >
          {client}
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <section className="border-y border-ink/10 bg-panel/60">
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10">
        <p className="eyebrow mb-6 text-center">
          Trusted by brands that ship — big and small
        </p>
        <div className="overflow-hidden" aria-hidden="true">
          <div ref={trackRef} className="flex w-max">
            {row}
            {row}
          </div>
        </div>
      </div>
    </section>
  );
}