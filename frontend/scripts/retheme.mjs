import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "app/agency/page.tsx",
  "app/not-found.tsx",
  "app/solutions/page.tsx",
  "app/work/[slug]/page.tsx",
  "components/animations/StackedScrollCards.tsx",
  "components/home/AgencyIntro.tsx",
  "components/home/CreativeMarquee.tsx",
  "components/home/FeaturedWork.tsx",
  "components/home/Hero.tsx",
  "components/home/ImpactStats.tsx",
  "components/layout/CustomCursor.tsx",
  "components/layout/Footer.tsx",
  "components/layout/MobileMenu.tsx",
  "components/layout/Navbar.tsx",
  "components/layout/NewsletterForm.tsx",
  "components/portfolio/ProjectCard.tsx",
  "components/portfolio/ProjectFilters.tsx",
  "components/shared/ContactForm.tsx",
  "components/shared/CreativeWall.tsx",
  "components/shared/PageHero.tsx",
  "components/shared/TeamGrid.tsx",
  "components/solutions/Capabilities.tsx",
  "components/solutions/ProcessSteps.tsx",
  "components/solutions/SplitBlock.tsx",
];

const replacements = [
  ["bg-ink-2", "bg-panel"],
  ["bg-ink", "bg-paper"],
  ["bg-surface", "bg-card"],
  ["text-paper", "text-ink"],
  ["border-white", "border-ink"],
  ["bg-white", "bg-ink"],
  ["divide-white", "divide-ink"],
  ["border-paper", "border-ink"],
  ["from-ink", "from-paper"],
  ["via-ink", "via-paper"],
  ["to-ink", "to-paper"],
];

let changed = 0;
for (const file of files) {
  let content = readFileSync(file, "utf8");
  const before = content;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  if (content !== before) {
    writeFileSync(file, content);
    changed++;
    console.log("swept", file);
  }
}
console.log("done,", changed, "files changed");