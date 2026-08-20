import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/shared/ContactForm";
import ImageReveal from "@/components/animations/ImageReveal";
import { contact } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your business, your project and your goals.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Let's Work Together."
        intro="Tell us about your business, the challenge you're facing and where you want to be. We'll come back with honest thoughts and a clear next step."
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="eyebrow">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-3 inline-block text-lg font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
              >
                {contact.email}
              </a>
            </div>
            <div>
              <p className="eyebrow">Social</p>
              <ul className="mt-3 flex flex-col gap-2">
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
            </div>
            <ImageReveal
              src="https://picsum.photos/seed/danie-contact/1200/900"
              alt="From the Danie Design studio archive"
              className="relative h-[240px] w-full rounded-[1.25rem] md:h-[300px]"
              imgClassName="photo-duo"
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}