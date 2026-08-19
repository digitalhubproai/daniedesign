"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { services, type Service } from "@/data/services";
import { gsap } from "@/lib/gsap";

type Slide = { type: "service"; service: Service } | { type: "cta" };

const slides: Slide[] = [
  ...services.map((service): Slide => ({ type: "service", service })),
  { type: "cta" },
];

const slideCount = slides.length;

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ServiceCard({
  service,
  cardRef,
}: {
  service: Service;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const accent = service.accent;
  const accentFaint = hexToRgba(accent, 0.45);
  const accentSoft = hexToRgba(accent, 0.12);
  const accentGlow = hexToRgba(accent, 0.22);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const img = imgRef.current;
    if (!root || !content || !img) return;

    const handleMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      content.style.transform = `rotateY(${px * 4}deg) rotateX(${-py * 4}deg) translateY(-6px)`;
      img.style.transform = `translate(${-px * 26}px, ${-py * 18}px) scale(1.16)`;
    };

    const handleLeave = () => {
      content.style.transform = "";
      img.style.transform = "";
    };

    root.addEventListener("mousemove", handleMove);
    root.addEventListener("mouseleave", handleLeave);
    return () => {
      root.removeEventListener("mousemove", handleMove);
      root.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        cardRef?.(el);
      }}
      className="group relative h-full w-full min-h-[460px] overflow-hidden rounded-[2.25rem] border border-ink/10 bg-gradient-to-br from-[#181818] via-[#141414] to-[#0f0f0f] transition-all duration-500 hover:border-[var(--accent-border)] hover:shadow-[0_40px_90px_-30px_var(--accent-shadow)] [perspective:1400px] lg:min-h-0"
      style={
        {
          "--accent": accent,
          "--accent-border": accentFaint,
          "--accent-shadow": accentGlow,
          "--accent-soft": accentSoft,
        } as React.CSSProperties
      }
    >
      {/* Subtle top ambient accent glow */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
        style={{ background: accent }}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative grid h-full w-full grid-cols-1 will-change-transform md:grid-cols-12"
      >
        <div className="relative z-10 flex h-full flex-col justify-between p-7 md:col-span-7 md:p-9 xl:p-10">
          <div className="flex items-center justify-between">
            <span className="eyebrow flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              <span className="font-mono font-bold text-[var(--accent)]">
                {service.number}
              </span>
              <span className="text-ink/30">—</span>
              <span className="text-ink/80">{service.title}</span>
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-4">
            <h3 className="display text-3xl font-bold leading-[1.02] tracking-tight lg:text-4xl xl:text-[2.6rem]">
              {service.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-[var(--accent)] opacity-90">
              {service.tagline}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted xl:text-base">
              {service.description}
            </p>
            <ul className="mt-6 flex max-w-md flex-wrap gap-2">
              {service.capabilities.map((cap, ci) => (
                <li
                  key={cap}
                  className="rounded-full border border-ink/10 bg-ink/[0.04] px-3.5 py-1.5 text-[11.5px] font-medium text-ink/80 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-ink"
                  style={
                    ci === 0
                      ? {
                          borderColor: accentFaint,
                          color: accent,
                          background: accentSoft,
                        }
                      : undefined
                  }
                >
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 font-mono text-[11px] text-muted/60">
            ✦ Bespoke Deliverable • In-House Craft
          </div>
        </div>

        <div className="pointer-events-none relative min-h-[260px] overflow-hidden md:absolute md:inset-y-0 md:right-0 md:z-20 md:w-[45%] md:rounded-l-[2.25rem] md:transition-all md:duration-700 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:w-full md:group-hover:rounded-l-none md:group-hover:shadow-[-60px_0_80px_-30px_rgba(0,0,0,0.75)]">
          <Image
            ref={imgRef}
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
          />
          {/* Subtle soft gradient overlay only on hover to keep full color vibrant */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-60"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              href={service.href}
              data-cursor="OPEN"
              className="group/link pointer-events-auto flex items-center gap-3 rounded-full border border-white/20 bg-black/75 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0e0e0e] hover:shadow-[0_0_30px_var(--accent-shadow)] lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
            >
              Explore {service.title}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
            </Link>
          </div>
        </div>
      </div>

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-out group-hover:scale-x-100"
        aria-hidden="true"
      />
    </div>
  );
}

function CTACard({
  cardRef,
}: {
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={cardRef} className="h-full w-full">
      <Link
        href="/services"
        data-cursor="OPEN"
        className="group relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-[2.25rem] border border-ink/10 bg-gradient-to-br from-[#181818] via-[#141414] to-[#0f0f0f] p-8 text-center transition-all duration-500 hover:border-[#ff4d1f]/60 hover:shadow-[0_40px_90px_-30px_rgba(255,77,31,0.3)]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 35%, rgba(255,77,31,0.18), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <span className="eyebrow relative flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ff4d1f] shadow-[0_0_8px_#ff4d1f]" />
          <span>One team, four disciplines</span>
        </span>
        <h3 className="display relative text-4xl font-bold leading-[1.02] tracking-tight lg:text-4xl xl:text-5xl">
          Explore
          <br />
          All Services
        </h3>
        <p className="relative max-w-sm text-sm leading-relaxed text-muted xl:text-base">
          Branding, UI/UX, development and marketing — everything your brand
          needs to scale to the next level.
        </p>
        <span className="relative mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4d1f] text-[#0e0e0e] shadow-[0_0_30px_rgba(255,77,31,0.35)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-45">
          <ArrowUpRight className="h-6 w-6" />
        </span>
      </Link>
    </div>
  );
}

export default function StackedScrollCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const stRef = useRef<gsap.plugins.ScrollTriggerInstance | null>(null);
  const currentRef = useRef(0);

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const clamped = Math.max(0, Math.min(slideCount - 1, i));
    const start = typeof st.start === "number" ? st.start : 0;
    const end = typeof st.end === "number" ? st.end : start;
    const target = start + (clamped / (slideCount - 1)) * (end - start);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const getDistance = () => {
          const last = cardEls[cardEls.length - 1];
          if (!last) return 0;
          const cardCenter = last.offsetLeft + last.offsetWidth / 2;
          return Math.max(0, cardCenter - window.innerWidth / 2);
        };

        const cardEls = cardsRef.current.filter(
          (el): el is HTMLElement => el !== null
        );

        const opTos = cardEls.map((el) =>
          gsap.quickTo(el, "opacity", { duration: 0.45, ease: "power2.out" })
        );
        const scTos = cardEls.map((el) =>
          gsap.quickTo(el, "scale", { duration: 0.45, ease: "power2.out" })
        );

        cardEls.forEach((el, i) => {
          gsap.set(el, {
            opacity: i === 0 ? 1 : 0.4,
            scale: i === 0 ? 1 : 0.94,
            transformOrigin: "center",
          });
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "services-deck",
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance() + 400}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              stRef.current = self;
              const p = self.progress;
              const idx = Math.min(slideCount - 1, Math.floor(p * slideCount));
              currentRef.current = idx;

              const slide = slides[idx];
              const label = slide.type === "service" ? slide.service.title : "Explore Services";
              const color =
                slide.type === "service" ? slide.service.accent : "#ff4d1f";

              if (counterRef.current) {
                counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(slideCount).padStart(2, "0")}`;
              }
              if (labelRef.current) {
                labelRef.current.textContent = label;
                labelRef.current.style.color = color;
              }
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${p})`;
                progressRef.current.style.background = color;
              }
              if (prevRef.current) {
                prevRef.current.style.opacity = idx === 0 ? "0.25" : "1";
              }
              if (nextRef.current) {
                nextRef.current.style.opacity = idx === slideCount - 1 ? "0.25" : "1";
              }

              const vw = window.innerWidth;
              cardEls.forEach((el, i) => {
                if (!opTos[i] || !scTos[i]) return;
                const rect = el.getBoundingClientRect();
                const dist =
                  Math.abs(rect.left + rect.width / 2 - vw / 2) / (vw / 2);
                const w = gsap.utils.clamp(0, 1, 1 - dist);
                opTos[i](0.4 + 0.6 * w);
                scTos[i](0.94 + 0.06 * w);
              });
            },
          },
        });

        tl.to(track, { x: () => -getDistance(), duration: 1 });

        gsap.fromTo(
          cardEls,
          { xPercent: 8, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2,
            overwrite: "auto",
          }
        );
      }, section);

      return () => ctx.revert();
    });

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: reduce)",
      () => {
        const ctx = gsap.context(() => {
          gsap.set(section, { overflowX: "auto" });
        }, section);
        return () => ctx.revert();
      }
    );

    return () => {
      stRef.current?.kill(true);
      mm.revert();
    };
  }, []);

  return (
    <>
      <div className="relative hidden lg:block">
        <section
          ref={sectionRef}
          className="relative h-screen overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex h-full w-max items-center gap-7 px-10 xl:gap-10"
          >
            {slides.map((slide, i) => (
              <div
                key={slide.type === "service" ? slide.service.number : `cta-${i}`}
                className="h-full w-[92vw] shrink-0 lg:h-[64vh] lg:w-[62vw] xl:h-[66vh] xl:w-[58vw]"
              >
                {slide.type === "service" ? (
                  <ServiceCard
                    service={slide.service}
                    cardRef={(el) => {
                      if (el) cardsRef.current[i] = el;
                    }}
                  />
                ) : (
                  <CTACard
                    cardRef={(el) => {
                      if (el) cardsRef.current[i] = el;
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-8 z-10 hidden items-end justify-between px-10 lg:flex">
            <button
              ref={prevRef}
              onClick={() => goTo(currentRef.current - 1)}
              aria-label="Previous service"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 hover:border-[#ff4d1f] hover:bg-[#ff4d1f] hover:text-[#0e0e0e]"
              style={{ opacity: 0.25 }}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <span
                  ref={counterRef}
                  className="font-mono text-[11px] font-medium tracking-[0.35em] text-muted"
                  aria-hidden="true"
                >
                  01 / {String(slideCount).padStart(2, "0")}
                </span>
                <span
                  ref={labelRef}
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.35em]"
                >
                  {services[0].title}
                </span>
              </div>
              <div className="h-px w-64 overflow-hidden bg-ink/10">
                <div
                  ref={progressRef}
                  className="h-full w-full origin-left"
                  style={{ background: services[0].accent }}
                />
              </div>
            </div>

            <button
              ref={nextRef}
              onClick={() => goTo(currentRef.current + 1)}
              aria-label="Next service"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 hover:border-[#ff4d1f] hover:bg-[#ff4d1f] hover:text-[#0e0e0e]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-8 px-5 py-10 md:px-10 lg:hidden">
        {services.map((service) => (
          <ServiceCard key={service.number} service={service} />
        ))}
        <CTACard />
      </div>
    </>
  );
}