import SplitText from "@/components/animations/SplitText";

type CapabilitiesProps = {
  title: string;
  items: string[];
};

export default function Capabilities({ title, items }: CapabilitiesProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <p className="eyebrow mb-6">Capabilities</p>
      <SplitText
        as="h2"
        text={title}
        className="display mb-10 text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
      />
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item}
            className="group flex items-center gap-4 bg-panel p-6 transition-colors hover:bg-card"
          >
            <span className="text-xs font-bold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-base font-semibold text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}