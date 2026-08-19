import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { footerCompanyLinks } from "@/data/navigation";
import { contact } from "@/data/contact";
import NewsletterForm from "./NewsletterForm";
import SplitText from "@/components/animations/SplitText";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink/5 bg-panel">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <SplitText
            as="h2"
            text="We Help Brands Grow and Share Their Success Stories With the World."
            className="display max-w-4xl text-4xl font-medium leading-[1.04] tracking-tight text-ink sm:text-4xl lg:text-6xl"
          />
          <Link
            href="/contact"
            data-cursor="OPEN"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#0e0e0e] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_45px_-15px_rgba(255,77,31,0.7)]"
          >
            Let&apos;s Work
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="mt-24 grid gap-12 border-t border-ink/5 pt-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <span className="relative flex items-center">
            <Image
              src="/images/Logo-00.png"
              alt="Danie Design logo"
              width={4167}
              height={1468}
              className="invert h-9 w-auto object-contain"
            />
          </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              A full-service creative digital agency focused on design, development
              and marketing — with international client relationships.
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
            >
              {contact.email}
            </a>
          </div>

          <nav aria-label="Footer company links">
            <h3 className="eyebrow">Company</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social links">
            <h3 className="eyebrow">Social</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
            <div>
              <h3 className="eyebrow">Global</h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li className="text-sm text-muted">Serving clients across 24 countries</li>
                <li className="text-sm text-muted">Remote-first, timezone-friendly</li>
              </ul>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/5 pt-8 text-xs text-muted md:flex-row md:items-center">
          <p>
            © {year} Danie Design. All rights reserved.
          </p>
          <Link
            href="#"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}