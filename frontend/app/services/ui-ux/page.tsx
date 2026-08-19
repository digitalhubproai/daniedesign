import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import ProcessSteps from "@/components/solutions/ProcessSteps";
import RelatedWork from "@/components/solutions/RelatedWork";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "UI/UX Design",
  description:
    "User-focused product and interface design covering research, structure, usability testing and interactive prototypes.",
};

export default function UiUxPage() {
  return (
    <main>
      <PageHero
        eyebrow="Service — UI/UX Design"
        title="Design Digital Experiences Around Real People."
        intro="We create digital products that are useful and intuitive — grounded in research, structured clearly, prototyped early and tested before they ship."
        meta={[
          { label: "From", value: "Research" },
          { label: "To", value: "Handoff" },
          { label: "Outcome", value: "Clarity" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Research & Strategy"
          title="Understand users before designing screens."
          copy={[
            "Interviews, analytics, competitive review and usability observation — we gather the evidence that turns design decisions from opinions into answers.",
            "The output is a UX strategy: who the product serves, what they're trying to do, and where the product currently fails them.",
          ]}
          image="https://picsum.photos/seed/danie-uiux/1200/900"
          imageAlt="Abstract artwork for UX research"
        />
        <SplitBlock
          eyebrow="Information Architecture & Wireframes"
          title="Structure that makes sense."
          copy={[
            "Before anything looks pretty, the product needs to make sense. We map user flows, define the information architecture and wireframe every key screen in black and white.",
            "This is where the expensive mistakes get caught — on paper, not in production.",
          ]}
          image="https://picsum.photos/seed/danie-uiux-2/1200/900"
          imageAlt="Abstract artwork for wireframing"
          reverse
        />
        <SplitBlock
          eyebrow="Visual Design & Prototyping"
          title="Interfaces people enjoy using."
          copy={[
            "High-fidelity UI design brings the structure to life — typography, color, spacing, motion and states. Clickable prototypes let stakeholders and testers feel the product before a line of production code exists.",
          ]}
          image="https://picsum.photos/seed/danie-uiux-3/1200/900"
          imageAlt="Abstract artwork for interface design"
        />
        <SplitBlock
          eyebrow="Testing & Design Systems"
          title="Prove it, then package it."
          copy={[
            "Usability testing validates the flows with real users, and the fixes feed straight back into the design. A token-based design system keeps the product consistent as it grows — and hands developers everything they need.",
          ]}
          image="https://picsum.photos/seed/danie-uiux-4/1200/900"
          imageAlt="Abstract artwork for usability testing"
          reverse
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="UI/UX capabilities."
          items={[
            "UX Consulting",
            "Research",
            "Usability Testing",
            "Information Architecture",
            "Wireframes",
            "Prototypes",
            "UI Design",
            "Design Systems",
            "Mobile App Design",
          ]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <ProcessSteps
          title="The design process."
          steps={["Research", "User Flows", "Wireframes", "Visual Design", "Prototype", "Testing", "Handoff"]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <RelatedWork category="UI/UX" />
      </section>

      <FinalCTA />
    </main>
  );
}