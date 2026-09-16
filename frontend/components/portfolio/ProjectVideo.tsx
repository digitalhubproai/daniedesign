"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import FadeUp from "@/components/animations/FadeUp";

type ProjectVideoProps = {
  src: string;
  title: string;
  /** Used as the player poster so the frame isn't black before playback. */
  poster?: string;
};

/**
 * Standalone showreel section — intentionally NOT part of GalleryDeck: the
 * gallery is a scroll-driven image deck with a lightbox, while a project has at
 * most one video and wants a plain, watchable player in its own band.
 *
 * The parent renders this only when a video exists, so there is no empty
 * section or reserved space on projects without one.
 */
export default function ProjectVideo({ src, title, poster }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  // Play through the overlay: the poster plus play button looks intentional,
  // rather than a native black frame, and only then do we hand over controls.
  const start = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {
      /* Autoplay blocked — native controls still let the user start it. */
    });
  };

  return (
    <section className="relative border-t border-ink/10 py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <FadeUp className="mb-10 md:mb-14">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Play className="h-4 w-4 text-accent" />
            </span>
            Project Video
            <span className="h-px flex-1 bg-ink/10" />
          </p>
          <p className="display max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">
            {title} <span className="text-accent">in motion</span>.
          </p>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-black">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls={started}
              playsInline
              preload="metadata"
              className="aspect-video w-full object-cover"
            />

            {!started && (
              <button
                type="button"
                onClick={start}
                aria-label={`Play ${title} video`}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-500 hover:from-black/60"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-[#0e0e0e] transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
                  <Play className="h-6 w-6 translate-x-0.5 fill-current md:h-7 md:w-7" />
                </span>
              </button>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}