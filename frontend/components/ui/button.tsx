import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      // Primary — matches website Button primary: accent fill with glow + shine sweep
      default:
        "relative overflow-hidden bg-[#ff4d1f] text-[#0e0e0e] font-bold uppercase tracking-widest shadow-[0_8px_28px_rgba(255,77,31,0.35)] hover:shadow-[0_14px_45px_rgba(255,77,31,0.55)] transition-shadow duration-500 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
      accent:
        "relative overflow-hidden bg-[#ff4d1f] text-[#0e0e0e] font-bold uppercase tracking-widest shadow-[0_8px_28px_rgba(255,77,31,0.35)] hover:shadow-[0_14px_45px_rgba(255,77,31,0.55)] transition-shadow duration-500 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
      // Destructive
      destructive:
        "border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300",
      // Outline — matches website outline button
      outline:
        "relative overflow-hidden border border-[#f4f2ee]/20 bg-transparent text-[#f4f2ee]/80 hover:border-[#ff4d1f]/60 hover:text-[#ff4d1f] transition-all duration-300",
      // Secondary — subtle
      secondary:
        "bg-white/[0.07] border border-white/[0.08] text-[#f4f2ee]/80 hover:bg-white/[0.12] hover:text-[#f4f2ee] transition-all duration-200",
      ghost:
        "bg-transparent text-[#f4f2ee]/60 hover:bg-white/[0.05] hover:text-[#f4f2ee] transition-all duration-200",
      link:
        "text-[#ff4d1f] underline-offset-4 hover:underline p-0 h-auto tracking-normal uppercase-none",
    };

    const sizes = {
      default: "h-9 px-5 py-2 text-[11px] rounded-full",
      sm: "h-8 px-4 text-[10px] rounded-full",
      lg: "h-11 px-7 text-xs rounded-full",
      icon: "h-9 w-9 rounded-full p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d1f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0e] disabled:pointer-events-none disabled:opacity-40 cursor-pointer will-change-transform active:scale-[0.97] hover:scale-[1.03] hover:-translate-y-px",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
