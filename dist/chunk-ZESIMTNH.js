import {
  CurrentCompanyLabel
} from "./chunk-XTAH2XJR.js";
import {
  useCandidateVoiceNote
} from "./chunk-S6VNT7YQ.js";
import {
  CandidateProfileLinkButton
} from "./chunk-MQMPVZLZ.js";
import {
  CandidateProfileHeader
} from "./chunk-BQ4XXGLP.js";
import {
  CandidateNoteCard,
  CandidateNoteComposer
} from "./chunk-LY3LKI5F.js";
import {
  ChoiceChips
} from "./chunk-P5VLMURO.js";
import {
  CandidateAssessmentPills,
  CandidateGradeBadge
} from "./chunk-VKM75OFW.js";
import {
  CandidateClientDecision
} from "./chunk-BSPHJDGR.js";
import {
  useDictationSupport
} from "./chunk-TR6R7XYB.js";
import {
  COARSE_POINTER_TOUCH_TARGET,
  COARSE_POINTER_TOUCH_TARGETS_WITHIN
} from "./chunk-YKEE5RQG.js";
import {
  useLatestCall
} from "./chunk-WMD6M2IP.js";
import {
  CandidateSummaryBullets
} from "./chunk-TFPDLQYX.js";

// src/recruit/candidate-shared-profile-sections.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Avatar, AvatarFallback } from "@epicbagel/saas-kit/primitives/avatar";
import { Callout } from "@epicbagel/saas-kit/primitives/callout";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { StickyNote, UserRound } from "lucide-react";
import { useId, useRef, useState } from "react";

// src/recruit/shared-profile-attributes.ts
function sharedProfileRootAttributes(props) {
  const attributes = {};
  for (const [name, value] of Object.entries(props)) {
    if (name === "id" || name === "style" || name.startsWith("data-") || name.startsWith("aria-")) {
      attributes[name] = value;
    }
  }
  return attributes;
}
var SHARED_PROFILE_WRAP = "[overflow-wrap:anywhere]";

// src/recruit/candidate-shared-profile-sections.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function present(value) {
  return value != null && value !== false && value !== "";
}
var candidateSharedProfileLabels = Object.freeze({
  anonymous: "Confidential candidate",
  anonymousReference: "this candidate",
  yearsExperience: (years) => `${years} ${years === 1 ? "yr" : "yrs"} experience`,
  people: (count) => `${count} people shared with you`,
  opening: (name) => `Opening ${name}\u2026`,
  anonymousPerson: (position) => `Candidate ${position}`,
  switchFailed: () => "That profile didn't open. Try again.",
  archivedTitle: "This profile is archived",
  archivedDescription: "Its link has stopped working for the people it was shared with.",
  voiceNote: "A note from your recruiter",
  voiceNotePlayer: "Recruiter voice note",
  note: (author) => author ? `Note from ${author}` : "A note for you",
  fit: (roleTitle) => present(roleTitle) ? /* @__PURE__ */ jsxs(Fragment, { children: [
    "Fit for ",
    roleTitle
  ] }) : "Fit",
  summary: "Profile",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  answer: "Your answer",
  answerReadOnly: "Answer",
  notes: "Your notes",
  notesReadOnly: "Notes",
  notesEmpty: Object.freeze({ title: "No notes yet" }),
  you: "You",
  noteInput: (name) => `Note about ${name}`,
  notePlaceholder: "Add a note",
  noteVoiceTitle: (name) => `Leave a note about ${name}`,
  noteDiscard: "Discard unsaved note",
  noteFailed: () => "That note didn't save. Try again.",
  noteTooLong: (maxLength) => `That note is over ${maxLength} characters. Shorten it to save it.`
});
function CandidateSharedProfileSection({
  title,
  titleLevel = 2,
  printVisibility = "visible",
  className,
  children,
  ...props
}) {
  const titleId = useId();
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      as: "section",
      "data-slot": "candidate-shared-profile-section",
      "aria-labelledby": titleId,
      gap: "compact",
      className: cn(SHARED_PROFILE_WRAP, printVisibility === "hidden" && "print:hidden", className),
      ...sharedProfileRootAttributes(props),
      children: [
        /* @__PURE__ */ jsx(Heading, { id: titleId, level: 3, as: `h${titleLevel}`, children: title }),
        children
      ]
    }
  );
}
function CandidateSharedProfileSwitcher({
  people,
  value,
  onChange,
  opening,
  error,
  anonymised = false,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const captionId = useId();
  const request = useLatestCall(onChange);
  if (people.length < 2 || !people.some((person) => person.id === value)) return null;
  const sharesName = (name) => people.filter((person) => person.name === name).length > 1;
  const shown = people.map((person, index) => ({
    id: person.id,
    name: anonymised ? text.anonymousPerson(index + 1) : sharesName(person.name) && person.detail ? `${person.name} \xB7 ${person.detail}` : person.name,
    avatar: anonymised ? void 0 : person.avatar
  }));
  const openingId = opening ?? request.pendingArgs?.[0] ?? null;
  const openingPerson = shown.find((person) => person.id === openingId);
  const failed = present(error) ? error : request.failure ? text.switchFailed(request.failure.cause) : null;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-shared-profile-switcher",
      "data-opening": openingId !== null || void 0,
      gap: "xs",
      className: cn(SHARED_PROFILE_WRAP, "print:hidden", className),
      ...sharedProfileRootAttributes(props),
      children: [
        /* @__PURE__ */ jsx(Text, { id: captionId, variant: "caption", "aria-live": "polite", children: openingPerson ? text.opening(openingPerson.name) : text.people(people.length) }),
        /* @__PURE__ */ jsx(
          ChoiceChips,
          {
            "aria-labelledby": captionId,
            chips: shown.map((person) => ({ id: person.id, label: person.name, leading: person.avatar })),
            value,
            disabled: !onChange,
            held: openingId !== null,
            onChange: request.run
          }
        ),
        failed !== null ? /* @__PURE__ */ jsx(Text, { size: "sm", tone: "destructive", role: "alert", children: failed }) : null
      ]
    }
  );
}
function WithheldAvatar() {
  return /* @__PURE__ */ jsx(Avatar, { size: "2xl", "aria-hidden": "true", children: /* @__PURE__ */ jsx(AvatarFallback, { children: /* @__PURE__ */ jsx(Icon, { icon: UserRound, size: "xl", tone: "muted" }) }) });
}
function CandidateSharedProfileHeader({
  person,
  anonymised = false,
  titleLevel = 1,
  padding,
  eyebrow,
  status,
  className,
  labels,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const name = anonymised ? void 0 : person.name?.trim() || void 0;
  const link = anonymised ? null : person.profileLink;
  const hasRole = present(person.title) || present(person.company);
  const hasFacts = present(person.location) || person.yearsExperience != null;
  return /* @__PURE__ */ jsx(
    CandidateProfileHeader,
    {
      ...sharedProfileRootAttributes(props),
      className: cn(SHARED_PROFILE_WRAP, className),
      padding,
      eyebrow,
      status,
      titleLevel,
      name: name ?? text.anonymous,
      cover: anonymised ? person.cover === null ? null : void 0 : person.cover,
      coverSeed: anonymised ? null : person.coverSeed,
      avatar: anonymised ? /* @__PURE__ */ jsx(WithheldAvatar, {}) : person.avatar,
      meta: hasRole || hasFacts ? /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
        hasRole ? /* @__PURE__ */ jsxs(Text, { variant: "small", tone: "soft", children: [
          person.title,
          present(person.title) && present(person.company) ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: " \xB7 " }) : null,
          present(person.company) ? /* @__PURE__ */ jsx(CurrentCompanyLabel, { company: person.company, size: "sm", tone: "inherit" }) : null
        ] }) : null,
        hasFacts ? /* @__PURE__ */ jsxs(Text, { variant: "caption", children: [
          person.location,
          present(person.location) && person.yearsExperience != null ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: " \xB7 " }) : null,
          person.yearsExperience != null ? text.yearsExperience(person.yearsExperience) : null
        ] }) : null
      ] }) : void 0,
      actionsPlacement: "aside",
      actions: link ? /* @__PURE__ */ jsx(
        CandidateProfileLinkButton,
        {
          href: link.href,
          title: link.title,
          icon: link.icon,
          className: cn("print:hidden", COARSE_POINTER_TOUCH_TARGET)
        }
      ) : void 0
    }
  );
}
function NativeAudio({ src, label }) {
  return /* @__PURE__ */ jsx(
    "audio",
    {
      src,
      "aria-label": label,
      controls: true,
      preload: "metadata",
      className: "max-w-full dark:[color-scheme:dark]"
    }
  );
}
function CandidateSharedProfileVoiceNote({
  src,
  transcript,
  titleLevel = 2,
  renderAudio = NativeAudio,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const words = transcript?.trim();
  return /* @__PURE__ */ jsx(
    CandidateSharedProfileSection,
    {
      "data-slot": "candidate-shared-profile-voice-note",
      title: text.voiceNote,
      titleLevel,
      printVisibility: words ? "visible" : "hidden",
      className,
      ...sharedProfileRootAttributes(props),
      children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
        /* @__PURE__ */ jsx(Stack, { gap: "none", align: "start", className: "print:hidden", children: renderAudio({ src, label: text.voiceNotePlayer }) }),
        words ? /* @__PURE__ */ jsx(Text, { variant: "small", tone: "muted", whitespace: "pre-line", children: words }) : null
      ] })
    }
  );
}
function CandidateSharedProfileNote({
  text: words,
  author,
  titleLevel = 2,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  return /* @__PURE__ */ jsx(
    CandidateSharedProfileSection,
    {
      "data-slot": "candidate-shared-profile-note",
      title: text.note(author?.trim() || void 0),
      titleLevel,
      className,
      ...sharedProfileRootAttributes(props),
      children: /* @__PURE__ */ jsx(Callout, { padding: "lg", children: /* @__PURE__ */ jsx(Text, { variant: "small", whitespace: "pre-line", children: words }) })
    }
  );
}
var PRINT_COLOURS = "[-webkit-print-color-adjust:exact] [print-color-adjust:exact]";
function CandidateSharedProfileFit({
  roleTitle,
  grade,
  assessmentTags,
  summary,
  evidence,
  groups,
  titleLevel = 2,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const groupId = useId();
  const graded = grade != null && (present(grade.grade) || present(grade.label));
  const lines = evidence ?? [];
  const lists = (groups ?? []).filter((group) => group.items.length > 0);
  if (!graded && !assessmentTags?.length && !present(summary) && lines.length === 0 && lists.length === 0) return null;
  return /* @__PURE__ */ jsx(
    CandidateSharedProfileSection,
    {
      "data-slot": "candidate-shared-profile-fit",
      title: text.fit(roleTitle),
      titleLevel,
      className: cn(PRINT_COLOURS, className),
      ...sharedProfileRootAttributes(props),
      children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
        /* @__PURE__ */ jsx(CandidateAssessmentPills, { tags: assessmentTags, children: graded ? /* @__PURE__ */ jsx(
          CandidateGradeBadge,
          {
            as: "span",
            shrink: true,
            grade: grade.grade,
            label: grade.label,
            labels: grade.labels,
            tone: grade.tone,
            showLabel: grade.showLabel,
            size: grade.size,
            format: grade.format ?? "inline",
            appearance: grade.appearance,
            sentiment: grade.sentiment,
            title: grade.title
          }
        ) : null }),
        present(summary) ? /* @__PURE__ */ jsx(Text, { variant: "small", whitespace: "pre-line", children: summary }) : null,
        lines.length > 0 ? /* @__PURE__ */ jsx(CandidateSummaryBullets, { bullets: lines, presentation: "body" }) : null,
        lists.map((group, index) => /* @__PURE__ */ jsxs(
          Stack,
          {
            as: "section",
            "data-slot": "candidate-shared-profile-fit-group",
            "aria-labelledby": `${groupId}-${index}`,
            gap: "sm",
            children: [
              /* @__PURE__ */ jsx(Heading, { id: `${groupId}-${index}`, level: 5, as: `h${titleLevel + 1}`, children: group.title }),
              /* @__PURE__ */ jsx(CandidateSummaryBullets, { bullets: group.items, presentation: "body" })
            ]
          },
          index
        ))
      ] })
    }
  );
}
function CandidateSharedProfileAnswer({
  candidateName,
  decision,
  reason,
  onDecide,
  reasonSuggestions,
  reasonOptional,
  reasonPrompt,
  reasonSheet,
  readOnly = false,
  disabled = false,
  titleLevel = 2,
  labels,
  decisionLabels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const titleId = useId();
  const answers = !readOnly && onDecide != null;
  return /* @__PURE__ */ jsxs(
    PanelSection,
    {
      "data-slot": "candidate-shared-profile-answer",
      "aria-labelledby": titleId,
      border: "top",
      className: cn(SHARED_PROFILE_WRAP, "print:hidden", COARSE_POINTER_TOUCH_TARGETS_WITHIN, className),
      ...sharedProfileRootAttributes(props),
      children: [
        /* @__PURE__ */ jsx(
          SectionHeader,
          {
            id: titleId,
            "aria-level": titleLevel,
            label: answers ? text.answer : text.answerReadOnly,
            spacing: "loose"
          }
        ),
        /* @__PURE__ */ jsx(
          CandidateClientDecision,
          {
            padding: "none",
            candidateName,
            decision,
            reason,
            readOnly: !answers,
            disabled,
            reasonOptional,
            reasonPrompt,
            reasonSheet,
            suggestions: reasonSuggestions,
            labels: decisionLabels,
            onDecide: async (choice, why) => {
              await onDecide?.(choice, why);
            }
          }
        )
      ]
    }
  );
}
function CandidateSharedProfileNotes({
  notes,
  candidateName,
  onAdd,
  readOnly = false,
  disabled = false,
  voice = true,
  maxLength,
  titleLevel = 2,
  labels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const writes = !readOnly && onAdd != null;
  const dictation = useDictationSupport();
  const [draft, setDraft] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [problem, setProblem] = useState(null);
  const [savingSpoken, setSavingSpoken] = useState(false);
  const spokenInFlight = useRef(false);
  const save = async (words) => {
    try {
      await onAdd?.(words);
      setDraft("");
      setRecovering(false);
      setProblem(null);
    } catch (cause) {
      setProblem(text.noteFailed(cause));
      throw cause;
    }
  };
  const recover = (words) => {
    setDraft(words);
    setRecovering(true);
  };
  const spoken = useCandidateVoiceNote({
    title: text.noteVoiceTitle(candidateName),
    onCommit: async (heard) => {
      const words = heard.trim();
      if (!words || spokenInFlight.current) return;
      if (maxLength != null && words.length > maxLength) {
        recover(words);
        setProblem(text.noteTooLong(maxLength));
        return;
      }
      spokenInFlight.current = true;
      setSavingSpoken(true);
      try {
        await save(words);
      } catch {
        recover(words);
      } finally {
        spokenInFlight.current = false;
        setSavingSpoken(false);
      }
    }
  });
  const composerReady = !voice || dictation !== null;
  const speaks = voice && dictation === true;
  const title = writes ? text.notes : text.notesReadOnly;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-shared-profile-notes",
      gap: "none",
      className: cn(SHARED_PROFILE_WRAP, "print:hidden", COARSE_POINTER_TOUCH_TARGETS_WITHIN, className),
      ...sharedProfileRootAttributes(props),
      children: [
        writes && speaks ? spoken.control : null,
        /* @__PURE__ */ jsxs(PanelSection, { "aria-label": title, border: "top", children: [
          /* @__PURE__ */ jsx(SectionHeader, { "aria-level": titleLevel, label: title, count: notes.length }),
          notes.length > 0 ? /* @__PURE__ */ jsx(Stack, { direction: "vertical", gap: "sm", marginTop: "md", children: notes.map((note) => /* @__PURE__ */ jsx(CandidateNoteCard, { author: note.author ?? text.you, date: note.date, text: note.text }, note.id)) }) : /* @__PURE__ */ jsx(
            EmptyState,
            {
              variant: "empty",
              size: "inline",
              icon: StickyNote,
              title: text.notesEmpty.title,
              description: text.notesEmpty.description ?? ""
            }
          ),
          writes && composerReady ? /* @__PURE__ */ jsx(
            CandidateNoteComposer,
            {
              value: draft,
              onValueChange: setDraft,
              editing: recovering ? true : void 0,
              onVoice: speaks ? spoken.open : void 0,
              onCancel: () => {
                setDraft("");
                setRecovering(false);
                setProblem(null);
              },
              onSubmit: save,
              disabled: disabled || savingSpoken,
              error: problem,
              maxLength,
              ...savingSpoken ? { "aria-busy": true } : null,
              labels: {
                input: text.noteInput(candidateName),
                placeholder: text.notePlaceholder,
                ...recovering ? { cancel: text.noteDiscard } : null
              }
            }
          ) : null
        ] })
      ]
    }
  );
}

export {
  sharedProfileRootAttributes,
  SHARED_PROFILE_WRAP,
  candidateSharedProfileLabels,
  CandidateSharedProfileSection,
  CandidateSharedProfileSwitcher,
  CandidateSharedProfileHeader,
  CandidateSharedProfileVoiceNote,
  CandidateSharedProfileNote,
  CandidateSharedProfileFit,
  CandidateSharedProfileAnswer,
  CandidateSharedProfileNotes
};
