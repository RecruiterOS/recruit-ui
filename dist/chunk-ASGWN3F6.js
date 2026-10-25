// src/recruit/candidate-detail-layout.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Tabs, TabsList, TabsTrigger } from "@epicbagel/saas-kit/primitives/tabs";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Loader2, MoreHorizontal, ShieldCheck, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidateDetailLayout({
  header,
  alert,
  tabs,
  children,
  footer,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-detail-layout",
      direction: "vertical",
      gap: "none",
      height: "full",
      overflow: "hidden",
      ...props,
      children: [
        header,
        alert,
        tabs,
        /* @__PURE__ */ jsx(FlexItem, { grow: true, overflow: "y-auto", children }),
        footer
      ]
    }
  );
}
function CandidateDetailHeader({
  avatar,
  name,
  verified,
  verifiedAt,
  headline,
  provenance,
  actions,
  onClose,
  closeLabel = "Close",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-detail-header",
      direction: "horizontal",
      gap: "md",
      align: "start",
      padding: "lg",
      border: "bottom",
      ...props,
      children: [
        avatar,
        /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", wrap: true, children: [
            /* @__PURE__ */ jsx(Heading, { level: 3, truncate: true, children: name }),
            verified && /* @__PURE__ */ jsxs(
              Badge,
              {
                as: "span",
                variant: "success",
                size: "micro-compact",
                gap: "xs",
                weight: "semibold",
                title: verified.title,
                children: [
                  /* @__PURE__ */ jsx(Icon, { icon: ShieldCheck, size: "xs" }),
                  verified.label
                ]
              }
            ),
            verified && present(verifiedAt) && /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", size: "xs", tone: "subtle", children: verifiedAt })
          ] }),
          present(headline) && /* @__PURE__ */ jsx(Text, { as: "div", size: "sm", tone: "muted", truncate: true, marginTop: "tight", children: headline }),
          present(provenance) && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "subtle", truncate: true, marginTop: "xs", children: provenance })
        ] }),
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", shrink: false, children: [
          actions,
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon-sm", "aria-label": closeLabel, onClick: () => onClose(), children: /* @__PURE__ */ jsx(Icon, { icon: X, size: "md" }) })
        ] })
      ]
    }
  );
}
function CandidateActionMenu({
  items,
  onSelect,
  busy = false,
  disabled,
  label = "More actions",
  variant = "ghost",
  triggerIconSize = "md",
  itemIconSize = "md",
  isolateClicks = false
}) {
  const isolate = isolateClicks ? (event) => event.stopPropagation() : void 0;
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant, size: "icon-sm", disabled, title: label, onClick: isolate, children: busy ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: triggerIconSize, spin: true }) : /* @__PURE__ */ jsx(Icon, { icon: MoreHorizontal, size: triggerIconSize }) }) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", "data-slot": "candidate-action-menu", onClick: isolate, children: items.map((item) => /* @__PURE__ */ jsxs(
      DropdownMenuItem,
      {
        onClick: () => {
          item.onSelect?.();
          onSelect?.(item.id);
        },
        disabled: item.disabled,
        children: [
          item.icon && /* @__PURE__ */ jsx(Icon, { icon: item.icon, size: itemIconSize, tone: item.tone }),
          item.label
        ]
      },
      item.id
    )) })
  ] });
}
function CandidateDetailTabs({
  tabs,
  value,
  onChange,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Tabs,
    {
      "data-slot": "candidate-detail-tabs",
      value,
      onValueChange: (next) => onChange(next),
      ...props,
      children: /* @__PURE__ */ jsx(TabsList, { width: "full", scrollable: true, marginBottom: "none", children: tabs.map((item) => /* @__PURE__ */ jsxs(TabsTrigger, { value: item.value, children: [
        item.label,
        item.count != null && item.count > 0 && /* @__PURE__ */ jsx(CountBadge, { value: item.count })
      ] }, item.value)) })
    }
  );
}

export {
  CandidateDetailLayout,
  CandidateDetailHeader,
  CandidateActionMenu,
  CandidateDetailTabs
};
