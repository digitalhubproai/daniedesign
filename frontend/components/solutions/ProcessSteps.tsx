import { ArrowUpRight } from "lucide-react";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";

type ProcessStepsProps = {
  title: string;
  steps: string[];
};

export default function ProcessSteps({ title, steps }: ProcessStepsProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <p className="eyebrow mb-6">Process</p>
      <SplitText
        as="h2"
        mode="chars"
        text={title}
        className="display mb-10 text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
      />
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step}>
            <TiltCard
              className="rounded-2xl"
              maxTilt={6}
              glowColor="rgba(255, 77, 31, 0.12)"
              shadow={false}
            >
              <div className="group relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl border border-ink/10 bg-panel px-6 py-6 transition-colors duration-300 hover:border-accent/40 hover:bg-card md:px-8">
                <span className="display text-2xl font-medium text-outline md:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-right text-lg font-semibold text-ink transition-colors group-hover:text-accent md:text-2xl">
                  {step}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
                <span
                  className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </TiltCard>
          </li>
        ))}
      </ol>
    </div>
  );
}