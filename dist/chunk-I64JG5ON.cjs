"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }// src/recruit/candidate-contact-details.tsx
var _anchor = require('@epicbagel/saas-kit/primitives/anchor');
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function present(value) {
  return value != null && value !== false && value !== "";
}
var CONTACT_LABELS = {
  title: "Contact",
  email: "Email",
  emailVerified: "Email verified",
  phone: "Phone",
  profile: "Profile",
  profileLink: "Profile",
  location: "Location"
};
function CandidateContactDetails({
  email,
  emailVerified = false,
  phone,
  profileUrl,
  location,
  labels,
  border = "bottom",
  ...props
}) {
  const wording = { ...CONTACT_LABELS, ...labels };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-contact-details", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: wording.title }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _definitionlist.DefinitionList, { variant: "divided", children: [
      email && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: wording.email, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", display: "inline-flex", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _anchor.Anchor, { href: `mailto:${email}`, variant: "text", display: "inline-flex", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Mail, size: "xs" }),
          email
        ] }),
        emailVerified && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.BadgeCheck, size: "sm", tone: "success", "aria-label": wording.emailVerified })
      ] }) }),
      present(phone) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: wording.phone, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", display: "inline-flex", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Phone, size: "xs", tone: "muted" }),
        phone
      ] }) }),
      profileUrl && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: wording.profile, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _anchor.Anchor,
        {
          href: profileUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          variant: "text",
          display: "inline-flex",
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Link2, size: "xs" }),
            wording.profileLink,
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ExternalLink, size: "xs" })
          ]
        }
      ) }),
      present(location) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: wording.location, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { variant: "inherit", as: "span", display: "inline-flex", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.MapPin, size: "xs", tone: "muted" }),
        location
      ] }) })
    ] })
  ] });
}
function CandidateChannelLog({
  title,
  entries,
  empty = { title: "No outreach logged yet" },
  control,
  border = "bottom",
  ...props
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-channel-log", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title }),
    entries.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { variant: "divided", children: entries.map((entry, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: entry.label, children: entry.when }, _nullishCoalesce(entry.id, () => ( index)))) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _emptystate.EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: _lucidereact.Send,
        title: empty.title,
        description: empty.description
      }
    ),
    present(control) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "inherit", marginTop: "md", children: control })
  ] });
}
function CandidateDefinitionSection({
  title,
  items,
  border = "bottom",
  ...props
}) {
  const shown = items.filter((item) => present(item.value));
  if (shown.length === 0) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { "data-slot": "candidate-definition-section", border, ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { label: title }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { variant: "divided", children: shown.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: item.label, children: item.value }, _nullishCoalesce(item.id, () => ( index)))) })
  ] });
}





exports.CandidateContactDetails = CandidateContactDetails; exports.CandidateChannelLog = CandidateChannelLog; exports.CandidateDefinitionSection = CandidateDefinitionSection;
