export type Stat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

export const stats: Stat[] = [
  {
    value: 1000,
    suffix: "+",
    label: "Projects Supported",
    description:
      "Design and development solutions that helped companies grow — including support for businesses reaching major funding milestones.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Years of Experience",
    description:
      "A journey that began with a small team focused on design and creativity, and grew into branding, design and digital work for startups and established brands.",
  },
  {
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description:
      "An average satisfaction rate built on quality, communication, transparency and proactive handling of challenges.",
  },
  {
    value: 500,
    suffix: "+",
    label: "Websites & Apps",
    description:
      "Responsive, user-focused websites and applications across WordPress, Figma, Webflow and custom solutions.",
  },
  {
    value: 25,
    suffix: "+",
    label: "Team Specialists",
    description:
      "A multidisciplinary team of designers and developers covering branding, graphic design, responsive websites, applications and complete digital solutions.",
  },
];

export const heroStats = [
  { value: 98, suffix: "%", label: "Client satisfaction and repeat partnerships" },
  { value: 160, suffix: "+", label: "Successful projects across 24 countries" },
];

export type ImpactStoryBlock = {
  number: string;
  title: string;
  body: string;
};

export const impactStory: ImpactStoryBlock[] = [
  {
    number: "01",
    title: "Foundation",
    body: "It started with a small team obsessed with design and creativity. What began as a couple of people and a sketchbook grew into a studio serving startups and established brands across the world.",
  },
  {
    number: "02",
    title: "Growth",
    body: "From the first website to complete brand systems — 1,000+ projects supported, hundreds of products shipped and work delivered across 24 countries.",
  },
  {
    number: "03",
    title: "Craft",
    body: "Design is only half the story. Every pixel is engineered — responsive builds, performance budgets and interfaces that feel as good as they look.",
  },
  {
    number: "04",
    title: "Partnership",
    body: "98% of clients stay. We measure success in repeat partnerships, long-term retainers and the moments a product quietly outperforms the market.",
  },
];