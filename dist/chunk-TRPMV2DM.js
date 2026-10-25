// src/recruit/candidate-role-matches.tsx
import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { ConfirmBar } from "@epicbagel/saas-kit/primitives/confirm-bar";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateRoleMatchSummary({
  matches,
  onOpen,
  ...props
}) {
  if (!matches.length) return null;
  return /* @__PURE__ */ jsx(Stack, { gap: "xs", width: "full", "data-slot": "candidate-role-match-summary", ...props, children: matches.map((match) => /* @__PURE__ */ jsx(
    Button,
    {
      variant: "ghost",
      size: "sm",
      width: "full",
      align: "start",
      onClick: () => onOpen(match.id),
      children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", justify: "between", width: "full", children: [
        /* @__PURE__ */ jsx(Text, { size: "sm", weight: "medium", truncate: true, children: match.title }),
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", shrink: false, children: [
          match.grade,
          /* @__PURE__ */ jsx(Icon, { icon: ChevronRight, size: "sm", tone: "muted" })
        ] })
      ] })
    },
    match.id
  )) });
}
var DEFAULT_LIST_LABELS = {
  add: "Add to role",
  added: "Added",
  cancel: "Cancel"
};
function CandidateRoleMatchList({
  heading,
  matches,
  onOpen,
  onAddToRole,
  confirm,
  labels,
  ...props
}) {
  const text = { ...DEFAULT_LIST_LABELS, ...labels };
  const [added, setAdded] = useState([]);
  const [confirmMatch, setConfirmMatch] = useState(null);
  if (!matches.length) return null;
  const add = async (match) => {
    if (!onAddToRole) return;
    try {
      await onAddToRole(match.id);
      setAdded((current) => [...current, match.id]);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxs(Stack, { gap: "md", padding: "md", border: "top", "data-slot": "candidate-role-match-list", ...props, children: [
    /* @__PURE__ */ jsx(Text, { variant: "eyebrow", children: heading }),
    matches.map((match) => {
      const isAdded = !!match.added || added.includes(match.id);
      return /* @__PURE__ */ jsxs(Stack, { gap: "sm", align: "start", paddingBottom: "md", border: "bottom", children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", justify: "between", align: "start", width: "full", children: [
          /* @__PURE__ */ jsx(Stack, { grow: true, minWidth: "zero", children: /* @__PURE__ */ jsx(
            Anchor,
            {
              size: "sm",
              weight: "medium",
              href: match.href,
              onClick: (event) => {
                event.stopPropagation();
                if (onOpen) {
                  event.preventDefault();
                  onOpen(match.id);
                }
              },
              children: match.title
            }
          ) }),
          match.grade
        ] }),
        /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: match.reason }),
        isAdded ? /* @__PURE__ */ jsx(Badge, { variant: "success", size: "compact", children: match.addedLabel ?? text.added }) : onAddToRole && /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: (event) => {
              event.stopPropagation();
              setConfirmMatch(match);
            },
            children: [
              text.add,
              " ",
              /* @__PURE__ */ jsx(Icon, { icon: ArrowRight, size: "sm" })
            ]
          }
        )
      ] }, match.id);
    }),
    /* @__PURE__ */ jsx(
      ConfirmBar,
      {
        open: confirmMatch !== null,
        title: confirmMatch ? confirm.title(confirmMatch) : null,
        description: confirmMatch ? confirm.description?.(confirmMatch) : void 0,
        confirmLabel: text.add,
        cancelLabel: text.cancel,
        onCancel: () => setConfirmMatch(null),
        onConfirm: () => {
          if (!confirmMatch) return;
          const match = confirmMatch;
          setConfirmMatch(null);
          void add(match);
        }
      }
    )
  ] });
}

export {
  CandidateRoleMatchSummary,
  CandidateRoleMatchList
};
