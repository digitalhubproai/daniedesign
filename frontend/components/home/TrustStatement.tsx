"use client";

import SplitText from "@/components/animations/SplitText";

export default function TrustStatement() {
  return (
    <section className="relative py-28 md:py-44">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow mb-10 text-center">Why Brands Choose Danie Design</p>
        <SplitText
          as="h2"
          text="Trusted by brands worldwide to deliver digital experiences people remember."
          className="display mx-auto max-w-6xl text-center text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-[4.2rem]"
        />
        <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted md:text-base">
          From first-time founders to established companies across 24 countries —
          we partner with teams that care about how their brand feels.
        </p>
      </div>
    </section>
  );
}