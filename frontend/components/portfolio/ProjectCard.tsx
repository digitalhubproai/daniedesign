"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ImageReveal from "@/components/animations/ImageReveal";
import TiltCard from "@/components/animations/TiltCard";

type ProjectCardProps = {
  project: Project;
  className?: string;
  imgSizes?: string;
};

export default function ProjectCard({ project, className, imgSizes }: ProjectCardProps) {
  return (
    <TiltCard
      className={className}
      maxTilt={8}
      clip={false}
      glowColor="rgba(255, 77, 31, 0.22)"
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor="VIEW"
        className="group relative block h-full w-full overflow-hidden rounded-2xl"
        aria-label={`${project.title} — ${project.category}, ${project.year}`}
      >
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <ImageReveal
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          imgClassName="grayscale contrast-[1.15] brightness-[0.82] transition-[filter] duration-700 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
          sizes={imgSizes ?? "(min-width: 1024px) 50vw, 100vw"}
        />
        <div
          className="photo-duo-overlay absolute inset-0 transition-opacity duration-700 group-hover:opacity-40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper/90 via-paper/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
          <div>
            <p className="eyebrow">
              {project.category} — {project.year}
            </p>
            <h3 className="display mt-2 text-2xl font-medium leading-tight tracking-tight text-ink md:text-3xl">
              {project.title}
            </h3>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/25 bg-paper/40 text-ink backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e]">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
      </Link>
    </TiltCard>
  );
}