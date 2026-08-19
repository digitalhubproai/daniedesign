"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  return (
    <div>
      <h3 className="eyebrow">Newsletter</h3>
      {status === "success" ? (
        <p className="mt-4 text-sm text-accent">
          Thanks — you&apos;re on the list. Talk soon.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex max-w-xs items-center gap-2 border-b border-ink/20 pb-2 focus-within:border-accent">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              placeholder="Your email"
              className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              aria-describedby="newsletter-note"
            />
            <button
              type="submit"
              className="shrink-0 text-sm font-bold text-accent transition-opacity hover:opacity-70"
            >
              Subscribe
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-400" role="alert">
              Please enter a valid email address.
            </p>
          )}
          <p id="newsletter-note" className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
            By subscribing you agree to our privacy policy. We never share your data.
          </p>
        </form>
      )}
    </div>
  );
}