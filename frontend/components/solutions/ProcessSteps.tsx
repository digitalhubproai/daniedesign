import SplitText from "@/components/animations/SplitText";

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
        text={title}
        className="display mb-10 text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
      />
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li
            key={step}
            className="group flex items-baseline justify-between gap-6 border-t border-ink/10 py-6 last:border-b transition-colors hover:bg-paper/[0.02]"
          >
            <span className="display text-2xl font-medium text-outline md:text-4xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-right text-lg font-semibold text-ink transition-colors group-hover:text-accent md:text-2xl">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}