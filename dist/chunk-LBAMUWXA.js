// src/recruit/candidate-contact-channels-menu.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  trigger: "Contacted via",
  compactTrigger: "Via",
  triggerTitle: "Record how this candidate was contacted",
  remove: (option) => /* @__PURE__ */ jsxs(Fragment, { children: [
    "Remove ",
    option.label
  ] })
};
function isTouched(value) {
  return value != null && value !== false;
}
function CandidateContactChannelsMenu({
  options,
  touched,
  onTouch,
  onRemove,
  compact = false,
  labels
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const used = options.filter((option) => isTouched(touched[option.id]));
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        size: "sm",
        variant: "outline",
        title: text.triggerTitle,
        onClick: (event) => event.stopPropagation(),
        children: [
          compact ? text.compactTrigger : text.trigger,
          used.length > 0 && /* @__PURE__ */ jsx(CountBadge, { value: used.length, variant: "secondary" }),
          /* @__PURE__ */ jsx(Icon, { icon: ChevronDown, size: "md" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        align: "start",
        "data-slot": "candidate-contact-channels-menu",
        onClick: (event) => event.stopPropagation(),
        children: [
          options.map((option) => {
            const recency = touched[option.id];
            const isUsed = isTouched(recency);
            return /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onSelect: (event) => event.preventDefault(),
                onClick: (event) => {
                  event.stopPropagation();
                  onTouch(option.id);
                },
                children: [
                  /* @__PURE__ */ jsx(Icon, { icon: Check, size: "md", tone: "success", visibility: isUsed ? "visible" : "hidden" }),
                  option.label,
                  isUsed && recency !== true && /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", grow: true, align: "end", paddingX: "md", size: "xs", tone: "muted", children: recency })
                ]
              },
              option.id
            );
          }),
          used.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            used.map((option) => /* @__PURE__ */ jsx(
              DropdownMenuItem,
              {
                tone: "muted",
                onClick: (event) => {
                  event.stopPropagation();
                  onRemove(option.id);
                },
                children: text.remove(option)
              },
              `rm-${option.id}`
            ))
          ] })
        ]
      }
    )
  ] });
}

export {
  CandidateContactChannelsMenu
};
