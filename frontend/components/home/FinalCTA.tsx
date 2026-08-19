"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SplitText from "@/components/animations/SplitText";

export default function FinalCTA() {
  return (
    <section className="grain relative bg-accent py-24 text-[#0e0e0e] md:py-36">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-5 text-center md:px-10">
        <p className="eyebrow mb-8 text-[#0e0e0e]/70!">Have a project in mind?</p>
        <SplitText
          as="h2"
          text="Let's build something worth remembering."
          className="display mx-auto max-w-5xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-4xl md:text-6xl"
        />
        <Link
          href="/contact"
          data-cursor="OPEN"
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-[#0e0e0e] px-9 py-4 text-sm font-bold uppercase tracking-widest text-accent transition-transform duration-300 hover:scale-105"
        >
          Start the Conversation
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </section>
  );
}