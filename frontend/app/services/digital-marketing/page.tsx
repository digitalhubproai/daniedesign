import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import ProcessSteps from "@/components/solutions/ProcessSteps";
import RelatedWork from "@/components/solutions/RelatedWork";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Digital Marketing",
  description:
    "Digital growth support combining online marketing, search visibility, strategy and audience research.",
};

export default function DigitalMarketingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Service — Digital Marketing"
        title="Build Visibility. Create Demand. Grow."
        intro="We turn digital attention into business growth — through search visibility, market research, social channels and campaigns built on strategy, not guesswork."
        meta={[
          { label: "From", value: "Research" },
          { label: "To", value: "Reporting" },
          { label: "Outcome", value: "Growth" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Research & Strategy"
          title="Know the market before spending a dollar."
          copy={[
            "Audience research, competitor analysis and search landscape mapping define where the opportunity actually is. Strategy comes first; channels and budgets follow the evidence.",
          ]}
          image="https://picsum.photos/seed/danie-marketing/1200/900"
          imageAlt="Abstract artwork for marketing strategy"
        />
        <SplitBlock
          eyebrow="SEO & Content"
          title="Be found by people who are already looking."
          copy={[
            "Technical SEO, search-intent content and authority building work together to grow organic visibility — the channel that compounds instead of resetting every month.",
          ]}
          image="https://picsum.photos/seed/danie-marketing-2/1200/900"
          imageAlt="Abstract artwork for SEO"
          reverse
        />
        <SplitBlock
          eyebrow="Campaigns & Social"
          title="Creative that earns the click."
          copy={[
            "Paid campaigns and organic social run on one creative system, built from the brand itself. Consistent visual language, honest copy and constant testing — from awareness to conversion.",
          ]}
          image="https://picsum.photos/seed/danie-marketing-3/1200/900"
          imageAlt="Abstract artwork for campaigns"
        />
        <SplitBlock
          eyebrow="Analytics & Reporting"
          title="Every channel held accountable."
          copy={[
            "We measure what matters — pipeline and revenue, not vanity metrics. Monthly reporting shows what worked, what didn't, and what we're doing about it next.",
          ]}
          image="https://picsum.photos/seed/danie-marketing-4/1200/900"
          imageAlt="Abstract artwork for analytics"
          reverse
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="Marketing capabilities."
          items={[
            "Online Marketing",
            "SEO",
            "Strategy",
            "Market Research",
            "Social Media",
            "Campaign Management",
            "Content",
            "Analytics",
          ]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <ProcessSteps
          title="The growth process."
          steps={["Research", "Strategy", "Campaign Setup", "Execution", "Optimization", "Reporting"]}
        />
      </section>

      <section className="pb-24 md:pb-32">
        <RelatedWork category="Marketing" />
      </section>

      <FinalCTA />
    </main>
  );
}