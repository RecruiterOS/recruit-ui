// src/recruit/candidate-stage-actions.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { SplitActionButton } from "@epicbagel/saas-kit/primitives/split-action-button";
import { ChevronDown } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  moveTo: (label) => /* @__PURE__ */ jsxs(Fragment, { children: [
    "Move to ",
    label
  ] }),
  moveMenu: "Move to\u2026",
  moveTrigger: "Move to",
  present: "Present to client",
  reject: "Reject",
  rejectTitle: "Reject \u2014 move to rejected",
  decline: "Declined",
  declineTitle: "Candidate declined / not looking \u2014 move to declined"
};
function stopThen(callback) {
  return (event) => {
    event.stopPropagation();
    callback();
  };
}
function CandidateStageActions({
  advance,
  moveOptions = [],
  onMove,
  contact,
  onPresent,
  onRequestReject,
  onRequestDecline,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const hasMenu = moveOptions.length > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    advance ? hasMenu ? /* @__PURE__ */ jsx(
      SplitActionButton,
      {
        label: advance.label,
        size: "sm",
        variant: advance.outline ? "outline" : "default",
        onAction: advance.onAdvance,
        items: moveOptions.map((option) => ({ value: option.value, label: text.moveTo(option.label) })),
        onSelect: (value) => onMove?.(value),
        chevronAriaLabel: text.moveMenu
      }
    ) : /* @__PURE__ */ jsx(Button, { size: "sm", variant: advance.outline ? "outline" : "default", onClick: stopThen(advance.onAdvance), children: advance.label }) : hasMenu ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", title: text.moveMenu, onClick: (event) => event.stopPropagation(), children: [
        text.moveTrigger,
        /* @__PURE__ */ jsx(Icon, { icon: ChevronDown, size: "md" })
      ] }) }),
      /* @__PURE__ */ jsx(
        DropdownMenuContent,
        {
          align: "start",
          "data-slot": "candidate-stage-menu",
          onClick: (event) => event.stopPropagation(),
          children: moveOptions.map((option) => /* @__PURE__ */ jsx(
            DropdownMenuItem,
            {
              onClick: (event) => {
                event.stopPropagation();
                onMove?.(option.value);
              },
              children: text.moveTo(option.label)
            },
            option.value
          ))
        }
      )
    ] }) : null,
    contact,
    onPresent && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: stopThen(onPresent), children: text.present }),
    onRequestReject && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost-destructive", title: text.rejectTitle, onClick: stopThen(onRequestReject), children: text.reject }),
    onRequestDecline && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "quiet", title: text.declineTitle, onClick: stopThen(onRequestDecline), children: text.decline })
  ] });
}

export {
  CandidateStageActions
};
