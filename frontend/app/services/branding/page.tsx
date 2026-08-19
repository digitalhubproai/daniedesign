import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import ProcessSteps from "@/components/solutions/ProcessSteps";
import RelatedWork from "@/components/solutions/RelatedWork";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Branding",
  description:
    "Brand strategy, creative direction and visual identity that give growing businesses a recognizable and consistent presence.",
};

export default function BrandingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Service — Branding"
        title="Build a Stronger Brand Foundation."
        intro="We help businesses clarify their identity, position and visual language — then build the systems that keep the brand consistent everywhere it shows up."
        meta={[
          { label: "From", value: "Strategy" },
          { label: "To", value: "Rollout" },
          { label: "Outcome", value: "Clarity" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Brand Strategy"
          title="Positioning before pixels."
          copy={[
            "A recognizable brand starts with a clear answer to a simple question: what makes you different, and who cares? We map your market, your audience and your competitors before a single logo sketch.",
            "The result is a strategy document the whole team can stand behind — and a brief that makes creative decisions faster and easier.",
          ]}
          image="https://picsum.photos/seed/danie-branding/1200/900"
          imageAlt="Abstract artwork for brand strategy"
        />
        <SplitBlock
          eyebrow="Creative Direction"
          title="One vision, executed everywhere."
          copy={[
            "Creative direction connects strategy to execution. We define the tone, the art direction and the rules of the road so that a website, a packaging line and a social feed all feel like the same brand.",
          ]}
          image="https://picsum.photos/seed/danie-branding-2/1200/900"
          imageAlt="Abstract artwork for creative direction"
          reverse
        />
        <SplitBlock
          eyebrow="Visual Identity"
          title="A system, not a logo."
          copy={[
            "Identity work covers the logo, color, typography, layout grids and imagery. But what makes it valuable is the system: flexible enough for new products and campaigns, strict enough to stay recognizable.",
            "We deliver the full toolkit — from the mark itself to the guidelines that keep it consistent.",
          ]}
          image="https://picsum.photos/seed/danie-branding-3/1200/900"
          imageAlt="Abstract artwork for visual identity"
        />
        <SplitBlock
          eyebrow="Applications"
          title="Built to be used."
          copy={[
            "A brand only matters where people meet it. We design the applications that carry the identity into the world — packaging, stationery, social media assets, presentations, signage and digital surfaces.",
            "Everything ships with templates and guidelines, so your team can execute without us in the room.",
          ]}
          image="https://picsum.photos/seed/danie-branding-4/1200/900"
          imageAlt="Abstract artwork for brand applications"
          reverse
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="Branding capabilities."
          items={[
            "Creative Direction",
            "Brand Strategy",
            "Visual Identity",
            "Logo Design",
            "Graphic Design",
            "Brand Guidelines",
            "Packaging",
            "Stationery",
            "Social Media Assets",
          ]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <ProcessSteps
          title="The branding process."
          steps={["Discovery", "Strategy", "Concept", "Identity Development", "Guidelines", "Brand Rollout"]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <RelatedWork category="Branding" />
      </section>

      <FinalCTA />
    </main>
  );
}