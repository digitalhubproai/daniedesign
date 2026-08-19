"use client";

import { projects } from "@/data/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";
import SplitText from "@/components/animations/SplitText";

type RelatedWorkProps = {
  category: string;
  title?: string;
};

export default function RelatedWork({ category, title = "Related Work" }: RelatedWorkProps) {
  const related = projects.filter((p) => p.category === category).slice(0, 3);
  if (!related.length) return null;

  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <p className="eyebrow mb-6">Portfolio</p>
      <SplitText
        as="h2"
        text={title}
        className="display mb-10 text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {related.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            className="h-[320px]"
            imgSizes="(min-width: 1024px) 33vw, 100vw"
          />
        ))}
      </div>
    </div>
  );
}