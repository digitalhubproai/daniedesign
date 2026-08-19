"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";
import SplitText from "@/components/animations/SplitText";

export default function FeaturedWork() {
  const recent = projects.slice(0, 6);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-16 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6">Recent Work — 2025 / 2026</p>
            <SplitText
              as="h2"
              text="Work that works."
              className="display text-5xl font-semibold leading-[0.98] tracking-tight md:text-6xl"
            />
          </div>
          <div className="flex items-center gap-6 md:pb-2">
            <span className="display text-6xl font-medium text-outline md:text-7xl">
              26
            </span>
            <span className="max-w-[10rem] text-xs leading-relaxed text-muted">
              Projects delivered for brands in four countries
            </span>
            <Link
              href="/work"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent"
            >
              View All Work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {recent.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              className="aspect-[4/3]"
              imgSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}