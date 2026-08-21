"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "circle";
  size?: "md" | "lg";
  className?: string;
  animate?: boolean;
  delay?: number;
  children: React.ReactNode;
};

const baseClasses =
  "group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-bold uppercase tracking-widest will-change-transform";

const sizes = {
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-4 text-xs md:text-sm",
};

const variants = {
  primary:
    "bg-accent text-[#0e0e0e] shadow-[0_10px_30px_rgba(255,77,31,0.35)] transition-shadow duration-500 hover:shadow-[0_18px_55px_rgba(255,77,31,0.6)]",
  outline:
    "border border-ink/20 text-ink transition-colors duration-500 hover:border-accent/70 hover:text-accent",
  circle:
    "border-0 text-ink transition-colors duration-300 hover:text-accent",
};

function Shine() {
  return (
    <span
      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      aria-hidden="true"
    />
  );
}

function ArrowIcon({ icon }: { icon: "arrow-right" | "arrow-up-right" | "none" }) {
  if (icon === "none") return null;
  const Icon = icon === "arrow-right" ? ArrowRight : ArrowUpRight;
  return (
    <Icon
      className={`h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-1 ${
        icon === "arrow-up-right"
          ? "group-hover:-translate-y-1 group-hover:rotate-45"
          : ""
      }`}
    />
  );
}

function CircleArrow() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/25 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e]">
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

export default function Button({
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "lg",
  className = "",
  animate = false,
  delay = 0,
  children,
}: ButtonProps) {
  const motionProps = {
    initial: animate ? { opacity: 0, y: 20, scale: 0.95 } : undefined,
    whileInView: animate ? { opacity: 1, y: 0, scale: 1 } : undefined,
    viewport: animate ? { once: true, margin: "-60px" } : undefined,
    transition: animate
      ? { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const }
      : undefined,
    whileHover: { scale: 1.05, y: -3 },
    whileTap: { scale: 0.96 },
  };

  const classes = `${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a href={href} data-cursor="OPEN" className={classes} {...motionProps}>
        {variant !== "circle" && <Shine />}
        <span className="relative z-10 flex items-center gap-3">
          {children}
          {variant === "circle" && <CircleArrow />}
          {variant !== "circle" && <ArrowIcon icon="arrow-up-right" />}
        </span>
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      data-cursor="OPEN"
      className={classes}
      {...motionProps}
    >
      <Shine />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <ArrowIcon icon="arrow-up-right" />
      </span>
    </motion.button>
  );
}