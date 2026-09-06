// Interactive FAQ accordion used by the "/faq" page. Client component: it
// owns category-filter chips and a text search over the items passed in from
// the page, and animates open/close with framer-motion. One item is open at
// a time; the answer column height-animates like the rest of the site.
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Search } from "lucide-react";

export type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

type FaqListProps = {
  items: FaqItem[];
  categories: string[];
};

export default function FaqList({ items, categories }: FaqListProps) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

  return (
    <div>
      {/* ── Filter + Search ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions by category">
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
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 lg:text-xs ${
                  active
                    ? "border-accent bg-accent text-[#0e0e0e]"
                    : "border-ink/15 text-muted hover:border-accent/50 hover:text-ink"
                }`}
              >
                {chip}
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

      {/* ── Accordion ── */}
      <div className="mt-8 flex flex-col gap-3">
        {filtered.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={item.question}
              className={`overflow-hidden rounded-[1.25rem] border bg-panel transition-colors duration-500 ${
                open ? "border-accent/40" : "border-ink/10 hover:border-accent/25"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 p-5 text-left md:gap-5 md:p-6"
              >
                <span className="font-mono text-xs font-bold tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="display block text-base font-medium leading-snug text-ink transition-colors md:text-lg">
                    {item.question}
                  </span>
                  <span className="eyebrow mt-1.5 block text-[10px] text-muted">
                    {item.category}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: open ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    open
                      ? "border-accent bg-accent text-[#0e0e0e]"
                      : "border-ink/15 text-ink"
                  }`}
                  aria-hidden="true"
                >
                  {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="max-w-3xl px-5 pb-6 pl-[3.25rem] text-sm leading-relaxed text-muted md:px-6 md:pl-[3.5rem] md:text-base">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-[1.25rem] border border-dashed border-ink/20 bg-panel/50 p-10 text-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
