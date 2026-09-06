"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Check, Link2, Minus, Plus, Search } from "lucide-react";

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

const flapOuterVariants: Variants = {
  closed: {
    rotateX: -105,
    transition: { duration: 0.26, delay: 0.16, ease: [0.55, 0, 0.85, 0.35] },
  },
  open: {
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 14.5,
      mass: 1,
      delay: 0.05,
    },
  },
};

const flapInnerVariants: Variants = {
  closed: {
    rotateX: -80,
    transition: { duration: 0.22, ease: [0.55, 0, 0.85, 0.35] },
  },
  open: {
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 230,
      damping: 14,
      mass: 1,
      delay: 0.36,
    },
  },
};

const shadeOuterVariants: Variants = {
  closed: { opacity: 1, transition: { duration: 0.18, delay: 0.16 } },
  open: {
    opacity: 0,
    transition: { duration: 0.5, delay: 0.12, ease: "easeOut" },
  },
};

const shadeInnerVariants: Variants = {
  closed: { opacity: 1, transition: { duration: 0.16 } },
  open: {
    opacity: 0,
    transition: { duration: 0.5, delay: 0.42, ease: "easeOut" },
  },
};

const floorShadowVariants: Variants = {
  closed: { opacity: 1, transition: { duration: 0.18, delay: 0.1 } },
  open: {
    opacity: 0,
    transition: { duration: 0.6, delay: 0.18, ease: "easeOut" },
  },
};

const creaseFlashVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.12 } },
  open: {
    opacity: [0, 1, 0],
    transition: { duration: 0.5, delay: 0.38, times: [0, 0.25, 1] },
  },
};

const paraTopVariants: Variants = {
  closed: {},
  open: {
    transition: { delayChildren: 0.16, staggerChildren: 0.007 },
  },
};

const paraBottomVariants: Variants = {
  closed: {},
  open: {
    transition: { delayChildren: 0.5, staggerChildren: 0.007 },
  },
};

const wordVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.1 } },
  open: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const copyRowVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.1 } },
  open: {
    opacity: 1,
    transition: { duration: 0.3, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
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

function AnswerWords({ words, query }: { words: string[]; query: string }) {
  return (
    <>
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          variants={wordVariants}
          className="inline-block will-change-[opacity,transform]"
        >
          <Highlight text={word} query={query} />
          &nbsp;
        </motion.span>
      ))}
    </>
  );
}

export default function FaqList({ items, categories }: FaqListProps) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState<string | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const copyLink = async (question: string) => {
    const slug = slugify(question);
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/faq#${slug}`
      );
      setCopied(slug);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(null), 1600);
    } catch {
      // clipboard unavailable (insecure context) — no feedback shown
    }
  };

  return (
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
            const words = item.answer.split(" ");
            const half = Math.ceil(words.length / 2);
            return (
              <motion.div
                key={item.question}
                id={`faq-${slug}`}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                viewport={{ once: true, margin: "-60px" }}
                animate={open ? { scale: [1, 1.018, 0.997, 1] } : { scale: 1 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.min(i, 8) * 0.045,
                  layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.7, times: [0, 0.12, 0.5, 1], ease: "easeOut" },
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
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-accent/15 blur-3xl"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>
                <motion.button
                  type="button"
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
                  animate={{ rotate: open ? 90 : 0, scale: open ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22, mass: 0.7 }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    open
                      ? "border-accent bg-accent text-[#0e0e0e]"
                      : "border-ink/15 text-ink"
                  }`}
                  aria-hidden="true"
                >
                  {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.1 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: {
                            duration: 0.26,
                            delay: 0.38,
                            ease: [0.65, 0, 0.35, 1],
                          },
                          opacity: { duration: 0.2, delay: 0.44 },
                        },
                      }}
                      className="relative z-10"
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ perspective: 950 }}
                      >
                        <motion.div
                          variants={floorShadowVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
                          aria-hidden="true"
                        />
                        <motion.div
                          variants={flapOuterVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          style={{
                            transformOrigin: "top center",
                            transformStyle: "preserve-3d",
                          }}
                          className="relative z-[5]"
                        >
                          <motion.span
                            variants={shadeOuterVariants}
                            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/35 to-black/10"
                            aria-hidden="true"
                          />
                          <motion.p
                            variants={paraTopVariants}
                            className="max-w-3xl px-5 pl-[3.25rem] pt-4 text-sm leading-relaxed text-muted md:px-6 md:pl-[3.5rem] md:text-base"
                          >
                            <AnswerWords words={words.slice(0, half)} query={query} />
                          </motion.p>
                          <div
                            className="mx-5 mt-1.5 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent md:mx-6"
                            aria-hidden="true"
                          />
                          <motion.div
                            variants={creaseFlashVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="pointer-events-none mx-5 -mt-px h-px bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_14px_3px_rgba(255,77,31,0.55)] md:mx-6"
                            aria-hidden="true"
                          />
                          <motion.div
                            variants={flapInnerVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            style={{
                              transformOrigin: "top center",
                              transformStyle: "preserve-3d",
                            }}
                            className="relative"
                          >
                            <motion.span
                              variants={shadeInnerVariants}
                              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-black/10"
                              aria-hidden="true"
                            />
                            <motion.p
                              variants={paraBottomVariants}
                              className="max-w-3xl px-5 pb-2 pl-[3.25rem] pt-2.5 text-sm leading-relaxed text-muted md:px-6 md:pl-[3.5rem] md:text-base"
                            >
                              <AnswerWords words={words.slice(half)} query={query} />
                            </motion.p>
                            <motion.div
                              variants={copyRowVariants}
                              className="px-5 pb-5 pl-[3.25rem] md:px-6 md:pl-[3.5rem]"
                            >
                              <button
                                type="button"
                                onClick={() => copyLink(item.question)}
                                className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-accent"
                              >
                                {copied === slug ? (
                                  <>
                                    <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                                    Link copied
                                  </>
                                ) : (
                                  <>
                                    <Link2 className="h-3 w-3" aria-hidden="true" />
                                    Copy link
                                  </>
                                )}
                              </button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </div>
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
  );
}
