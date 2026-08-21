"use client";

import SplitText from "@/components/animations/SplitText";
import StackedScrollCards from "@/components/animations/StackedScrollCards";
import Button from "@/components/shared/Button";

export default function Services() {
  return (
    <section id="services" className="relative">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 pb-16 pt-24 md:grid-cols-12 md:px-10 md:pt-32">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6">
            <span className="text-accent">What We Do</span> — 01 / 04
          </p>
          <SplitText
            as="h2"
            text="Four disciplines. One connected process."
            className="display text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl"
          />
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-7 md:col-start-6">
          <p className="max-w-lg text-base leading-relaxed text-muted md:text-lg">
            Brand strategy, design, technology and marketing — each one
            strengthens the others. Scroll to explore how they fit together.
          </p>
          <Button href="/services" variant="circle" size="md">
            All Solutions
          </Button>
        </div>
      </div>

      <StackedScrollCards />
    </section>
  );
}