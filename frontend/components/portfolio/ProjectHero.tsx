"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoveDown } from "lucide-react";
import SplitText from "@/components/animations/SplitText";

type ProjectHeroProps = {
  image: string;
  video?: string;
  title: string;
  category: string;
  year: string;
  description: string;
  services: string[];
};

export default function ProjectHero({
  image,
  video,
  title,
  category,
  year,
  description,
  services,
}: ProjectHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* Parallax backdrop */}
      <motion.div
        style={{ y: bgY, scale }}
        className="absolute -top-[10%] left-0 h-[120%] w-full"
      >
        {video ? (
          <video
            src={video}
            poster={image}
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover blur-sm scale-110"
          />
        ) : (
          <motion.div
            initial={{ scale: 1.18 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full"
          >
            <Image
              src={image}
              alt={`${title} — main visual`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_30%] blur-sm"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Heavy dark scrim for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" aria-hidden="true" />

      {/* Title block */}
      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-10 md:pb-28"
      >
        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-2.5 md:mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#0e0e0e]">
            {category} — {year}
          </span>
        </motion.div>

        {/* Heading — big, bold, high contrast */}
        <h1 className="display max-w-5xl text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <SplitText text={title} as="span" className="block" delay={0.35} />
        </h1>

        {/* Description — bright, readable */}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 drop-shadow-md md:mt-8 md:text-lg">
          {description}
        </p>

        {/* Service pills — accent colored */}
        {services.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2.5 md:mt-8">
            {services.map((service, i) => (
              <motion.span
                key={service}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-full border border-accent/40 bg-accent/15 px-5 py-2 text-xs font-semibold text-accent backdrop-blur-sm md:text-sm"
              >
                {service}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-8 right-8 z-10 hidden items-center gap-3 md:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/60 backdrop-blur-md"
        >
          <MoveDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}
