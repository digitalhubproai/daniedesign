export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "UI-UX Design", href: "/services/ui-ux" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Branding", href: "/services/branding" },
    ],
  },
  { label: "Portfolio", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/agency" },
  { label: "Contact", href: "/contact" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/agency" },
  { label: "Contact", href: "/contact" },
];