"use client";

import { motion } from "framer-motion";
import {
  Search,
  Workflow,
  FlaskConical,
  LayoutGrid,
  MousePointerClick,
  PenTool,
  Layers,
  Palette,
  Component,
  Smartphone,
  Code2,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";

type CapabilitiesProps = {
  title: string;
  items: string[];
};

const cellIcons = [
  Search,
  Workflow,
  FlaskConical,
  LayoutGrid,
  MousePointerClick,
  PenTool,
  Layers,
  Palette,
  Component,
  Smartphone,
  Code2,
  Megaphone,
];

export default function Capabilities({ title, items }: CapabilitiesProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <p className="eyebrow mb-6">Capabilities</p>
      <SplitText
        as="h2"
        mode="chars"
        text={title}
        className="display mb-10 text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
      />
      <motion.ul
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {items.map((item, i) => {
          const Icon = cellIcons[i % cellIcons.length];
          return (
            <motion.li
              key={item}
              variants={{
                hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <TiltCard
                className="rounded-2xl"
                maxTilt={12}
                glowColor="rgba(255, 77, 31, 0.2)"
              >
                <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-panel p-6 transition-colors duration-300 hover:border-accent/40 hover:bg-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-[#0e0e0e] text-accent shadow-[0_0_20px_rgba(255,77,31,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-[#0e0e0e] group-hover:shadow-[0_0_28px_rgba(255,77,31,0.5)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-accent/70 transition-colors duration-300 group-hover:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block text-base font-semibold text-ink transition-colors duration-300 group-hover:text-white">
                      {item}
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
                  <span
                    className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </TiltCard>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}