"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { formServices, formBudgets, contact } from "@/data/contact";

type FormState = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please add a valid email.";
    if (!form.service) next.service = "Pick the service you're interested in.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Tell us a little more (at least 10 characters).";
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-accent/30 bg-accent/5 p-10">
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <h2 className="display text-3xl font-bold tracking-tight text-ink">
          Message received.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          Thanks for reaching out — we&apos;ll get back to you within one business day.
          Meanwhile, you can also write to us directly at{" "}
          <a href={`mailto:${contact.email}`} className="text-accent underline underline-offset-4">
            {contact.email}
          </a>
          .
        </p>
        <button
          onClick={() => {
            setForm(emptyForm);
            setSent(false);
          }}
          className="text-sm font-bold text-accent transition-opacity hover:opacity-70"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-panel px-4 py-3.5 text-sm text-ink placeholder:text-muted transition-colors focus:outline-none ${
      hasError ? "border-red-500/60" : "border-ink/10 focus:border-accent"
    }`;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Name *
          </label>
          <input
            id="cf-name"
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Jane Doe"
            className={inputClass(!!errors.name)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Email *
          </label>
          <input
            id="cf-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@company.com"
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="cf-company" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Company
          </label>
          <input
            id="cf-company"
            type="text"
            value={form.company}
            onChange={set("company")}
            placeholder="Company name"
            className={inputClass(false)}
          />
        </div>
        <div>
          <label htmlFor="cf-service" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Service *
          </label>
          <select
            id="cf-service"
            value={form.service}
            onChange={set("service")}
            className={`${inputClass(!!errors.service)} appearance-none`}
            aria-invalid={!!errors.service}
          >
            <option value="">Select a service</option>
            {formServices.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && <p className="mt-1.5 text-xs text-red-400">{errors.service}</p>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cf-budget" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {formBudgets.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, budget: b }))}
                aria-pressed={form.budget === b}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  form.budget === b
                    ? "border-accent bg-accent text-[#0e0e0e]"
                    : "border-ink/15 text-ink/70 hover:border-accent hover:text-ink"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cf-message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Message *
          </label>
          <textarea
            id="cf-message"
            rows={5}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us about your business, the project and your goals…"
            className={`${inputClass(!!errors.message)} resize-none`}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        data-cursor="OPEN"
        className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-[#0e0e0e] transition-transform duration-300 hover:scale-105"
      >
        Let&apos;s Talk
        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </button>
    </form>
  );
}