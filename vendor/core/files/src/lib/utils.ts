import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate initials from a name or email address.
 */
export function generateInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const nameParts = name.trim().split(" ");
    if (
      nameParts.length >= 2 &&
      nameParts[0] &&
      nameParts[nameParts.length - 1] &&
      nameParts[0][0] &&
      nameParts[nameParts.length - 1]?.[0]
    ) {
      return (
        nameParts[0][0] + nameParts[nameParts.length - 1]![0]
      ).toUpperCase();
    }
    if (nameParts[0] && nameParts[0].length > 0 && nameParts[0][0]) {
      return nameParts[0][0].toUpperCase();
    }
  }
  if (email) {
    const emailParts = email.split("@");
    if (
      emailParts[0] &&
      emailParts[0].length >= 2 &&
      emailParts[0][0] &&
      emailParts[0][1]
    ) {
      return (emailParts[0][0] + emailParts[0][1]).toUpperCase();
    }
    if (emailParts[0] && emailParts[0].length > 0 && emailParts[0][0]) {
      return emailParts[0][0].toUpperCase();
    }
  }
  return "U";
}
