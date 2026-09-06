"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";
import { Minus, Plus, Search } from "lucide-react";

export type FaqItem = {
  category: string;
  question: string;
  answer: string;
  popular?: boolean;
};

type FaqListProps = {
  items: FaqItem[];
  categories: string[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/*
  Motion system for the accordion:
  - Opening uses a heavy spring (slow attack, soft settle) so the card feels
    like it has mass.
  - Closing uses a quick ease-in curve — collapsing should never feel sluggish.
  - Content children unmask top-to-bottom via the parent's overflow clip, so
    their own motion is only a subtle rise — no squish, no fold.
*/

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

const springGentle: Transition = {
  type: "spring",
  stiffness: 210,
  damping: 26,
  mass: 0.9,
};

const answerVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 1,
    transition: {
      height: { type: "spring", stiffness: 420, damping: 36, mass: 0.7 },
      opacity: { duration: 0.12 },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: springGentle,
      delayChildren: 0.08,
      staggerChildren: 0.07,
    },
  },
};

const revealVariants: Variants = {
  collapsed: { opacity: 0, y: 14, transition: { duration: 0.12, ease: EASE_IN_OUT } },
  expanded: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

const railVariants: Variants = {
  collapsed: { scaleY: 0, opacity: 0, transition: { duration: 0.18, ease: EASE_IN_OUT } },
  expanded: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.65, ease: EASE_OUT_EXPO },
  },
};

const glowVariants: Variants = {
  collapsed: { opacity: 0, transition: { duration: 0.25 } },
  expanded: {
    opacity: 1,
    transition: { type: "spring", stiffness: 90, damping: 18, delay: 0.1 },
  },
};

const iconSpring: Transition = { type: "spring", stiffness: 420, damping: 26, mass: 0.6 };

/*
  Light-sweep (shine) across the card — fires on BOTH transitions:
  - opening: streak travels left → right, riding just behind the reveal
  - closing: streak travels right → left, a touch faster
  The end position of each state is the start position of the other, so the
  element rests off-screen between sweeps with no jump.
*/
const shineVariants: Variants = {
  open: {
    x: ["-140%", "540%"],
    opacity: [0, 1, 1, 0],
    skewX: -12,
    transition: {
      x: { duration: 1.5, ease: EASE_IN_OUT, delay: 0.1 },
      opacity: { duration: 1.5, times: [0, 0.1, 0.85, 1], delay: 0.1 },
    },
  },
  close: {
    x: ["540%", "-140%"],
    opacity: [0, 1, 1, 0],
    skewX: -12,
    transition: {
      x: { duration: 1.05, ease: EASE_IN_OUT },
      opacity: { duration: 1.05, times: [0, 0.12, 0.85, 1] },
    },
  },
};

/* Big ghost question-number that rises into place behind the open answer */
const ghostNumberVariants: Variants = {
  collapsed: {
    opacity: 0,
    y: 70,
    scale: 1.15,
    transition: { duration: 0.16, ease: EASE_IN_OUT },
  },
  expanded: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRe(q)})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded bg-accent/25 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function FaqList({ items, categories }: FaqListProps) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    for (const item of items) map[item.category] = (map[item.category] ?? 0) + 1;
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const idx = items.findIndex((item) => slugify(item.question) === hash);
    if (idx < 0) return;
    requestAnimationFrame(() => {
      setCategory("All");
      setOpenIndex(idx);
      document
        .getElementById(`faq-${hash}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [items]);

  return (
    <MotionConfig reducedMotion="user">
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter questions by category"
        >
          {["All", ...categories].map((chip) => {
            const active = chip === category;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setCategory(chip);
                  setOpenIndex(0);
                }}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 lg:text-xs ${
                  active
                    ? "border-accent bg-accent text-[#0e0e0e]"
                    : "border-ink/15 text-muted hover:border-accent/50 hover:text-ink"
                }`}
              >
                {chip}
                <span
                  className={`rounded-full px-1.5 text-[9px] tabular-nums ${
                    active ? "bg-[#0e0e0e]/15" : "bg-ink/10"
                  }`}
                >
                  {counts[chip] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full max-w-xs shrink-0">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenIndex(0);
            }}
            placeholder="Search answers…"
            aria-label="Search frequently asked questions"
            className="w-full rounded-full border border-ink/15 bg-panel py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted transition-colors duration-300 outline-none focus:border-accent/60"
          />
        </div>
      </div>

      <p
        className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted"
        aria-live="polite"
      >
        Showing {filtered.length} of {items.length} answers
      </p>

      <motion.div layout className="mt-4 flex flex-col gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((item, i) => {
            const open = openIndex === i;
            const slug = slugify(item.question);
            return (
              <motion.div
                key={item.question}
                id={`faq-${slug}`}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                viewport={{ once: true, margin: "-60px" }}
                animate={
                  open
                    ? {
                        y: -2,
                        boxShadow:
                          "0 18px 50px -18px rgba(255,77,31,0.30), 0 4px 16px -8px rgba(0,0,0,0.5)",
                      }
                    : {
                        y: 0,
                        boxShadow: "0 0 0 0 rgba(255,77,31,0)",
                      }
                }
                transition={{
                  duration: 0.55,
                  ease: EASE_OUT_EXPO,
                  delay: Math.min(i, 8) * 0.045,
                  layout: { duration: 0.45, ease: EASE_OUT_EXPO },
                  y: springGentle,
                  boxShadow: { duration: 0.6, ease: EASE_OUT_EXPO },
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mx",
                    `${e.clientX - rect.left}px`
                  );
                  e.currentTarget.style.setProperty(
                    "--my",
                    `${e.clientY - rect.top}px`
                  );
                }}
                className={`group relative scroll-mt-28 overflow-hidden rounded-[1.25rem] border bg-panel transition-colors duration-500 ${
                  open ? "border-accent/40" : "border-ink/10 hover:border-accent/25"
                }`}
              >
                {/* Cursor spotlight — CSS vars written in onMouseMove above */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,77,31,0.09), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                {/* Light-sweep streak — z-20 rides over the whole card face */}
                <motion.span
                  variants={shineVariants}
                  initial={false}
                  animate={open ? "open" : "close"}
                  className="pointer-events-none absolute inset-y-[-25%] left-0 z-20 w-1/4 will-change-transform"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.20) 50%, rgba(255,77,31,0.10) 62%, transparent 100%)",
                    filter: "blur(6px)",
                  }}
                  aria-hidden="true"
                />
                <AnimatePresence>
                  {open && (
                    <motion.span
                      variants={glowVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-accent/15 blur-3xl"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>
                <motion.button
                  type="button"
                  id={`faq-button-${slug}`}
                  aria-controls={`faq-panel-${slug}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  whileTap={{ scale: 0.98 }}
                  className="relative z-10 flex w-full items-center gap-4 p-5 text-left md:gap-5 md:p-6"
                >
                <span className="font-mono text-xs font-bold tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="display block text-base font-medium leading-snug text-ink transition-colors md:text-lg">
                    <Highlight text={item.question} query={query} />
                  </span>
                  <span className="eyebrow mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted">
                    {item.category}
                    {item.popular && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-accent">
                        Popular
                      </span>
                    )}
                  </span>
                </span>
                <motion.span
                  animate={{ scale: open ? 1.08 : 1 }}
                  whileHover={{ scale: open ? 1.08 : 1.12 }}
                  transition={iconSpring}
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    open
                      ? "border-accent bg-accent text-[#0e0e0e]"
                      : "border-ink/15 text-ink"
                  }`}
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: open ? 225 : 0,
                      opacity: open ? 0 : 1,
                      scale: open ? 0.5 : 1,
                    }}
                    transition={iconSpring}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: open ? 0 : -225,
                      opacity: open ? 1 : 0,
                      scale: open ? 1 : 0.5,
                    }}
                    transition={iconSpring}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.span>
                </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      variants={answerVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      id={`faq-panel-${slug}`}
                      role="region"
                      aria-labelledby={`faq-button-${slug}`}
                      className="relative z-10 overflow-hidden"
                    >
                      {/* Ghost number watermark — huge, gradient-washed, rising in behind the answer */}
                      <motion.span
                        variants={ghostNumberVariants}
                        style={{
                          transformOrigin: "bottom right",
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(255,77,31,0.22), rgba(255,77,31,0.06) 55%, rgba(255,77,31,0))",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                        }}
                        className="display pointer-events-none absolute -bottom-7 right-1 select-none text-[8rem] font-black leading-none tracking-tighter text-transparent md:-bottom-9 md:right-5 md:text-[12rem]"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </motion.span>
                      {/* Accent rail — draws downward in step with the reveal */}
                      <motion.span
                        variants={railVariants}
                        style={{ transformOrigin: "top" }}
                        className="pointer-events-none absolute bottom-7 left-6 top-1 w-[2.5px] rounded-full bg-gradient-to-b from-accent via-accent/60 to-accent/5 md:left-7"
                        aria-hidden="true"
                      />
                      <motion.p
                        variants={revealVariants}
                        className="max-w-3xl px-5 pb-6 pl-[3.25rem] pt-4 text-sm leading-relaxed text-muted md:px-6 md:pl-[3.5rem] md:text-base"
                      >
                        <Highlight text={item.answer} query={query} />
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.25rem] border border-dashed border-ink/20 bg-panel/50 p-10 text-center"
          >
            <p className="display text-lg font-medium text-ink">
              No answers matched that.
            </p>
            <p className="mt-2 text-sm text-muted">
              Try a different search, or just{" "}
              <a
                href="/contact"
                className="font-semibold text-accent underline decoration-accent/40 underline-offset-4"
              >
                ask us directly
              </a>
              .
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
    </MotionConfig>
  );
}
