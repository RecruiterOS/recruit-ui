// src/recruit/candidate-card-activation.ts
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import {
  createElement,
  forwardRef
} from "react";
var INTERACTIVE_DESCENDANT = "button, a, input, select, textarea, [role='button'], [role='link']";
function shouldActivateCandidateCard(event) {
  if (!(event.target instanceof Element)) return true;
  const nestedControl = event.target.closest(INTERACTIVE_DESCENDANT);
  return nestedControl == null || nestedControl === event.currentTarget;
}
var CandidateCardRoot = forwardRef(
  function CandidateCardRoot2({ onCardClick, role, tabIndex, ...props }, ref) {
    return createElement(Stack, { ref, role, tabIndex, ...props, onClick: onCardClick });
  }
);
function candidateCardSelectProps(onSelect, handlers = {}) {
  return {
    role: "button",
    tabIndex: 0,
    onCardClick: (event) => {
      handlers.onCardClick?.(event);
      if (!event.defaultPrevented && shouldActivateCandidateCard(event)) onSelect();
    },
    onKeyDown: (event) => {
      handlers.onKeyDown?.(event);
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect();
      }
    }
  };
}

export {
  shouldActivateCandidateCard,
  CandidateCardRoot,
  candidateCardSelectProps
};
