import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind
 * utilities, keeping the last one. Same helper the previous app used.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}