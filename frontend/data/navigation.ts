/**
 * Static site navigation configuration.
 *
 * Pure frontend content (no backend fallback involved): the header menu, footer
 * link columns and dropdown sub-items all render from these arrays.
 */

/** Shape of a navigation link; `children` renders a dropdown / submenu. */
export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

/** Primary header navigation, in display order. */
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

/** Links for the footer's "Company" column. */
export const footerCompanyLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/agency" },
  { label: "Contact", href: "/contact" },
];