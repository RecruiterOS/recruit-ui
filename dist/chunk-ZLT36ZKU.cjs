"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk6CAKWJG4cjs = require('./chunk-6CAKWJG4.cjs');

// src/recruit/prospect-card.tsx
var _react = require('react');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _dialog = require('@epicbagel/saas-kit/primitives/dialog');
var _item = require('@epicbagel/saas-kit/primitives/item');
var _personavatar = require('@epicbagel/saas-kit/primitives/person-avatar');
var _jsxruntime = require('react/jsx-runtime');
function ClientProspectCard({ company, logo, role, facts, signal, matches, actions, empty }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk6CAKWJG4cjs.RecordReviewCard,
    {
      "data-slot": "client-prospect-card",
      name: company,
      headline: role,
      avatar: logo,
      cover: null,
      facts,
      insight: { label: "Why now", value: signal },
      actions: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "grid gap-3 px-4 py-4 sm:px-6", "aria-label": "Rolodex matches", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h4", { className: "text-sm font-semibold", children: "From your Rolodex" }),
        matches.length ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _item.ItemGroup, { children: matches.map((p) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _item.Item, { size: "sm", className: "items-start rounded-none border-0 px-0 py-3 [&+&]:border-t", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _item.ItemMedia, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _personavatar.PersonAvatar, { name: p.name, photoUrl: p.photoUrl, size: 36, decorative: true }) }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _item.ItemContent, { children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _item.ItemTitle, { children: p.name }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _item.ItemDescription, { className: "line-clamp-none", children: p.evidence })
          ] })
        ] }, p.id)) }) : empty,
        actions
      ] })
    }
  );
}
function ShortlistPreviewCard({ name, preview, previewTitle = name, openLabel = "View profile", ...card }) {
  const [open, setOpen] = _react.useState.call(void 0, false);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dialog.Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk6CAKWJG4cjs.RecordReviewCard,
      {
        ...card,
        "data-slot": "shortlist-preview-card",
        name,
        cover: null,
        onSelect: () => setOpen(true),
        selectLabel: "Open preview for " + name,
        actions: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "px-4 sm:px-6", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.DialogTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", "aria-label": openLabel + ": " + name, children: openLabel }) }) })
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dialog.DialogContent, { "aria-describedby": void 0, className: "max-h-[85dvh] overflow-y-auto", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dialog.DialogTitle, { children: previewTitle }),
      preview
    ] })
  ] });
}




exports.ClientProspectCard = ClientProspectCard; exports.ShortlistPreviewCard = ShortlistPreviewCard;
