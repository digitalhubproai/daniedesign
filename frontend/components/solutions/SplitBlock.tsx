import ImageReveal from "@/components/animations/ImageReveal";
import SplitText from "@/components/animations/SplitText";

type SplitBlockProps = {
  eyebrow: string;
  title: string;
  copy: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  bullets?: string[];
};

export default function SplitBlock({
  eyebrow,
  title,
  copy,
  image,
  imageAlt,
  reverse = false,
  bullets,
}: SplitBlockProps) {
  return (
    <div
      className={`mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <p className="eyebrow mb-6">{eyebrow}</p>
        <SplitText
          as="h2"
          text={title}
          className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
        />
        <div className="mt-6 flex flex-col gap-4">
          {copy.map((paragraph, i) => (
            <p key={i} className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
              {paragraph}
            </p>
          ))}
        </div>
        {bullets && (
          <ul className="mt-8 flex flex-col gap-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 text-sm font-medium text-ink/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
      <ImageReveal
        src={image}
        alt={imageAlt}
        className="relative h-[280px] rounded-[1.25rem] md:h-[400px]"
        imgClassName="photo-duo"
        sizes="(min-width: 1024px) 46vw, 100vw"
      />
    </div>
  );
}