/**
 * Static contact-page configuration and form option lists.
 *
 * This is fallback/demo content: it feeds the contact page, newsletter and
 * footer social links when the backend is unavailable. Edit these values to
 * change the studio's published contact details site-wide.
 */

/** Contact details, newsletter/legal notes and social profile links. */
export const contact = {
  email: "daniedesignz@gmail.com",
  newsletterNote:
    "Monthly updates on our work, design thinking and brand stories. No spam, unsubscribe anytime.",
  privacyNote:
    "By subscribing you agree to our privacy policy. We never share your data.",
  socials: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "X", href: "https://x.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ] as { label: string; href: string }[],
};

/** Options offered in the "service" dropdown of the contact form. */
export const formServices = [
  "Branding",
  "UI/UX Design",
  "Website Development",
  "Digital Marketing",
  "Other",
];

/** Options offered in the "budget" dropdown of the contact form. */
export const formBudgets = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
];