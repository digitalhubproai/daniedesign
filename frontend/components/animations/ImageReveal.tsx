"use client";

import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  start?: string;
};

export default function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority,
  start = "top 85%",
}: ImageRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([wrap, img], { clipPath: "inset(0%)", scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrap,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: wrap, start, toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        img,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: wrap, start, toggleActions: "play none none none" },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [start]);

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden [clip-path:inset(0%_0%_0%_0%)] ${className ?? ""}`}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        className={`object-cover will-change-transform ${imgClassName ?? ""}`}
      />
    </div>
  );
}