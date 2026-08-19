import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import CreativeWall from "@/components/shared/CreativeWall";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Creative",
  description:
    "Logo design, brand design, packaging, UI/UX, web design, motion graphics — the full creative toolbox of Danie Design.",
};

export default function CreativePage() {
  return (
    <main>
      <PageHero
        eyebrow="Creative"
        title="A Wall of Capabilities."
        intro="Everything we can make for your brand — from a single logo to a complete digital product. Hover to preview the kind of work behind each discipline."
      />
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <CreativeWall />
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}