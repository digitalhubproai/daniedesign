/**
 * Small shared utility helpers for the frontend.
 *
 * Currently only holds the Tailwind-aware class name merge helper that
 * components use to combine conditional class lists.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class values and resolve conflicting Tailwind utilities.
 *
 * @param inputs Class strings, arrays or conditional objects to combine.
 * @returns A single class string where later utilities override earlier ones.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
