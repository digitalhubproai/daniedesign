"use client";

import { ImagesScrollingAnimation } from "@/components/animations/ImagesScrollingAnimation";
import SplitText from "@/components/animations/SplitText";

export default function FeaturedStack() {
  return (
    <section className="relative">
      <div className="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-8 md:flex-row md:items-end md:justify-between md:px-10 md:py-10">
          <div>
            <p className="eyebrow mb-4">Featured Work — 2025</p>
            <SplitText
              as="h2"
              text="Signature projects."
              className="display text-4xl font-semibold leading-[0.98] tracking-tight md:text-5xl"
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Four deep collaborations — scroll through the stack to see how each
            one was built.
          </p>
        </div>
      </div>

      <ImagesScrollingAnimation />
    </section>
  );
}