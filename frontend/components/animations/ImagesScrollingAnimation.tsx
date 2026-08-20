"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import TiltCard from "@/components/animations/TiltCard";

const StickyCard_001 = ({
  i,
  title,
  category,
  year,
  src,
  slug,
  progress,
  range,
  targetScale,
}: {
  i: number;
  title: string;
  category: string;
  year: string;
  src: string;
  slug: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-4vh + ${i * 15 + 220}px)`,
        }}
        className="relative origin-top
                   h-[300px] w-[min(400px,88vw)]
                   sm:h-[360px] sm:w-[520px]
                   md:h-[430px] md:w-[640px]
                   lg:h-[500px] lg:w-[820px]"
      >
        <TiltCard
          maxTilt={6}
          glowColor="rgba(255, 77, 31, 0.22)"
          className="h-full w-full rounded-[1.5rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] sm:rounded-[2rem]"
        >
          <Link
            href={`/work/${slug}`}
            data-cursor="VIEW"
            aria-label={`${title} — ${category}, ${year}`}
            className="group relative block h-full w-full overflow-hidden rounded-[1.5rem] border border-ink/10 bg-card sm:rounded-[2rem]"
          >
            <Image
              src={src}
              alt={title}
              fill
              sizes="(min-width: 1024px) 640px, (min-width: 768px) 520px, 320px"
              className="photo-duo object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
            />
            <div
              className="photo-duo-overlay absolute inset-0 transition-opacity duration-700 group-hover:opacity-40"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper/95 via-paper/30 to-transparent p-5 sm:p-7"
              aria-hidden="true"
            >
              <p className="eyebrow mb-2">
                {category} — {year}
              </p>
              <h3 className="display text-2xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-3xl">
                {title}
              </h3>
            </div>
            <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-paper/50 text-ink backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e] sm:right-5 sm:top-5">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </TiltCard>
      </motion.div>
    </div>
  );
};

const ImagesScrollingAnimation = () => {
  const container = useRef<HTMLDivElement>(null);
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main
      ref={container}
      className="relative flex w-full flex-col items-center justify-center pb-[60vh] pt-[2vh] sm:pb-[70vh] sm:pt-[3vh] lg:pb-[80vh] lg:pt-[4vh]"
    >
      {featured.map((project, i) => {
        const targetScale = Math.max(0.6, 1 - (featured.length - i - 1) * 0.08);
        return (
          <StickyCard_001
            key={`p_${project.slug}`}
            i={i}
            title={project.title}
            category={project.category}
            year={project.year}
            src={project.image}
            slug={project.slug}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </main>
  );
};

export { ImagesScrollingAnimation, StickyCard_001 };