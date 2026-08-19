export type Service = {
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  href: string;
  image: string;
  tagline: string;
  video: string;
  accent: string;
};

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
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    tagline: "Identities that stay recognizable",
    video: "https://cdn.pixabay.com/video/2017/04/21/8794-214200523_medium.mp4",
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
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    tagline: "Experiences people understand",
    video: "https://cdn.pixabay.com/video/2019/10/09/27669-365224683_medium.mp4",
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
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    tagline: "Performance behind the pixels",
    video: "https://cdn.pixabay.com/video/2020/06/18/42521-431738825_medium.mp4",
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
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
    tagline: "Attention turned into growth",
    video: "https://cdn.pixabay.com/video/2020/08/21/47713-451772938_medium.mp4",
    accent: "#b388ff",
  },
];

