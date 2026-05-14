import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class strings without conflicting utilities (ShadCN-style helper).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
