import {
  CALL_PEOPLE_SEARCH_MIN_LENGTH,
  useCallPeopleSearch,
  useCallTranscript
} from "./chunk-5BOS2LCM.js";

// src/recruit/matched-call-card.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard } from "@epicbagel/saas-kit/primitives/call-card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BriefcaseBusiness, Loader2, Sparkles, UserSearch } from "lucide-react";
import { Fragment, useState } from "react";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  untitled: "Untitled call",
  showTranscript: "Show full transcript",
  peopleSeparator: " and ",
  openPerson: (name) => `Open ${name}`,
  insights: "Call insights",
  generate: "Generate",
  regenerate: "Regenerate",
  noRolesTitle: "No suggested roles yet",
  noRolesDescription: "No other live role fits this person from this call.",
  linkPerson: "Link another person",
  linkTitle: "Link this call to another person",
  searchPlaceholder: "Search people\u2026",
  searching: "Searching\u2026",
  noMatchesTitle: "No people match that name",
  noMatchesDescription: "Try a different name or spelling."
};
var isShown = (node) => node != null && node !== false && node !== "";
var noSearch = async () => [];
function MatchedCallCard({
  title,
  people = [],
  onOpenPerson,
  source,
  timestamp,
  participants,
  summary,
  transcript,
  segments,
  loadTranscript,
  linkPerson,
  insights,
  roleMatches,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = useCallTranscript({ transcript, segments, loadTranscript });
  const [linkOpen, setLinkOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [linking, setLinking] = useState(false);
  const { results, searching } = useCallPeopleSearch(
    query,
    linkOpen && linkPerson != null,
    linkPerson?.searchPeople ?? noSearch
  );
  const ready = insights.status === "ready";
  async function link(person) {
    if (!linkPerson) return;
    setLinking(true);
    try {
      await linkPerson.onLink(person);
      setLinkOpen(false);
      setQuery("");
    } catch {
    } finally {
      setLinking(false);
    }
  }
  const heading = people.length > 0 ? /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "xs", align: "center", wrap: true, children: people.map((person, index) => /* @__PURE__ */ jsxs(Fragment, { children: [
    index > 0 && /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", children: text.peopleSeparator }),
    onOpenPerson ? /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "compact",
        onClick: () => onOpenPerson(person),
        "aria-label": text.openPerson(person.name),
        children: person.name
      }
    ) : /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", children: person.name })
  ] }, person.id)) }) : title || text.untitled;
  return /* @__PURE__ */ jsxs(Fragment2, { children: [
    /* @__PURE__ */ jsx(
      CallCard,
      {
        className,
        title: heading,
        source,
        timestamp,
        participants,
        summary,
        headerAside: linkPerson ? /* @__PURE__ */ jsx(Button, { variant: "outline", size: "compact", onClick: () => setLinkOpen(true), disabled: linking, children: text.linkPerson }) : void 0,
        transcript: call.transcript,
        segments: call.segments,
        transcriptLabel: text.showTranscript,
        onLoadTranscript: call.onLoadTranscript,
        actions: /* @__PURE__ */ jsxs(Stack, { gap: "md", width: "full", textAlign: "start", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", justify: "between", align: "center", children: [
            /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
              /* @__PURE__ */ jsx(Icon, { icon: Sparkles, size: "sm" }),
              /* @__PURE__ */ jsx(Text, { variant: "small", weight: "medium", children: text.insights })
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "compact", onClick: () => insights.onGenerate(ready), disabled: insights.generating, children: [
              insights.generating ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "sm", spin: true }) : /* @__PURE__ */ jsx(Icon, { icon: Sparkles, size: "sm" }),
              " ",
              ready ? text.regenerate : text.generate
            ] })
          ] }),
          ready && (isShown(roleMatches) ? roleMatches : /* @__PURE__ */ jsx(
            EmptyState,
            {
              variant: "empty",
              size: "inline",
              icon: BriefcaseBusiness,
              title: text.noRolesTitle,
              description: text.noRolesDescription
            }
          )),
          insights.error && /* @__PURE__ */ jsx(Text, { variant: "small", tone: "destructive", children: insights.error })
        ] })
      }
    ),
    linkPerson && /* @__PURE__ */ jsx(ResponsiveDialog, { open: linkOpen, onOpenChange: setLinkOpen, children: /* @__PURE__ */ jsxs(ResponsiveDialogContent, { children: [
      /* @__PURE__ */ jsx(ResponsiveDialogHeader, { children: /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.linkTitle }) }),
      /* @__PURE__ */ jsx(ResponsiveDialogBody, { children: /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
        /* @__PURE__ */ jsx(Input, { value: query, onChange: (event) => setQuery(event.target.value), placeholder: text.searchPlaceholder, autoFocus: true }),
        searching && /* @__PURE__ */ jsx(Text, { variant: "small", tone: "muted", children: text.searching }),
        results.length > 0 && /* @__PURE__ */ jsx(List, { surface: "bordered", radius: "md", children: results.map((person) => /* @__PURE__ */ jsx(ListItem, { children: /* @__PURE__ */ jsx(Button, { variant: "ghost", width: "full", align: "start", onClick: () => void link(person), disabled: linking, children: person.name }) }, person.id)) }),
        !searching && query.trim().length >= CALL_PEOPLE_SEARCH_MIN_LENGTH && results.length === 0 && /* @__PURE__ */ jsx(
          EmptyState,
          {
            variant: "search",
            size: "inline",
            icon: UserSearch,
            title: text.noMatchesTitle,
            description: text.noMatchesDescription
          }
        )
      ] }) })
    ] }) })
  ] });
}

export {
  MatchedCallCard
};
