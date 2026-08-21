"use client";

import { motion } from "framer-motion";
import ImageReveal from "@/components/animations/ImageReveal";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";

type SplitBlockProps = {
  eyebrow: string;
  title: string;
  copy: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  bullets?: string[];
};

export default function SplitBlock({
  eyebrow,
  title,
  copy,
  image,
  imageAlt,
  reverse = false,
  bullets,
}: SplitBlockProps) {
  return (
    <div
      className={`mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6"
        >
          {eyebrow}
        </motion.p>
        <SplitText
          as="h2"
          mode="chars"
          text={title}
          className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
        />
        <div className="mt-6 flex flex-col gap-4">
          {copy.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-lg text-sm leading-relaxed text-muted md:text-base"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        {bullets && (
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3"
          >
            {bullets.map((bullet, i) => (
              <motion.li
                key={bullet}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3 text-sm font-medium text-ink/80"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {bullet}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
      <TiltCard
        className="rounded-[1.25rem]"
        maxTilt={10}
        glowColor="rgba(255, 77, 31, 0.22)"
        shadow={false}
      >
        <ImageReveal
          src={image}
          alt={imageAlt}
          className="relative h-[280px] rounded-[1.25rem] md:h-[400px]"
          imgClassName="photo-duo"
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      </TiltCard>
    </div>
  );
}