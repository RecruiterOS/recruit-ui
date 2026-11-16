import {
  CandidateSharedProfileAnswer,
  CandidateSharedProfileFit,
  CandidateSharedProfileHeader,
  CandidateSharedProfileNote,
  CandidateSharedProfileNotes,
  CandidateSharedProfileSection,
  CandidateSharedProfileSwitcher,
  CandidateSharedProfileVoiceNote,
  SHARED_PROFILE_WRAP,
  candidateSharedProfileLabels,
  sharedProfileRootAttributes
} from "./chunk-MMLSC5OT.js";
import {
  CandidateProfile,
  CandidateProfileBody,
  CandidateProfileFooter
} from "./chunk-BQ4XXGLP.js";
import {
  useLatestCall
} from "./chunk-WMD6M2IP.js";
import {
  CandidateCareerHistoryTimeline
} from "./chunk-6AK4I7KG.js";

// src/recruit/candidate-shared-profile.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Callout } from "@epicbagel/saas-kit/primitives/callout";
import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Children } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PRINT_WITHOUT_CONTROLS = "print:[&_button]:hidden";
function present(value) {
  return value != null && value !== false && value !== "";
}
function CandidateSharedProfile({
  person,
  anonymised = false,
  eyebrow,
  people,
  personId,
  onPersonChange,
  openingPersonId,
  archived = false,
  voiceNote,
  note,
  fit,
  summary,
  experience,
  experienceOptions,
  education,
  skills,
  certifications,
  languages,
  children,
  decision,
  decisionReason,
  onDecide,
  reasonOptional,
  reasonSuggestions,
  reasonPrompt,
  reasonSheet,
  clientNotes,
  onAddNote,
  noteVoice,
  noteMaxLength,
  readOnly = false,
  credit,
  titleLevel = 1,
  renderAudio,
  labels,
  decisionLabels,
  className,
  ...props
}) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const switching = useLatestCall(onPersonChange);
  const opening = openingPersonId ?? switching.pendingArgs?.[0] ?? null;
  const held = opening !== null;
  const sectionLevel = Math.min(titleLevel + 1, 5);
  const roleLevel = Math.min(sectionLevel + 1, 6);
  const nameInWords = (anonymised ? "" : person.name?.trim()) || text.anonymousReference;
  const careerItems = experience ?? [];
  const educationRows = (education ?? []).filter((item) => present(item.title) || present(item.institution)).map((item) => ({
    title: present(item.title) ? item.title : item.institution,
    company: present(item.title) && present(item.institution) ? item.institution : void 0,
    dateRange: present(item.date) ? item.date : void 0
  }));
  const skillTags = (skills ?? []).filter(present);
  const certificationLines = (certifications ?? []).filter(present);
  const languageLines = (languages ?? []).filter(present);
  const hasFit = fit != null && (fit.grade != null && (present(fit.grade.grade) || present(fit.grade.label)) || present(fit.summary) || (fit.evidence?.length ?? 0) > 0 || (fit.groups ?? []).some((group) => group.items.length > 0));
  const recording = voiceNote != null && voiceNote.src.trim() !== "" ? voiceNote : null;
  const writtenNote = note != null && note.text.trim() !== "" ? note : null;
  const hasBody = recording !== null || writtenNote !== null || hasFit || present(summary) || careerItems.length > 0 || educationRows.length > 0 || skillTags.length > 0 || certificationLines.length > 0 || languageLines.length > 0 || // An empty list of the host's own sections is no section.
  Children.toArray(children).length > 0;
  const answered = decision === "yes" || decision === "no";
  const showsAnswer = onDecide != null || answered;
  const notes = clientNotes ?? [];
  const showsNotes = onAddNote != null || notes.length > 0;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      "data-slot": "candidate-shared-profile",
      "data-anonymised": anonymised || void 0,
      "data-archived": archived || void 0,
      gap: "md",
      width: "full",
      className: cn(SHARED_PROFILE_WRAP, className),
      ...sharedProfileRootAttributes(props),
      children: [
        present(eyebrow) ? /* @__PURE__ */ jsx(Text, { variant: "eyebrow", children: eyebrow }) : null,
        people && personId != null ? /* @__PURE__ */ jsx(
          CandidateSharedProfileSwitcher,
          {
            people,
            value: personId,
            onChange: onPersonChange ? switching.run : void 0,
            opening,
            error: switching.failure ? text.switchFailed(switching.failure.cause) : void 0,
            anonymised,
            labels
          }
        ) : null,
        archived ? /* @__PURE__ */ jsx(Stack, { "data-slot": "candidate-shared-profile-archived", gap: "none", className: "print:hidden", children: /* @__PURE__ */ jsx(Callout, { tone: "warning", padding: "lg", children: /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsx(Text, { weight: "semibold", children: text.archivedTitle }),
          present(text.archivedDescription) ? /* @__PURE__ */ jsx(Text, { variant: "small", tone: "muted", children: text.archivedDescription }) : null
        ] }) }) }) : null,
        /* @__PURE__ */ jsx(
          Stack,
          {
            gap: "none",
            width: "full",
            opacity: archived ? "soft" : "full",
            "aria-busy": held || void 0,
            className: "print:opacity-100",
            children: /* @__PURE__ */ jsxs(
              CandidateProfile,
              {
                printMode: "flat",
                header: /* @__PURE__ */ jsx(
                  CandidateSharedProfileHeader,
                  {
                    person,
                    anonymised,
                    titleLevel,
                    labels
                  }
                ),
                footer: present(credit) ? /* @__PURE__ */ jsx(CandidateProfileFooter, { justify: "center", padding: "compact", printVisibility: "hidden", children: /* @__PURE__ */ jsx(Text, { variant: "caption", children: credit }) }) : void 0,
                children: [
                  hasBody ? /* @__PURE__ */ jsx(CandidateProfileBody, { children: /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
                    recording !== null ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileVoiceNote,
                      {
                        src: recording.src,
                        transcript: recording.transcript,
                        titleLevel: sectionLevel,
                        renderAudio,
                        labels
                      }
                    ) : null,
                    writtenNote !== null ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileNote,
                      {
                        text: writtenNote.text,
                        author: writtenNote.author,
                        titleLevel: sectionLevel,
                        labels
                      }
                    ) : null,
                    fit != null ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileFit,
                      {
                        roleTitle: fit.roleTitle,
                        grade: fit.grade,
                        summary: fit.summary,
                        evidence: fit.evidence,
                        groups: fit.groups,
                        titleLevel: sectionLevel,
                        labels
                      }
                    ) : null,
                    present(summary) ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-summary",
                        title: text.summary,
                        titleLevel: sectionLevel,
                        children: /* @__PURE__ */ jsx(Text, { variant: "small", whitespace: "pre-line", children: summary })
                      }
                    ) : null,
                    careerItems.length > 0 ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-experience",
                        title: text.experience,
                        titleLevel: sectionLevel,
                        className: PRINT_WITHOUT_CONTROLS,
                        children: /* @__PURE__ */ jsx(
                          CandidateCareerHistoryTimeline,
                          {
                            items: careerItems,
                            detailedCompanyGroups: experienceOptions?.detailedCompanyGroups,
                            earlierLabel: experienceOptions?.earlierLabel,
                            presentLabel: experienceOptions?.presentLabel,
                            locale: experienceOptions?.locale,
                            titleLevel: roleLevel
                          }
                        )
                      }
                    ) : null,
                    educationRows.length > 0 ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-education",
                        title: text.education,
                        titleLevel: sectionLevel,
                        children: /* @__PURE__ */ jsx(
                          CandidateCareerHistoryTimeline,
                          {
                            items: educationRows,
                            detailedCompanyGroups: educationRows.length,
                            titleLevel: roleLevel
                          }
                        )
                      }
                    ) : null,
                    skillTags.length > 0 ? /* @__PURE__ */ jsx(
                      CandidateSharedProfileSection,
                      {
                        "data-slot": "candidate-shared-profile-skills",
                        title: text.skills,
                        titleLevel: sectionLevel,
                        children: /* @__PURE__ */ jsx(Stack, { as: "ul", role: "list", direction: "horizontal", gap: "sm", wrap: true, children: skillTags.map((skill, index) => /* @__PURE__ */ jsx(Badge, { as: "li", variant: "neutral", children: skill }, index)) })
                      }
                    ) : null,
                    certificationLines.length > 0 || languageLines.length > 0 ? /* @__PURE__ */ jsxs(Grid, { columns: 2, gap: "lg", children: [
                      certificationLines.length > 0 ? /* @__PURE__ */ jsx(
                        CandidateSharedProfileSection,
                        {
                          "data-slot": "candidate-shared-profile-certifications",
                          title: text.certifications,
                          titleLevel: sectionLevel,
                          children: /* @__PURE__ */ jsx(List, { marker: "disc", spacing: "tight", textSize: "sm", children: certificationLines.map((line, index) => /* @__PURE__ */ jsx(ListItem, { children: line }, index)) })
                        }
                      ) : null,
                      languageLines.length > 0 ? /* @__PURE__ */ jsx(
                        CandidateSharedProfileSection,
                        {
                          "data-slot": "candidate-shared-profile-languages",
                          title: text.languages,
                          titleLevel: sectionLevel,
                          children: /* @__PURE__ */ jsx(List, { marker: "disc", spacing: "tight", textSize: "sm", children: languageLines.map((line, index) => /* @__PURE__ */ jsx(ListItem, { children: line }, index)) })
                        }
                      ) : null
                    ] }) : null,
                    children
                  ] }) }) : null,
                  showsAnswer ? /* @__PURE__ */ jsx(
                    CandidateSharedProfileAnswer,
                    {
                      candidateName: nameInWords,
                      decision,
                      reason: decisionReason,
                      onDecide,
                      reasonOptional,
                      reasonSuggestions,
                      reasonPrompt,
                      reasonSheet,
                      readOnly,
                      disabled: held,
                      titleLevel: sectionLevel,
                      labels,
                      decisionLabels
                    },
                    `answer:${personId ?? ""}`
                  ) : null,
                  showsNotes ? /* @__PURE__ */ jsx(
                    CandidateSharedProfileNotes,
                    {
                      notes,
                      candidateName: nameInWords,
                      onAdd: onAddNote,
                      readOnly,
                      disabled: held,
                      voice: noteVoice,
                      maxLength: noteMaxLength,
                      titleLevel: sectionLevel,
                      labels
                    },
                    `notes:${personId ?? ""}`
                  ) : null
                ]
              }
            )
          }
        )
      ]
    }
  );
}

export {
  CandidateSharedProfile
};
