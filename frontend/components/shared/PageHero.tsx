"use client";

import { motion } from "framer-motion";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  meta?: { label: string; value: string }[];
  children?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, intro, meta, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-48">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="eyebrow mb-8"
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="display max-w-6xl text-[10vw] font-medium leading-[1] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5vw]"
      >
        {title}
      </motion.h1>

      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          {intro}
        </motion.p>
      )}

      {meta && (
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-ink/10 pt-8"
        >
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="eyebrow">{item.label}</dt>
              <dd className="display mt-1.5 text-3xl font-medium text-ink">{item.value}</dd>
            </div>
          ))}
        </motion.dl>
      )}

      {children}
    </section>
  );
}