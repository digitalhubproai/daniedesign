"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { stats, impactStory } from "@/data/stats";
import Counter from "@/components/animations/Counter";
import SplitText from "@/components/animations/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const impactItems = [
  {
    number: "01",
    label: "Foundation & Experience",
    value: stats[1].value, // 10
    suffix: stats[1].suffix, // +
    metricLabel: "Years of Craft",
    title: "A decade of obsessive design & engineering.",
    description:
      "What began as a focused creative studio in 2015 has evolved into an international agency delivering transformative branding, UI/UX, and high-performance digital products.",
    tag: "Est. 2015",
  },
  {
    number: "02",
    label: "Global Reach & Scale",
    value: stats[0].value, // 1000
    suffix: stats[0].suffix, // +
    metricLabel: "Projects Shipped",
    title: "Shipped across 24 countries worldwide.",
    description:
      "From high-growth venture startups in Silicon Valley to established European brands, we build scalable software and visual identities that dominate their categories.",
    tag: "24+ Countries",
  },
  {
    number: "03",
    label: "Partnership & Loyalty",
    value: stats[2].value, // 98
    suffix: stats[2].suffix, // %
    metricLabel: "Client Retention Rate",
    title: "Long-term retainers built on proven ROI.",
    description:
      "We measure true success in repeat partnerships and continuous growth. Transparent communication, sprint reliability, and proactive problem-solving keep 98% of clients with us.",
    tag: "5-Star Rating",
  },
  {
    number: "04",
    label: "Engineering & Speed",
    value: stats[3].value, // 500
    suffix: stats[3].suffix, // +
    metricLabel: "Websites & Applications",
    title: "Pixel-perfect builds with zero performance lag.",
    description:
      "Custom Next.js platforms, Webflow systems, and enterprise portals engineered with strict performance budgets, fluid 60fps micro-animations, and converting user journeys.",
    tag: "60fps Optimized",
  },
];

export default function ImpactStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".impact-editorial-row",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="relative border-y border-ink/10 bg-[#0e0e0e] text-ink py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Main Grid: Sticky Left Editorial + Right Impact Rows */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Sticky Title & Statement */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4 flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                <span>Impact — Measured</span>
              </p>

              <SplitText
                as="h2"
                text="Numbers that define a decade of craft."
                className="display max-w-md text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
              />

              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/70 md:text-base">
                We believe exceptional design and robust engineering should produce measurable business outcomes. Here is what a decade of relentless execution looks like.
              </p>

              <div className="mt-10 hidden border-t border-ink/10 pt-6 lg:block">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      Senior In-House Squad
                    </p>
                    <p className="font-mono text-xs text-ink/50">
                      25+ dedicated specialists across design &amp; code
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Impact Rows */}
          <div className="flex flex-col lg:col-span-7">
            {impactItems.map((item, idx) => {
              const isActive = activeRow === idx;
              return (
                <div
                  key={item.number}
                  onMouseEnter={() => setActiveRow(idx)}
                  onMouseLeave={() => setActiveRow(null)}
                  className="impact-editorial-row group relative border-t border-ink/15 py-10 transition-all duration-500 first:border-t-0 md:py-12"
                >
                  {/* Subtle hover background highlight */}
                  <div className="pointer-events-none absolute -inset-x-4 inset-y-0 rounded-2xl bg-card/0 transition-colors duration-300 group-hover:bg-card/40 md:-inset-x-6" />

                  <div className="relative z-10">
                    {/* Top Row: Index & Category & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-accent">
                          {item.number}
                        </span>
                        <span className="text-ink/20">/</span>
                        <span className="font-mono text-xs uppercase tracking-wider text-ink/60">
                          {item.label}
                        </span>
                      </div>

                      <span className="rounded-full border border-ink/15 bg-paper/60 px-3 py-1 font-mono text-[10px] text-ink/80 transition-colors group-hover:border-accent/40 group-hover:text-accent">
                        {item.tag}
                      </span>
                    </div>

                    {/* Middle: Big Metric Value & Title */}
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <Counter
                          value={item.value}
                          suffix={item.suffix}
                          className="display block text-5xl font-extrabold tracking-tight text-ink md:text-6xl"
                        />
                        <span className="mt-1 block font-mono text-xs font-medium uppercase tracking-wider text-accent">
                          {item.metricLabel}
                        </span>
                      </div>
                    </div>

                    <h3 className="display mt-5 text-xl font-semibold text-ink transition-colors group-hover:text-accent md:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Bottom Final Row / CTA */}
            <div className="impact-editorial-row group relative mt-4 border-t border-accent/40 pt-10 md:pt-12">
              <Link
                href="/contact"
                data-cursor="OPEN"
                className="flex flex-col justify-between gap-6 rounded-2xl border border-ink/10 bg-card/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:shadow-[0_20px_50px_-15px_rgba(255,77,31,0.25)] sm:flex-row sm:items-center sm:p-10"
              >
                <div>
                  <span className="eyebrow text-accent">Next Step</span>
                  <h3 className="display mt-2 text-2xl font-bold text-ink transition-colors group-hover:text-accent md:text-3xl">
                    Your project could be next.
                  </h3>
                  <p className="mt-1 text-xs text-ink/60 md:text-sm">
                    Let&apos;s engineer something unforgettable together.
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0e0e0e] transition-transform duration-300 group-hover:scale-105">
                  Start the conversation
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}