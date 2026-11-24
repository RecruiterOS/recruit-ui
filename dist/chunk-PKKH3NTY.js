import {
  RecordReviewCard
} from "./chunk-46LWWQYQ.js";

// src/recruit/prospect-card.tsx
import { useState } from "react";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@epicbagel/saas-kit/primitives/dialog";
import { Item, ItemGroup, ItemContent, ItemMedia, ItemTitle, ItemDescription } from "@epicbagel/saas-kit/primitives/item";
import { PersonAvatar } from "@epicbagel/saas-kit/primitives/person-avatar";
import { jsx, jsxs } from "react/jsx-runtime";
function ClientProspectCard({ company, logo, role, facts, signal, matches, actions, empty }) {
  return /* @__PURE__ */ jsx(
    RecordReviewCard,
    {
      "data-slot": "client-prospect-card",
      name: company,
      headline: role,
      avatar: logo,
      cover: null,
      facts,
      insight: { label: "Why now", value: signal },
      actions: /* @__PURE__ */ jsxs("section", { className: "grid gap-3 px-4 py-4 sm:px-6", "aria-label": "Rolodex matches", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "From your Rolodex" }),
        matches.length ? /* @__PURE__ */ jsx(ItemGroup, { children: matches.map((p) => /* @__PURE__ */ jsxs(Item, { size: "sm", className: "items-start rounded-none border-0 px-0 py-3 [&+&]:border-t", children: [
          /* @__PURE__ */ jsx(ItemMedia, { children: /* @__PURE__ */ jsx(PersonAvatar, { name: p.name, photoUrl: p.photoUrl, size: 36, decorative: true }) }),
          /* @__PURE__ */ jsxs(ItemContent, { children: [
            /* @__PURE__ */ jsx(ItemTitle, { children: p.name }),
            /* @__PURE__ */ jsx(ItemDescription, { className: "line-clamp-none", children: p.evidence })
          ] })
        ] }, p.id)) }) : empty,
        actions
      ] })
    }
  );
}
function ShortlistPreviewCard({ name, preview, previewTitle = name, openLabel = "View profile", ...card }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(
      RecordReviewCard,
      {
        ...card,
        "data-slot": "shortlist-preview-card",
        name,
        cover: null,
        onSelect: () => setOpen(true),
        selectLabel: "Open preview for " + name,
        actions: /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-6", children: /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", "aria-label": openLabel + ": " + name, children: openLabel }) }) })
      }
    ),
    /* @__PURE__ */ jsxs(DialogContent, { "aria-describedby": void 0, className: "max-h-[85dvh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: previewTitle }),
      preview
    ] })
  ] });
}

export {
  ClientProspectCard,
  ShortlistPreviewCard
};
