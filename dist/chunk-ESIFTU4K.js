// src/recruit/candidate-contact-details.tsx
import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BadgeCheck, ExternalLink, Link2, Mail, MapPin, Phone, Send } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-contact-details", border, ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: wording.title }),
    /* @__PURE__ */ jsxs(DefinitionList, { variant: "divided", children: [
      email && /* @__PURE__ */ jsx(DefinitionItem, { label: wording.email, children: /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", display: "inline-flex", children: [
        /* @__PURE__ */ jsxs(Anchor, { href: `mailto:${email}`, variant: "text", display: "inline-flex", children: [
          /* @__PURE__ */ jsx(Icon, { icon: Mail, size: "xs" }),
          email
        ] }),
        emailVerified && /* @__PURE__ */ jsx(Icon, { icon: BadgeCheck, size: "sm", tone: "success", "aria-label": wording.emailVerified })
      ] }) }),
      present(phone) && /* @__PURE__ */ jsx(DefinitionItem, { label: wording.phone, children: /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", display: "inline-flex", children: [
        /* @__PURE__ */ jsx(Icon, { icon: Phone, size: "xs", tone: "muted" }),
        phone
      ] }) }),
      profileUrl && /* @__PURE__ */ jsx(DefinitionItem, { label: wording.profile, children: /* @__PURE__ */ jsxs(
        Anchor,
        {
          href: profileUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          variant: "text",
          display: "inline-flex",
          children: [
            /* @__PURE__ */ jsx(Icon, { icon: Link2, size: "xs" }),
            wording.profileLink,
            /* @__PURE__ */ jsx(Icon, { icon: ExternalLink, size: "xs" })
          ]
        }
      ) }),
      present(location) && /* @__PURE__ */ jsx(DefinitionItem, { label: wording.location, children: /* @__PURE__ */ jsxs(Text, { variant: "inherit", as: "span", display: "inline-flex", children: [
        /* @__PURE__ */ jsx(Icon, { icon: MapPin, size: "xs", tone: "muted" }),
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
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-channel-log", border, ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title }),
    entries.length > 0 ? /* @__PURE__ */ jsx(DefinitionList, { variant: "divided", children: entries.map((entry, index) => /* @__PURE__ */ jsx(DefinitionItem, { label: entry.label, children: entry.when }, entry.id ?? index)) }) : /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        icon: Send,
        title: empty.title,
        description: empty.description
      }
    ),
    present(control) && /* @__PURE__ */ jsx(Text, { as: "div", variant: "inherit", marginTop: "md", children: control })
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
  return /* @__PURE__ */ jsxs(PanelSection, { "data-slot": "candidate-definition-section", border, ...props, children: [
    /* @__PURE__ */ jsx(SectionHeader, { label: title }),
    /* @__PURE__ */ jsx(DefinitionList, { variant: "divided", children: shown.map((item, index) => /* @__PURE__ */ jsx(DefinitionItem, { label: item.label, children: item.value }, item.id ?? index)) })
  ] });
}

export {
  CandidateContactDetails,
  CandidateChannelLog,
  CandidateDefinitionSection
};
