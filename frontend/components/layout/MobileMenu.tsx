"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { navLinks } from "@/data/navigation";
import { contact } from "@/data/contact";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] flex flex-col bg-paper"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-20 items-center justify-between px-5">
            <span className="relative flex items-center">
            <Image
              src="/images/Logo-00.png"
              alt="Danie Design logo"
              width={4167}
              height={1468}
              className="invert h-7 w-auto object-contain"
            />
          </span>
            <button
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-accent hover:text-accent"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-6" aria-label="Mobile navigation">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between border-b border-ink/5 py-5"
                >
                  <span className="display text-4xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-7 w-7 text-muted transition-all group-hover:rotate-45 group-hover:text-accent" />
                </Link>
                {link.children && (
                  <ul className="flex flex-col gap-1 border-b border-ink/5 pb-5">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="group flex items-center gap-3 py-2 pl-2"
                        >
                          <span className="text-[10px] font-bold text-accent">
                            {String(
                              link.children!.indexOf(child) + 1
                            ).padStart(2, "0")}
                          </span>
                          <span className="text-base text-muted transition-colors group-hover:text-accent">
                            {child.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col gap-5 px-6 pb-10"
          >
            <Link
              href="/contact"
              onClick={onClose}
              data-cursor="OPEN"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent py-4 text-base font-bold text-[#0e0e0e]"
            >
              Let&apos;s Talk
            </Link>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}