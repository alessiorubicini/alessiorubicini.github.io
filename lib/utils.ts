import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to detect client-side
export function isClient() {
  return typeof window !== "undefined"
}

// Helper function to get current language
export function getCurrentLanguage() {
  if (isClient()) {
    return localStorage.getItem("language") || "en"
  }
  return "en"
}

