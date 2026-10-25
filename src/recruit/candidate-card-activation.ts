import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type KeyboardEvent,
  type MouseEvent,
  type MouseEventHandler,
  type RefAttributes,
} from "react";

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

export type CandidateCardRootProps = ComponentPropsWithoutRef<typeof Stack> & {
  /** The card's click handler, under a name the kit card passes through. */
  onCardClick?: MouseEventHandler<HTMLElement>;
};

/**
 * The root element of a selectable card that holds other controls: a kit
 * Stack. Pass it as the kit InteractiveCard's `as`, spread
 * `candidateCardSelectProps` onto the InteractiveCard, and give the
 * InteractiveCard no `onClick`.
 *
 * InteractiveCard replays every Enter or Space that bubbles up to a card it
 * was given `onClick` for as a click on the card, and prevents the key's
 * default, so a focused nested button or link would select the card instead
 * of activating itself. This root takes the click as `onCardClick`, which
 * InteractiveCard passes through untouched, and `candidateCardSelectProps`
 * handles the keyboard.
 */
export const CandidateCardRoot: ForwardRefExoticComponent<
  CandidateCardRootProps & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, CandidateCardRootProps>(
  function CandidateCardRoot({ onCardClick, role, tabIndex, ...props }, ref) {
    return createElement(Stack, { ref, role, tabIndex, ...props, onClick: onCardClick });
  },
);

export interface CandidateCardSelectHandlers {
  onCardClick?: MouseEventHandler<HTMLElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Button semantics for a `CandidateCardRoot` card: focusable, announced as a
 * button, selected by a click that isn't on a nested control, and by Enter or
 * Space only while the card itself has focus. Host handlers run first; one
 * that prevents the default keeps the card from selecting.
 */
export function candidateCardSelectProps(
  onSelect: () => void,
  handlers: CandidateCardSelectHandlers = {},
) {
  return {
    role: "button",
    tabIndex: 0,
    onCardClick: (event: MouseEvent<HTMLElement>) => {
      handlers.onCardClick?.(event);
      if (!event.defaultPrevented && shouldActivateCandidateCard(event)) onSelect();
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      handlers.onKeyDown?.(event);
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    },
  } as const;
}
