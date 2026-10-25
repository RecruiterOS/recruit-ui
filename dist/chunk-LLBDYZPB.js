import {
  CALL_PEOPLE_SEARCH_MIN_LENGTH,
  useCallPeopleSearch,
  useCallTranscript
} from "./chunk-5BOS2LCM.js";

// src/recruit/call-reconcile-card.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard } from "@epicbagel/saas-kit/primitives/call-card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { UserPlus, UserSearch } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  untitled: "Untitled call",
  showTranscript: "Show full transcript",
  heading: "Attach this call to a person",
  dismiss: "Dismiss",
  notFound: (name) => `We couldn't find ${name}.`,
  hint: "Search or add them below to attach the conversation and keep their history and future recommendations together.",
  pickHint: "Pick who it was with to attach the conversation and keep their history and future recommendations together.",
  pickOther: (hasMatches) => hasMatches ? "Someone else" : "Attach to\u2026",
  possibleMatches: "Possible matches",
  searchPlaceholder: (name) => name === void 0 ? "Search by name" : `Search for ${name}`,
  addManually: "Manually add",
  searching: "Searching\u2026",
  noMatchesTitle: "No people match that name",
  noMatchesDescription: "Try a different spelling, or add them manually.",
  createTitle: "Create candidate from this call",
  useParticipant: "Use a participant",
  name: "Name",
  namePlaceholder: "Full name",
  email: "Email",
  emailPlaceholder: "email@example.com",
  createSubmit: "Create & attach this call",
  previewTitle: "Candidate preview",
  cancel: "Cancel",
  attach: "Attach this call"
};
var CallReconcileDialogs = lazy(
  () => import("./call-reconcile-dialogs-LJ55XLXI.js").then((module) => ({ default: module.CallReconcileDialogs }))
);
var isShown = (node) => node != null && node !== false && node !== "" && !(Array.isArray(node) && node.length === 0);
var noSearch = async () => [];
function CallReconcileCard({
  title,
  source,
  summary,
  timestamp,
  participants = [],
  transcript,
  segments,
  loadTranscript,
  owner,
  suggestions,
  guesses = [],
  suggestedPerson,
  searchPeople,
  externalSearch,
  onDismiss,
  onAttach,
  onCreateAttach,
  renderPreview,
  onPickOther,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = useCallTranscript({ transcript, segments, loadTranscript });
  const [query, setQuery] = useState("");
  const { results, searching } = useCallPeopleSearch(
    query,
    searchPeople != null,
    searchPeople ?? noSearch
  );
  const [preview, setPreview] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const closePreview = () => setPreview(null);
  const picker = onPickOther != null;
  const matches = suggestions !== void 0 ? suggestions : guesses.map((guess) => /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setPreview(guess), children: guess.name }, guess.id));
  const hasMatches = isShown(matches);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      CallCard,
      {
        className,
        title: title || text.untitled,
        source,
        headerAside: owner ? /* @__PURE__ */ jsx(Badge, { variant: owner.isViewer ? "secondary" : "outline", shrink: true, children: owner.label }) : void 0,
        summary,
        timestamp,
        participants,
        transcript: call.transcript,
        segments: call.segments,
        transcriptLabel: text.showTranscript,
        onLoadTranscript: call.onLoadTranscript,
        actions: /* @__PURE__ */ jsxs(Stack, { gap: "md", width: "full", textAlign: "start", padding: "sm", children: [
          /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
            /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "center", justify: "between", children: [
              /* @__PURE__ */ jsx(Text, { size: "sm", weight: "medium", children: text.heading }),
              /* @__PURE__ */ jsx(Button, { variant: "quiet", size: "compact", shrink: true, onClick: () => onDismiss(), children: text.dismiss })
            ] }),
            /* @__PURE__ */ jsxs(Text, { size: "xs", tone: "muted", children: [
              suggestedPerson && /* @__PURE__ */ jsxs(Fragment, { children: [
                text.notFound(suggestedPerson.name),
                " "
              ] }),
              picker ? text.pickHint : text.hint
            ] })
          ] }),
          picker ? /* @__PURE__ */ jsxs(Stack, { gap: "xs", border: "top", paddingTop: "md", children: [
            hasMatches && /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", children: text.possibleMatches }),
            /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: true, children: [
              matches,
              /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => onPickOther?.(), children: [
                /* @__PURE__ */ jsx(Icon, { icon: UserPlus, size: "sm" }),
                text.pickOther(hasMatches)
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            hasMatches && /* @__PURE__ */ jsxs(Stack, { gap: "xs", border: "top", paddingTop: "md", children: [
              /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", children: text.possibleMatches }),
              /* @__PURE__ */ jsx(Stack, { direction: "horizontal", gap: "sm", wrap: true, children: matches })
            ] }),
            /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", wrap: true, border: "top", paddingTop: "md", children: [
              /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", basis: "md", children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "text",
                  value: query,
                  onChange: (event) => setQuery(event.target.value),
                  placeholder: text.searchPlaceholder(suggestedPerson ? suggestedPerson.name : void 0)
                }
              ) }),
              externalSearch,
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  shrink: true,
                  onClick: () => {
                    const seed = participants.find((participant) => participant.email) ?? participants[0];
                    setNewName(suggestedPerson?.name ?? seed?.name ?? "");
                    setNewEmail(suggestedPerson?.email ?? seed?.email ?? "");
                    setCreateOpen(true);
                  },
                  children: text.addManually
                }
              )
            ] }),
            (results.length > 0 || searching) && /* @__PURE__ */ jsxs(List, { surface: "bordered", radius: "md", children: [
              searching && results.length === 0 && /* @__PURE__ */ jsx(ListItem, { padding: "md", textSize: "xs", tone: "soft", children: text.searching }),
              results.map((person) => /* @__PURE__ */ jsx(ListItem, { children: /* @__PURE__ */ jsx(
                InteractiveCard,
                {
                  display: "block",
                  radius: "none",
                  border: "none",
                  padding: "row",
                  textSize: "sm",
                  onClick: () => setPreview(person),
                  children: person.name
                }
              ) }, person.id))
            ] }),
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
          ] })
        ] })
      }
    ),
    picker ? null : (
      // Closed dialogs render nothing, so there is nothing to show while
      // the chunk loads.
      /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
        CallReconcileDialogs,
        {
          labels: text,
          participants,
          create: {
            open: createOpen,
            onOpenChange: setCreateOpen,
            name: newName,
            onNameChange: setNewName,
            email: newEmail,
            onEmailChange: setNewEmail,
            onSubmit: () => {
              const name = newName.trim();
              const email = newEmail.trim();
              setCreateOpen(false);
              onCreateAttach?.({ name, email: email || void 0 });
            }
          },
          preview: {
            open: preview !== null,
            content: preview ? renderPreview?.(preview, closePreview) : null,
            onClose: closePreview,
            onAttach: () => {
              const person = preview;
              setPreview(null);
              if (person) onAttach?.(person);
            }
          }
        }
      ) })
    )
  ] });
}

export {
  CallReconcileCard
};
