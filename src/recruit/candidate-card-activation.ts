import type { MouseEvent } from "react";

const INTERACTIVE_DESCENDANT =
  "button, a, input, select, textarea, [role='button'], [role='link']";

/** Keep nested actions from also selecting their surrounding candidate card. */
export function shouldActivateCandidateCard(
  event: MouseEvent<HTMLElement>,
): boolean {
  if (!(event.target instanceof Element)) return true;
  const nestedControl = event.target.closest(INTERACTIVE_DESCENDANT);
  return nestedControl == null || nestedControl === event.currentTarget;
}
