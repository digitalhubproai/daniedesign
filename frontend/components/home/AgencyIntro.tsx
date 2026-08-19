"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SplitText from "@/components/animations/SplitText";

const corePillars = [
  "Brand Design",
  "Web Development",
  "Brand Identity",
  "App Development",
  "UI UX Design",
];

export default function AgencyIntro() {
  return (
    <section id="agency-intro" className="relative border-b border-ink/10 bg-[#0e0e0e] text-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        
        {/* Left Column: Authentic Story & Mission */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="eyebrow mb-4 flex items-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Since 2015 — About Danie Design</span>
          </p>

          <SplitText
            as="h2"
            text="Crafting digital products with a unique vision to elevate the user experience."
            className="display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
          />

          <p className="mt-6 text-sm leading-relaxed text-ink/70 md:text-base">
            Danie Design is a creative studio dedicated to exploring ideas and transforming them into
            beautifully crafted digital experiences. We provide a seamless space to showcase, refine, and
            bring your digital vision to life. Our mission is to make design intuitive, inspiring, and impactful
            for every user.
          </p>

          <p className="mt-3 text-xs leading-relaxed text-ink/55 md:text-sm">
            As a global creative studio, we know the value of staying ahead. That&apos;s why we collaborate with
            top talent from around the world to bring fresh, innovative ideas and flawless engineering to every project.
          </p>

          {/* Core Discipline Badges */}
          <div className="mt-8 flex flex-wrap gap-2">
            {corePillars.map((pillar) => (
              <span
                key={pillar}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs font-semibold text-ink/80 transition-colors hover:border-accent/40 hover:text-accent"
              >
                {pillar}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/agency"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0e0e0e] transition-transform duration-300 hover:scale-105"
            >
              Explore Full Studio Story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 font-mono text-xs font-semibold text-ink/80 transition-colors hover:border-white/30 hover:text-white"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Right Column: Studio Showcase & Verified Stats */}
        <div className="flex flex-col justify-center gap-6 lg:col-span-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-card md:aspect-[4/3]">
            <Image
              src="https://daniedesign.com/wp-content/uploads/2026/01/charlesdeluvio-Lks7vei-eAg-unsplash-1-scaled.jpg"
              alt="Danie Design Creative Studio"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/85 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                Collaborate with a Mad-Talented Team
              </span>
              <p className="mt-1 font-display text-base font-bold text-white">
                Building enduring partnerships extending well beyond the deliverable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#121214] p-5">
              <p className="display text-3xl font-bold text-accent md:text-4xl">900+</p>
              <p className="mt-1 font-mono text-xs font-semibold text-ink">
                Clients Worldwide
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink/50">
                Thousands plus 5-star reviews on PeoplePerHour &amp; global platforms.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#121214] p-5">
              <p className="display text-3xl font-bold text-accent md:text-4xl">1,000+</p>
              <p className="mt-1 font-mono text-xs font-semibold text-ink">
                Completed Projects
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink/50">
                98% client satisfaction rate across branding, UI/UX, and apps.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}