// "/work/[slug]" project case-study pages. Server components, statically
// prerendered at build time (one page per slug via generateStaticParams) and
// fully sourced from the static @/data/projects list — no API fetch.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import ImageReveal from "@/components/animations/ImageReveal";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Per-project SEO metadata derived from the project record; unknown slugs get a
// minimal fallback title (the page itself then triggers notFound() below).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  // params is a Promise in this Next version — await it before reading the slug.
  const { slug } = await params;
  const project = getProject(slug);
  // Unknown slug: render the app-level 404 (app/not-found.tsx).
  if (!project) notFound();

  // Circular "next project" link — wraps back to the first project after the last.
  const nextIndex = (projects.findIndex((p) => p.slug === slug) + 1) % projects.length;
  const nextProject = projects[nextIndex];

  return (
    <main>
      <section className="px-5 pb-16 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-[1440px]">
          <Link
            href="/work"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            All Work
          </Link>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="display max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-6xl">
              <SplitText text={project.title} as="span" className="block" />
            </h1>
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="eyebrow">Category</p>
                <p className="display mt-1 text-xl font-medium text-ink">{project.category}</p>
              </div>
              <div>
                <p className="eyebrow">Year</p>
                <p className="display mt-1 text-xl font-medium text-ink">{project.year}</p>
              </div>
              <div>
                <p className="eyebrow">Services</p>
                <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {project.services.map((service) => (
                    <li key={service} className="text-sm font-semibold text-ink/80">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {project.video ? (
            <div className="mt-14 overflow-hidden rounded-[1.25rem] border border-white/10 bg-black">
              <video
                src={project.video}
                controls
                playsInline
                poster={project.image}
                preload="metadata"
                className="h-[42vh] w-full object-cover md:h-[68vh]"
              />
            </div>
          ) : (
            <ImageReveal
              src={project.image}
              alt={`${project.title} — main visual`}
              className="mt-14 h-[42vh] w-full rounded-[1.25rem] md:h-[68vh]"
              imgClassName="photo-duo"
              sizes="100vw"
              priority
            />
          )}
        </div>
      </section>

      <section className="border-t border-ink/5 py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow">Project Detail</p>
          <p className="display mt-8 max-w-4xl text-2xl font-medium leading-[1.15] tracking-tight text-ink md:text-4xl">
            {project.description}
          </p>

          {project.features && project.features.length > 0 && (
            <div className="mt-16 border-t border-ink/5 pt-12">
              <p className="eyebrow">Key Features</p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.features.map((feature, i) => (
                  <TiltCard key={i} maxTilt={6} glowColor="rgba(255, 77, 31, 0.14)" className="h-full rounded-2xl">
                    <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-6 transition-colors duration-300 hover:border-accent/30">
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[10px] font-bold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-ink/80">
                        {feature}
                      </p>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-16 border-t border-ink/5 pt-12">
              <p className="eyebrow">Technologies Used</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-ink/10 bg-panel px-4 py-2 font-mono text-xs font-medium text-ink/80 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow mb-10">Gallery</p>
          <div className="flex flex-col gap-6">
            {project.gallery.map((image, i) => (
              <ImageReveal
                key={image}
                src={image}
                alt={`${project.title} — gallery image ${i + 1}`}
                className={`h-[42vh] w-full rounded-[1.25rem] ${i % 2 === 0 ? "md:h-[60vh]" : "md:h-[46vh] md:ml-auto md:w-4/5"}`}
                imgClassName="photo-duo"
                sizes="100vw"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/5 py-16 md:py-24">
        <Link
          href={`/work/${nextProject.slug}`}
          data-cursor="VIEW"
          className="group mx-auto block max-w-3xl px-5 md:px-10"
        >
          <p className="eyebrow mb-6 flex items-center gap-3">
            Next Project
            <span className="h-px flex-1 bg-ink/10" />
          </p>

          <TiltCard maxTilt={4} glowColor="rgba(255, 77, 31, 0.16)" className="rounded-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-panel">
              <ImageReveal
                src={nextProject.image}
                alt={`${nextProject.title} — next project`}
                className="relative h-56 w-full md:h-72"
                imgClassName="photo-duo transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 md:p-7">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {nextProject.category} · {nextProject.year}
                  </span>
                  <span className="display mt-1.5 block truncate text-xl font-medium tracking-tight text-white sm:text-2xl">
                    {nextProject.title}
                  </span>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-paper transition-all duration-300 group-hover:rotate-45 group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </TiltCard>
        </Link>
      </section>
    </main>
  );
}