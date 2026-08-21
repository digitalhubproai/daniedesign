"use client";

import SplitText from "@/components/animations/SplitText";
import Marquee from "@/components/animations/Marquee";
import { marqueeItems } from "@/data/creative";

export default function CreativeMarquee() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="px-5 md:px-10">
        <p className="eyebrow mb-6">Creative Capabilities</p>
        <SplitText
          as="h2"
          text="Every discipline, one studio."
          className="display max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl"
        />
      </div>
      <div className="mt-16 border-y border-ink/10 py-8">
        <Marquee items={marqueeItems} speed={18} />
      </div>
    </section>
  );
}