import {
  ChoiceChips
} from "./chunk-P5VLMURO.js";

// src/recruit/candidate-share-dialog.tsx
import { Alert, AlertDescription } from "@epicbagel/saas-kit/primitives/alert";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle
} from "@epicbagel/saas-kit/primitives/field";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { RadioGroup, RadioGroupItem } from "@epicbagel/saas-kit/primitives/radio-group";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@epicbagel/saas-kit/primitives/tabs";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var candidateShareDialogLabels = Object.freeze({
  title: (name) => `Share ${name}`,
  description: "",
  reason: "Your reason",
  audience: "Who is this link for?",
  liveBadge: "Live",
  live: "A link for them is already live. Stop sharing it to make a new one.",
  visibility: "How they appear",
  named: "Named",
  namedDescription: "Shows their name and photo.",
  anonymised: "Anonymised",
  anonymisedDescription: "Leaves out their name and photo.",
  note: "A note for them",
  noteDescription: "Optional. It shows above the profile.",
  notePlaceholder: "Why should they meet this person?",
  noteFormat: "Note format",
  voiceNote: "Voice note",
  writtenNote: "Written note",
  link: "Link",
  create: (copies) => copies ? "Create and copy link" : "Create link",
  update: (copies) => copies ? "Save and copy link" : "Save changes",
  sharing: "Creating link\u2026",
  ready: "Your link is ready.",
  copy: "Copy",
  copied: "Copied",
  linkCopied: "Link copied.",
  copyFailed: "Copying didn't work in this browser. The link is selected, so you can copy it yourself.",
  done: "Done",
  failed: () => "That link couldn't be made. Try again."
});
function candidateShareLinkText(url, maxLength = 36) {
  const text = url.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
  return text.length > maxLength ? `${text.slice(0, Math.max(1, maxLength - 1))}\u2026` : text;
}
var NO_AUDIENCES = [];
var INACTIVE_PANEL = "data-[state=inactive]:hidden";
function present(value) {
  return value != null && value !== false && value !== "";
}
function clipboard() {
  return typeof navigator === "undefined" ? void 0 : navigator.clipboard;
}
function writeLink(link) {
  const target = clipboard();
  if (!target?.writeText) return Promise.resolve(false);
  try {
    return target.writeText(link).then(
      () => true,
      () => false
    );
  } catch {
    return Promise.resolve(false);
  }
}
function writeLinkWhenMade(link) {
  const later = () => link.then(writeLink, () => false);
  const target = clipboard();
  if (!target) return link.then(() => false, () => false);
  if (typeof ClipboardItem !== "undefined" && typeof target.write === "function") {
    const blob = link.then((value) => new Blob([value], { type: "text/plain" }));
    blob.catch(() => void 0);
    try {
      return target.write([new ClipboardItem({ "text/plain": blob })]).then(() => true, later);
    } catch {
    }
  }
  return later();
}
function firstAudience(audiences) {
  return (audiences.find((audience) => !audience.live) ?? audiences[0])?.id;
}
function resolveChoices(own, held, audiences, anonymisable) {
  const audience = held?.audience ?? own.audience;
  return {
    audience: audiences.some((candidate) => candidate.id === audience) ? audience : firstAudience(audiences),
    anonymised: anonymisable && Boolean(held?.anonymised ?? own.anonymised),
    note: held?.note ?? own.note ?? ""
  };
}
function CandidateShareDialog(props) {
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(props.open);
  if (props.open !== wasOpen) {
    setWasOpen(props.open);
    if (props.open) setSession(session + 1);
  }
  return /* @__PURE__ */ jsx(ShareDialogSession, { ...props }, session);
}
function ShareDialogSession({
  open,
  onOpenChange,
  candidateName,
  avatar,
  headline,
  reason,
  audiences = NO_AUDIENCES,
  anonymisable = false,
  note: takesNote = false,
  noteMaxLength,
  recorder,
  defaultNoteFormat = "voice",
  choices: heldChoices,
  defaultChoices,
  onChoicesChange,
  url,
  onShare,
  copyOnShare = false,
  waitingFor,
  error,
  labels
}) {
  const text = { ...candidateShareDialogLabels, ...labels };
  const described = present(text.description);
  const id = useId();
  const [ownChoices, setOwnChoices] = useState(defaultChoices ?? {});
  const choices = resolveChoices(ownChoices, heldChoices, audiences, anonymisable);
  const [madeLink, setMadeLink] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [failure, setFailure] = useState(null);
  const [copy, setCopy] = useState("idle");
  const [noteFormat, setNoteFormat] = useState(defaultNoteFormat);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const copyButton = useRef(null);
  const linkField = useRef(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (copy !== "copied") return;
    const timer = window.setTimeout(() => setCopy("idle"), 2e3);
    return () => window.clearTimeout(timer);
  }, [copy]);
  useEffect(() => {
    if (madeLink !== null) copyButton.current?.focus();
  }, [madeLink]);
  useEffect(() => {
    if (copy !== "refused") return;
    linkField.current?.focus();
    linkField.current?.select();
  }, [copy]);
  const link = madeLink ?? (url?.trim() || null);
  const result = madeLink !== null || onShare == null && link !== null;
  const audience = audiences.find((candidate) => candidate.id === choices.audience);
  const taken = audience?.live === true && link === null;
  const waiting = present(waitingFor);
  const canShare = onShare != null && !waiting && !taken && audience?.ready !== false;
  const change = (patch) => {
    const next = { ...choices, ...patch };
    setOwnChoices(next);
    setFailure(null);
    onChoicesChange?.(next);
  };
  const share = () => {
    if (!onShare || !canShare || inFlight.current) return;
    setFailure(null);
    let made;
    try {
      made = onShare({ ...choices, note: choices.note.trim() });
    } catch (cause) {
      setFailure({ cause });
      return;
    }
    const making = Promise.resolve(made).then(
      (value) => typeof value === "string" && value.trim() ? value.trim() : null
    );
    const copying = copyOnShare ? writeLinkWhenMade(making.then((value) => value ?? Promise.reject(new Error("no link")))) : Promise.resolve(false);
    inFlight.current = true;
    setSharing(true);
    making.then(async (value) => ({ value, copied: value !== null && await copying })).then(
      ({ value, copied }) => {
        inFlight.current = false;
        if (!mounted.current) return;
        setSharing(false);
        if (value === null) {
          onOpenChange(false);
          return;
        }
        setMadeLink(value);
        setCopy(copied ? "copied" : "idle");
      },
      (cause) => {
        inFlight.current = false;
        if (!mounted.current) return;
        setSharing(false);
        setFailure({ cause });
      }
    );
  };
  const copyLink = () => {
    if (link === null) return;
    void writeLink(link).then((copied) => {
      if (mounted.current) setCopy(copied ? "copied" : "refused");
    });
  };
  const audienceTitleId = `${id}-audience`;
  const visibilityTitleId = `${id}-visibility`;
  const noteTitleId = `${id}-note`;
  const noteDescriptionId = `${id}-note-description`;
  const linkTitleId = `${id}-link`;
  const noteDescribed = present(text.noteDescription);
  const said = copy === "refused" ? text.copyFailed : copy === "copied" ? text.linkCopied : result ? text.ready : "";
  const noteField = /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
    /* @__PURE__ */ jsx(
      Textarea,
      {
        "aria-labelledby": noteTitleId,
        "aria-describedby": noteDescribed ? noteDescriptionId : void 0,
        value: choices.note,
        onChange: (event) => change({ note: event.target.value }),
        rows: 4,
        maxLength: noteMaxLength,
        placeholder: text.notePlaceholder,
        disabled: sharing
      }
    ),
    noteDescribed ? /* @__PURE__ */ jsx(Text, { id: noteDescriptionId, size: "sm", tone: "muted", children: text.noteDescription }) : null
  ] });
  const linkBlock = link !== null ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-share-dialog-link", gap: "none", children: [
    /* @__PURE__ */ jsx(SectionHeader, { id: linkTitleId, label: text.link }),
    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "center", surface: "muted", radius: "lg", padding: "control", children: [
      /* @__PURE__ */ jsx(Icon, { icon: Link2, size: "md", tone: "muted" }),
      /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: copy === "refused" ? /* @__PURE__ */ jsx(
        Input,
        {
          ref: linkField,
          readOnly: true,
          value: link,
          "aria-labelledby": linkTitleId,
          controlSize: "sm",
          selectOnFocus: true
        }
      ) : /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", size: "sm", display: "block", truncate: true, title: link, children: candidateShareLinkText(link) }) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          ref: copyButton,
          type: "button",
          variant: result ? "default" : "outline",
          size: "sm",
          shrink: false,
          onClick: copyLink,
          children: [
            /* @__PURE__ */ jsx(Icon, { icon: copy === "copied" ? Check : Copy, size: "sm" }),
            copy === "copied" ? text.copied : text.copy
          ]
        }
      )
    ] })
  ] }) : null;
  return /* @__PURE__ */ jsx(ResponsiveDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(ResponsiveDialogContent, { ...described ? {} : { "aria-describedby": void 0 }, children: [
    /* @__PURE__ */ jsxs(ResponsiveDialogHeader, { children: [
      /* @__PURE__ */ jsx(ResponsiveDialogTitle, { children: text.title(candidateName) }),
      described ? /* @__PURE__ */ jsx(ResponsiveDialogDescription, { children: text.description }) : null
    ] }),
    /* @__PURE__ */ jsx(ResponsiveDialogBody, { "data-slot": "candidate-share-dialog", "data-view": result ? "result" : "compose", children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", className: "[overflow-wrap:anywhere]", children: [
      present(avatar) || present(headline) || present(reason) ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-share-dialog-summary", gap: "md", children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "md", align: "center", children: [
          avatar,
          /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
            /* @__PURE__ */ jsx(Text, { size: "sm", weight: "semibold", truncate: true, children: candidateName }),
            present(headline) ? /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", truncate: true, children: headline }) : null
          ] })
        ] }),
        present(reason) ? /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", children: text.reason }),
          /* @__PURE__ */ jsx(Text, { size: "sm", children: reason })
        ] }) : null
      ] }) : null,
      result ? null : /* @__PURE__ */ jsxs(Fragment, { children: [
        audiences.length > 0 && choices.audience !== void 0 ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-share-dialog-audience", gap: "sm", children: [
          /* @__PURE__ */ jsx(SectionHeader, { id: audienceTitleId, label: text.audience, spacing: "none" }),
          /* @__PURE__ */ jsx(
            ChoiceChips,
            {
              "aria-labelledby": audienceTitleId,
              chips: audiences.map((candidate) => ({
                id: candidate.id,
                label: candidate.label,
                trailing: candidate.live ? /* @__PURE__ */ jsx(Badge, { as: "span", variant: "success", size: "micro", children: text.liveBadge }) : void 0
              })),
              value: choices.audience,
              disabled: sharing,
              onChange: (next) => change({ audience: next })
            }
          ),
          taken ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: present(audience?.liveDescription) ? audience?.liveDescription : text.live }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            present(audience?.description) ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: audience?.description }) : null,
            audience?.fields
          ] })
        ] }) : null,
        anonymisable && !taken ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-share-dialog-visibility", gap: "sm", children: [
          /* @__PURE__ */ jsx(SectionHeader, { id: visibilityTitleId, label: text.visibility, spacing: "none" }),
          /* @__PURE__ */ jsx(
            RadioGroup,
            {
              "aria-labelledby": visibilityTitleId,
              value: choices.anonymised ? "anonymised" : "named",
              onValueChange: (next) => change({ anonymised: next === "anonymised" }),
              disabled: sharing,
              children: ["named", "anonymised"].map((option) => (
                // The label makes the whole card the target. The radio
                // is named by the title and described by the line under
                // it outright, not left to how a browser reads a label
                // that wraps a group.
                /* @__PURE__ */ jsx(FieldLabel, { htmlFor: `${id}-${option}`, children: /* @__PURE__ */ jsxs(Field, { orientation: "horizontal", children: [
                  /* @__PURE__ */ jsxs(FieldContent, { children: [
                    /* @__PURE__ */ jsx(FieldTitle, { id: `${id}-${option}-title`, children: option === "named" ? text.named : text.anonymised }),
                    /* @__PURE__ */ jsx(FieldDescription, { id: `${id}-${option}-description`, children: option === "named" ? text.namedDescription : text.anonymisedDescription })
                  ] }),
                  /* @__PURE__ */ jsx(
                    RadioGroupItem,
                    {
                      value: option,
                      id: `${id}-${option}`,
                      "aria-labelledby": `${id}-${option}-title`,
                      "aria-describedby": `${id}-${option}-description`
                    }
                  )
                ] }) }, option)
              ))
            }
          )
        ] }) : null,
        (takesNote || present(recorder)) && !taken ? /* @__PURE__ */ jsxs(Stack, { "data-slot": "candidate-share-dialog-note", gap: "sm", children: [
          /* @__PURE__ */ jsx(SectionHeader, { id: noteTitleId, label: text.note, spacing: "none" }),
          takesNote && present(recorder) ? /* @__PURE__ */ jsxs(
            Tabs,
            {
              value: noteFormat,
              onValueChange: (next) => setNoteFormat(next === "written" ? "written" : "voice"),
              children: [
                /* @__PURE__ */ jsxs(TabsList, { "aria-label": text.noteFormat, children: [
                  /* @__PURE__ */ jsx(TabsTrigger, { value: "voice", padding: "md", children: text.voiceNote }),
                  /* @__PURE__ */ jsx(TabsTrigger, { value: "written", padding: "md", children: text.writtenNote })
                ] }),
                /* @__PURE__ */ jsx(TabsContent, { value: "voice", marginTop: "md", forceMount: true, className: INACTIVE_PANEL, children: recorder }),
                /* @__PURE__ */ jsx(TabsContent, { value: "written", marginTop: "md", forceMount: true, className: INACTIVE_PANEL, children: noteField })
              ]
            }
          ) : takesNote ? noteField : recorder
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs(Stack, { gap: "none", className: link === null ? "sr-only" : void 0, children: [
        linkBlock,
        /* @__PURE__ */ jsx(
          Text,
          {
            role: "status",
            size: "sm",
            tone: copy === "refused" ? "destructive" : "muted",
            marginTop: said ? "sm" : "none",
            children: said
          }
        )
      ] }),
      failure || present(error) ? /* @__PURE__ */ jsx(Alert, { variant: "destructive", role: "alert", children: /* @__PURE__ */ jsx(AlertDescription, { children: failure ? text.failed(failure.cause) : error }) }) : null
    ] }) }),
    /* @__PURE__ */ jsx(ResponsiveDialogFooter, { layout: "fill", children: result ? /* @__PURE__ */ jsx(ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", children: text.done }) }) : /* @__PURE__ */ jsx(Button, { type: "button", onClick: share, disabled: !canShare || sharing, "aria-busy": sharing || void 0, children: sharing ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "md", spin: true }),
      text.sharing
    ] }) : waiting ? waitingFor : link !== null ? text.update(copyOnShare) : text.create(copyOnShare) }) })
  ] }) });
}

export {
  candidateShareDialogLabels,
  candidateShareLinkText,
  CandidateShareDialog
};
