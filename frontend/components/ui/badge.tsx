import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "accent" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-white/[0.07] text-[#f4f2ee]/80",
    secondary:
      "border-transparent bg-white/[0.04] text-[#9a968e]",
    destructive:
      "border-red-500/25 bg-red-500/10 text-red-400",
    outline:
      "border-white/[0.12] text-[#f4f2ee]/70 bg-transparent",
    accent:
      "border-[#ff4d1f]/30 bg-[#ff4d1f]/10 text-[#ff4d1f] font-bold",
    success:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold",
    warning:
      "border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
