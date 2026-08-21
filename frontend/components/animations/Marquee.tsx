"use client";

type MarqueeProps = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
};

export default function Marquee({
  items,
  speed = 60,
  className,
  separator = "—",
}: MarqueeProps) {
  const doubled = [...items, ...items];
  const duration = items.length * (120 / speed);

  return (
    <div className={`overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <div
        className="marquee-track flex w-max items-center whitespace-nowrap will-change-transform"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="display text-[5vw] leading-none font-bold uppercase tracking-tight md:text-[3.5vw]">
              {item}
            </span>
            <span className="mx-[3vw] text-[2vw] text-accent md:mx-[2.5vw] md:text-[1.4vw]">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
