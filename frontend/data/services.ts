/**
 * Static demo content for the services offering.
 *
 * These service entries are fallback/demo data: the API layer (`lib/api.ts`)
 * returns them on the services page and in the admin dashboard whenever the
 * backend is unavailable. Each entry also drives its own hero section (tagline,
 * accent color).
 */

/** Shape of a single service offering, including its landing-page presentation fields. */
export type Service = {
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  href: string;
  image: string;
  tagline: string;
  accent: string;
};

/** Demo service offerings, in the order they appear on the services page. */
export const services: Service[] = [
  {
    number: "01",
    title: "Branding",
    description:
      "Help businesses create clear, recognizable and consistent identities through strategy, creative direction and visual design.",
    capabilities: [
      "Creative Direction",
      "Brand Identity",
      "Branding Strategy",
      "Graphic Design",
      "Startup Branding",
    ],
    href: "/services/branding",
    image: "/images/branding.jpg",
    tagline: "Identities that stay recognizable",
    accent: "#ff4d1f",
  },
  {
    number: "02",
    title: "UI/UX Design",
    description:
      "Design useful and intuitive digital experiences through research, structure, prototyping and testing.",
    capabilities: [
      "UI/UX Consulting",
      "UX Research",
      "Usability Testing",
      "Wireframing",
      "Prototyping",
      "Mobile App Design",
    ],
    href: "/services/ui-ux",
    image: "/images/uiux.jpg",
    tagline: "Experiences people understand",
    accent: "#4da6ff",
  },
  {
    number: "03",
    title: "Website Development",
    description:
      "Build responsive websites and digital products using modern platforms and frameworks.",
    capabilities: [
      "WordPress",
      "Webflow",
      "Laravel",
      "React",
      "Flutter",
      "Design Systems",
      "React.js",
      "Mobile Applications",
    ],
    href: "/services/web-development",
    image: "/images/web development.png",
    tagline: "Performance behind the pixels",
    accent: "#7ee787",
  },
  {
    number: "04",
    title: "Digital Marketing",
    description:
      "Use strategy, search visibility, audience research and social channels to help brands grow online.",
    capabilities: [
      "Online Marketing",
      "SEO",
      "Strategy",
      "Market Research",
      "Social Media",
    ],
    href: "/services/digital-marketing",
    image: "/images/digitalmarketing.webp",
    tagline: "Attention turned into growth",
    accent: "#b388ff",
  },
];

