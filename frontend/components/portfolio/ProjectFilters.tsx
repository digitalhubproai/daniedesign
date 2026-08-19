"use client";

import { motion } from "framer-motion";
import { projectCategories } from "@/data/projects";

type ProjectFiltersProps = {
  active: string;
  onChange: (category: string) => void;
};

export default function ProjectFilters({ active, onChange }: ProjectFiltersProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filter projects by category"
    >
      {projectCategories.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive ? "text-[#0e0e0e]" : "text-ink/70 hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}