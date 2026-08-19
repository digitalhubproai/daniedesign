import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SplitText from "@/components/animations/SplitText";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Branding, UI/UX design, website development and digital marketing — four connected services from one creative digital agency.",
};

const process = [
  "Discovery",
  "Strategy",
  "Design",
  "Development",
  "Launch",
  "Growth",
];

export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Everything a growing brand needs, under one roof."
        intro="Four service groups, one connected process. Whether you need a new identity, a product redesign, a high-performance website or a growth program — it all works together."
      />

      <section className="pb-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-5 md:grid-cols-2 md:px-10 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.number}
              href={service.href}
              data-cursor="OPEN"
              className="group relative h-[420px] overflow-hidden rounded-3xl border border-ink/10 md:h-[520px]"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="photo-duo object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/90 via-paper/20 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 md:p-8">
                <span className="eyebrow">
                  {service.number} — {service.tagline}
                </span>
                <ArrowUpRight className="h-6 w-6 text-ink transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h2 className="display text-4xl font-medium leading-[1.02] tracking-tight text-ink md:text-5xl">
                  {service.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                  Explore {service.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow mb-6">How It Works</p>
          <SplitText
            as="h2"
            text="One process, from first conversation to launch."
            className="display mb-14 max-w-3xl text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
          />
          <ol className="flex flex-col">
            {process.map((step, i) => (
              <li
                key={step}
                className="flex items-baseline justify-between gap-6 border-t border-ink/10 py-6 last:border-b"
              >
                <span className="display text-2xl font-extrabold text-outline md:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-semibold text-ink md:text-2xl">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}