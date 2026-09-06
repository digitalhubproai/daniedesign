"use client";

/**
 * Central GSAP setup for the frontend.
 *
 * Registers the ScrollTrigger and MotionPathPlugin plugins once and
 * re-exports both `gsap` and `ScrollTrigger`, alongside small SSR-safe media
 * query helpers that animation code uses to skip or simplify motion for
 * visitors who prefer reduced motion and for touch-only (coarse pointer)
 * devices.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * Pre-configured animation exports. Import gsap/ScrollTrigger from here
 * instead of the packages directly so the plugin is always registered.
 */
export { gsap, ScrollTrigger };

/**
 * Whether the visitor's OS/browser asks for reduced motion.
 *
 * @returns True on the client when "(prefers-reduced-motion: reduce)" matches;
 *   false during SSR and when motion is allowed.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Whether the device's primary input is a coarse pointer (touch).
 *
 * @returns True on the client when "(pointer: coarse)" matches; false during SSR.
 */
export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}