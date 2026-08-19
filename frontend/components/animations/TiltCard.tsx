"use client";

import { useRef, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glow?: boolean;
  glowColor?: string;
};

export default function TiltCard({
  children,
  className,
  maxTilt = 6,
  glow = true,
  glowColor = "rgba(255, 77, 31, 0.18)",
}: TiltCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const glowEl = glowRef.current;
    if (!root || !inner) return;

    const rect = root.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    inner.style.transform = `rotateY(${px * maxTilt}deg) rotateX(${-py * maxTilt}deg) translateY(-4px)`;

    if (glowEl) {
      const gx = (px + 0.5) * 100;
      const gy = (py + 0.5) * 100;
      glowEl.style.background = `radial-gradient(420px circle at ${gx}% ${gy}%, ${glowColor}, transparent 70%)`;
      glowEl.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    const inner = innerRef.current;
    const glowEl = glowRef.current;
    if (inner) inner.style.transform = "";
    if (glowEl) {
      glowEl.style.background = "";
      glowEl.style.opacity = "0";
    }
  };

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full overflow-hidden rounded-[inherit] transition-transform duration-300 ease-out will-change-transform"
      >
        {children}
        {glow && (
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
            style={{ background: "transparent" }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
