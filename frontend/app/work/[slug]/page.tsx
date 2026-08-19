import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import ImageReveal from "@/components/animations/ImageReveal";
import SplitText from "@/components/animations/SplitText";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

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
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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

          <ImageReveal
            src={project.image}
            alt={`${project.title} — main visual`}
            className="mt-14 h-[42vh] w-full rounded-[1.25rem] md:h-[68vh]"
            imgClassName="photo-duo"
            sizes="100vw"
            priority
          />
        </div>
      </section>

      <section className="border-t border-ink/5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-4">
            <p className="eyebrow">Overview</p>
            <p className="display mt-4 text-2xl font-medium leading-[1.1] tracking-tight text-ink md:text-3xl">
              {project.description}
            </p>
          </div>
          <div className="flex flex-col gap-12 md:col-span-7 md:col-start-6">
            <div>
              <h2 className="display text-xl font-medium italic text-accent md:text-2xl">The Challenge</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{project.challenge}</p>
            </div>
            <div>
              <h2 className="display text-xl font-medium italic text-accent md:text-2xl">Our Approach</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{project.approach}</p>
            </div>
            <div>
              <h2 className="display text-xl font-medium italic text-accent md:text-2xl">The Design</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{project.design}</p>
            </div>
            <div>
              <h2 className="display text-xl font-medium italic text-accent md:text-2xl">Development</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{project.development}</p>
            </div>
            <div>
              <h2 className="display text-xl font-medium italic text-accent md:text-2xl">The Outcome</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/80">{project.outcome}</p>
            </div>
          </div>
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

      <section className="border-t border-ink/5">
        <Link
          href={`/work/${nextProject.slug}`}
          data-cursor="VIEW"
          className="group mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 py-24 text-center md:px-10 md:py-32"
        >
          <span className="eyebrow">Next Project</span>
          <span className="display text-4xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent sm:text-5xl md:text-7xl">
            {nextProject.title}
          </span>
          <ArrowUpRight className="h-8 w-8 text-accent transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
        </Link>
      </section>
    </main>
  );
}