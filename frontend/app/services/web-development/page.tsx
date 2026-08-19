import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import ProcessSteps from "@/components/solutions/ProcessSteps";
import RelatedWork from "@/components/solutions/RelatedWork";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Website Development",
  description:
    "Website and application development across WordPress, Webflow, Laravel, React and Flutter — responsive, fast and built to scale.",
};

export default function WebDevelopmentPage() {
  return (
    <main>
      <PageHero
        eyebrow="Service — Web Development"
        title="Turn Creative Ideas Into High-Performance Websites."
        intro="We build responsive websites and digital products on modern platforms and frameworks — engineered for speed, accessibility and growth."
        meta={[
          { label: "From", value: "Discovery" },
          { label: "To", value: "Optimization" },
          { label: "Outcome", value: "Performance" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Technical Planning"
          title="The right platform for the job."
          copy={[
            "WordPress for editorial and commerce, Webflow for design-led marketing sites, React and Laravel for product-grade applications, Flutter when a mobile presence matters most.",
            "We choose the stack based on the business problem — not on what's trendy.",
          ]}
          image="https://picsum.photos/seed/danie-dev/1200/900"
          imageAlt="Abstract artwork for development"
        />
        <SplitBlock
          eyebrow="UI Implementation"
          title="Design, delivered faithfully."
          copy={[
            "The gap between design file and live site is where most projects lose quality. We implement interfaces with disciplined attention to spacing, type, motion and states — so what ships matches what was approved.",
          ]}
          image="https://picsum.photos/seed/danie-dev-2/1200/900"
          imageAlt="Abstract artwork for UI implementation"
          reverse
        />
        <SplitBlock
          eyebrow="Engineering & QA"
          title="Built to be measured."
          copy={[
            "Performance budgets, accessibility checks, responsive testing at every breakpoint and rigorous QA before launch. We build for 90+ Lighthouse scores, not just for pretty screenshots.",
          ]}
          image="https://picsum.photos/seed/danie-dev-3/1200/900"
          imageAlt="Abstract artwork for engineering and QA"
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="Development capabilities."
          items={[
            "WordPress",
            "Webflow",
            "Laravel",
            "React",
            "Flutter",
            "React.js",
            "Design Systems",
            "Custom Development",
            "Responsive Websites",
            "Mobile Applications",
          ]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <ProcessSteps
          title="The development process."
          steps={["Discovery", "Planning", "Design", "Development", "QA", "Launch", "Optimization"]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <RelatedWork category="Web" />
      </section>

      <FinalCTA />
    </main>
  );
}