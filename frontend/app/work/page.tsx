import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected projects in branding, UI/UX, web, mobile and marketing — work that speaks through design.",
};

export default function WorkPage() {
  return (
    <main>
      <PageHero
        eyebrow="Portfolio"
        title="Work That Speaks Through Design."
        intro="Every project below carries the same standard: strategy first, craft always. Filter by discipline to explore."
        meta={[{ label: "Projects", value: "26" }]}
      />
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <ProjectGrid />
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}