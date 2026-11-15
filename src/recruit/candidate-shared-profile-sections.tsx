"use client";

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
import { useId, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

import {
  CandidateClientDecision,
  type CandidateClientDecisionLabels,
  type CandidateClientDecisionProps,
} from "./candidate-client-decision";
import type { CandidateCoverSeed } from "./candidate-cover-header";
import type { CandidateDecisionChoice } from "./candidate-decision-buttons";
import type { CandidateEmptyCopy } from "./candidate-empty-copy";
import { CandidateGradeBadge, type CandidateGradeBadgeProps } from "./candidate-grade";
import { CandidateNoteCard, CandidateNoteComposer } from "./candidate-notes";
import { CandidateSummaryBullets, type CandidateSummaryBullet } from "./candidate-pipeline-list";
import type { CandidatePresentationRecorderAudio } from "./candidate-presentation-recorder";
import {
  CandidateProfileHeader,
  type CandidateProfileHeaderProps,
  type CandidateProfileHeaderTitleLevel,
} from "./candidate-profile";
import { CandidateProfileLinkButton } from "./candidate-profile-link-button";
import { useCandidateVoiceNote } from "./candidate-voice-note";
import { ChoiceChips } from "./choice-chips";
import { CurrentCompanyLabel } from "./current-company-label";
import { useDictationSupport } from "./dictation-support";
import { useLatestCall } from "./pending-action";
import { SHARED_PROFILE_WRAP, sharedProfileRootAttributes } from "./shared-profile-attributes";
import { COARSE_POINTER_TOUCH_TARGET, COARSE_POINTER_TOUCH_TARGETS_WITHIN } from "./touch-targets";

/**
 * The fixed words of a candidate's shared profile, and of each section of
 * it. A section reads only the ones it shows; pass `labels` to change any.
 */
export interface CandidateSharedProfileLabels {
  /** The heading of a profile that names nobody: an anonymised one, or one with no name. */
  anonymous: string;
  /** The same person inside a sentence, such as the question a Yes asks ("Yes to this candidate"). */
  anonymousReference: string;
  /** Under the name, given how many years. */
  yearsExperience: (years: number) => ReactNode;
  /** The switcher's caption, given how many people it holds. */
  people: (count: number) => string;
  /** The switcher's caption while another person's page is on its way, given their name. */
  opening: (name: string) => string;
  /** A person in the switcher of an anonymised profile, given their place in it, from 1. */
  anonymousPerson: (position: number) => string;
  /** Under the switcher when a profile didn't open, given what the host's promise rejected with. */
  switchFailed: (cause: unknown) => string;
  /** The notice over an archived profile. */
  archivedTitle: ReactNode;
  /** The line under it. */
  archivedDescription: ReactNode;
  /** The heading over the spoken note. */
  voiceNote: ReactNode;
  /** The spoken note's player, named for a screen reader. */
  voiceNotePlayer: string;
  /** The heading over the written note, given who wrote it, if the host said. */
  note: (author?: string) => ReactNode;
  /** The heading over the fit, given the role it is a fit for, if the host said. */
  fit: (roleTitle?: ReactNode) => ReactNode;
  /** The headings over the profile's own sections. */
  summary: ReactNode;
  experience: ReactNode;
  education: ReactNode;
  skills: ReactNode;
  certifications: ReactNode;
  languages: ReactNode;
  /** The heading over the reader's Yes or No. */
  answer: ReactNode;
  /** The same heading where the answer is only shown, to someone who isn't the reader. */
  answerReadOnly: ReactNode;
  /** The heading over the reader's own notes, which also names the section. */
  notes: string;
  /** The same heading where the notes are only shown. */
  notesReadOnly: string;
  /** A notes section with nothing in it. */
  notesEmpty: CandidateEmptyCopy;
  /** Who a note is from when the host names nobody: the reader. */
  you: string;
  /** The note field, named for a screen reader, given who the note is about. */
  noteInput: (name: string) => string;
  /** The note field, while it is empty. */
  notePlaceholder: string;
  /** The dictation overlay's title, given who the note is about. */
  noteVoiceTitle: (name: string) => string;
  /** Cancel's wording while the composer holds a spoken note that didn't save. */
  noteDiscard: string;
  /** A note that didn't save, given what the host's promise rejected with. */
  noteFailed: (cause: unknown) => string;
  /** A spoken note longer than the field takes, given how long that is. It is put in the field to shorten. */
  noteTooLong: (maxLength: number) => string;
}

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

/** The default wording of a candidate's shared profile. Pass `labels` to change any of it. */
export const candidateSharedProfileLabels: Readonly<CandidateSharedProfileLabels> = Object.freeze({
  anonymous: "Confidential candidate",
  anonymousReference: "this candidate",
  yearsExperience: (years: number) => `${years} ${years === 1 ? "yr" : "yrs"} experience`,
  people: (count: number) => `${count} people shared with you`,
  opening: (name: string) => `Opening ${name}…`,
  anonymousPerson: (position: number) => `Candidate ${position}`,
  switchFailed: () => "That profile didn't open. Try again.",
  archivedTitle: "This profile is archived",
  archivedDescription: "Its link has stopped working for the people it was shared with.",
  voiceNote: "A note from your recruiter",
  voiceNotePlayer: "Recruiter voice note",
  note: (author?: string) => (author ? `Note from ${author}` : "A note for you"),
  fit: (roleTitle?: ReactNode) => (present(roleTitle) ? <>Fit for {roleTitle}</> : "Fit"),
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
  noteInput: (name: string) => `Note about ${name}`,
  notePlaceholder: "Add a note",
  noteVoiceTitle: (name: string) => `Leave a note about ${name}`,
  noteDiscard: "Discard unsaved note",
  noteFailed: () => "That note didn't save. Try again.",
  noteTooLong: (maxLength: number) => `That note is over ${maxLength} characters. Shorten it to save it.`,
});

/* ---------- what reaches the page ---------- */

/**
 * What a host may put on the root of a shared profile, or of a section of
 * it: where it sits and how it is found. `data-` and `aria-` attributes are
 * taken too. Anything else handed to a root is dropped, not written into
 * the page: these are opened by people outside the host's organisation,
 * and a field spread in by mistake, off a record or a view model, would
 * otherwise be there to read in the page's source.
 */
export interface CandidateSharedProfileRootProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/* ---------- a section ---------- */

/** A section's heading level: 2 under a profile whose name is the page's h1, or deeper to fit the page's outline. */
export type CandidateSharedProfileSectionLevel = 2 | 3 | 4 | 5;

export interface CandidateSharedProfileSectionProps extends CandidateSharedProfileRootProps {
  /** The section's heading, which also names it. */
  title: ReactNode;
  /** The heading's level: 2 (the default), or 3 to 5 to fit the page's outline. Only the tag changes. */
  titleLevel?: CandidateSharedProfileSectionLevel;
  /** `hidden` leaves the section off a printed profile. */
  printVisibility?: "visible" | "hidden";
  children?: ReactNode;
}

/**
 * One titled section of a shared profile: a heading over whatever the host
 * puts under it. The profile's own sections are built on it, and a host adds
 * its own with it so they sit and print alike.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="candidate-shared-profile-section"`, unless the caller passes
 * its own `data-slot`. Like every root in a shared profile, it takes an id,
 * a class, a style and `data-` and `aria-` attributes, and drops anything
 * else it is handed.
 */
export function CandidateSharedProfileSection({
  title,
  titleLevel = 2,
  printVisibility = "visible",
  className,
  children,
  ...props
}: CandidateSharedProfileSectionProps) {
  const titleId = useId();

  return (
    <Stack
      as="section"
      data-slot="candidate-shared-profile-section"
      aria-labelledby={titleId}
      gap="compact"
      className={cn(SHARED_PROFILE_WRAP, printVisibility === "hidden" && "print:hidden", className)}
      {...sharedProfileRootAttributes(props)}
    >
      {/* The card-title look at every level: only the tag changes. */}
      <Heading id={titleId} level={3} as={`h${titleLevel}` as const}>
        {title}
      </Heading>
      {children}
    </Stack>
  );
}

/* ---------- the people one link shares ---------- */

/** One of the people a link shares, as the switcher shows them. */
export interface CandidateSharedProfilePersonOption {
  /** Tells the person from the others, and tells the host who was picked. */
  id: string;
  /** Their name: the chip's words. */
  name: string;
  /** Tells apart two people with one name, such as their company. Shown only for those two. */
  detail?: string;
  /** Their face, usually the kit's PersonAvatar at 20px. The name beside it is what a screen reader says. */
  avatar?: ReactNode;
}

export interface CandidateSharedProfileSwitcherProps extends CandidateSharedProfileRootProps {
  /** The people the link shares, in its order. */
  people: readonly CandidateSharedProfilePersonOption[];
  /** The person whose profile is showing: the pressed chip. */
  value: string;
  /**
   * Called with the person picked. The host shows their profile. While a
   * promise it returns is pending the caption says who is opening and the
   * chips are held; if it rejects, a line under them says so
   * (`labels.switchFailed`). Without it the chips can't be pressed.
   */
  onChange?: (id: string) => unknown;
  /**
   * The person whose profile is on its way, for a host that knows it some
   * other way than a promise from `onChange`, such as a route that has
   * changed and not yet loaded.
   */
  opening?: string | null;
  /** A line under the chips, for a host that knows a profile didn't open some other way than that promise. */
  error?: ReactNode;
  /**
   * Names nobody: each chip says its place in the row
   * (`labels.anonymousPerson`) and shows no face, whatever `people` holds.
   */
  anonymised?: boolean;
  labels?: Partial<CandidateSharedProfileLabels>;
}

/**
 * The people one link shares, as a row of chips that switches between their
 * profiles: for a link that shares a shortlist, not one person.
 *
 * The host owns the people, which is showing and what switching does (a
 * route change, usually): the component fetches nothing. Two people with one
 * name are told apart by their `detail`. With fewer than two people, or when
 * `value` isn't one of them, it draws nothing.
 *
 * The root is marked `data-slot="candidate-shared-profile-switcher"`, with
 * `data-opening` while a profile is opening. The chips are toggle buttons in
 * a group named by the caption above them, which is read out as it changes.
 * While a profile opens they are held, not disabled outright, so the
 * keyboard's focus stays on the chip that was pressed. It isn't printed.
 */
export function CandidateSharedProfileSwitcher({
  people,
  value,
  onChange,
  opening,
  error,
  anonymised = false,
  labels,
  className,
  ...props
}: CandidateSharedProfileSwitcherProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const captionId = useId();
  const request = useLatestCall(onChange);

  if (people.length < 2 || !people.some((person) => person.id === value)) return null;

  const sharesName = (name: string) => people.filter((person) => person.name === name).length > 1;
  const shown = people.map((person, index) => ({
    id: person.id,
    name: anonymised
      ? text.anonymousPerson(index + 1)
      : sharesName(person.name) && person.detail
        ? `${person.name} · ${person.detail}`
        : person.name,
    avatar: anonymised ? undefined : person.avatar,
  }));
  const openingId = opening ?? request.pendingArgs?.[0] ?? null;
  const openingPerson = shown.find((person) => person.id === openingId);
  const failed = present(error) ? error : request.failure ? text.switchFailed(request.failure.cause) : null;

  return (
    <Stack
      data-slot="candidate-shared-profile-switcher"
      data-opening={openingId !== null || undefined}
      gap="xs"
      className={cn(SHARED_PROFILE_WRAP, "print:hidden", className)}
      {...sharedProfileRootAttributes(props)}
    >
      <Text id={captionId} variant="caption" aria-live="polite">
        {openingPerson ? text.opening(openingPerson.name) : text.people(people.length)}
      </Text>
      <ChoiceChips
        aria-labelledby={captionId}
        chips={shown.map((person) => ({ id: person.id, label: person.name, leading: person.avatar }))}
        value={value}
        disabled={!onChange}
        held={openingId !== null}
        onChange={request.run}
      />
      {failed !== null ? (
        <Text size="sm" tone="destructive" role="alert">
          {failed}
        </Text>
      ) : null}
    </Stack>
  );
}

/* ---------- who the profile is about ---------- */

/** A link to the person's own profile elsewhere, as `CandidateProfileLinkButton` takes it. */
export interface CandidateSharedProfileLink {
  /** Where the profile lives. */
  href: string;
  /** The link's tooltip and accessible name. */
  title: string;
  /** The glyph for the profile's network or source, as a component reference. */
  icon: ElementType;
}

/** Who a shared profile is about, as its header shows them. Every field is a display value. */
export interface CandidateSharedProfilePerson {
  /** Their name. Without one the header says `labels.anonymous`. */
  name?: string | null;
  /** Their face, usually the kit's PersonAvatar at 64px. */
  avatar?: ReactNode;
  /**
   * A banner over the header, as `CandidateProfileHeader` takes it: left
   * out, the kit's stock banner stands in, and `null` draws none.
   */
  cover?: ReactNode | null;
  /**
   * Deals the stock banner its design, as `CandidateProfileHeader` takes
   * it. Left out, the name is the seed.
   */
  coverSeed?: CandidateCoverSeed;
  /** Their current title. */
  title?: ReactNode;
  /** Their current company. */
  company?: ReactNode;
  /** Where they are. */
  location?: ReactNode;
  /** How many years they have worked, worded by `labels.yearsExperience`. */
  yearsExperience?: number | null;
  /** A link to their own profile elsewhere. */
  profileLink?: CandidateSharedProfileLink | null;
}

export interface CandidateSharedProfileHeaderProps
  extends CandidateSharedProfileRootProps,
    Pick<CandidateProfileHeaderProps, "padding" | "eyebrow" | "status"> {
  person: CandidateSharedProfilePerson;
  /**
   * Shows nobody: the heading is `labels.anonymous`, a glyph stands in for
   * the face, and their cover and profile link are never drawn, whatever
   * `person` holds. The stock banner still is, dealt by no seed, so it is
   * the same for everyone and says nothing of who they are.
   */
  anonymised?: boolean;
  /** The name's heading level, as `CandidateProfileHeader` takes it. 1 by default. */
  titleLevel?: CandidateProfileHeaderTitleLevel;
  labels?: Partial<CandidateSharedProfileLabels>;
}

/** In place of a face the profile mustn't show: a glyph, never initials, which would be somebody's. */
function WithheldAvatar() {
  return (
    <Avatar size="2xl" aria-hidden="true">
      <AvatarFallback>
        <Icon icon={UserRound} size="xl" tone="muted" />
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * Who a shared profile is about: their face, their name as the heading,
 * their title and company, where they are and how long they have worked,
 * with a link to their own profile beside it all (`CandidateProfileHeader`).
 *
 * `anonymised` is enforced here, not left to the host: the name, the avatar,
 * the cover and the profile link are never drawn on an anonymised header,
 * even when `person` carries them, and a glyph stands where the face would
 * be. The banner over it is then the kit's stock one in its first design,
 * whatever `person.coverSeed` is, so no two anonymised people differ by it;
 * a host that passes `cover: null` still gets none. What the host passes as
 * a title or a company is the host's to redact.
 *
 * The root is the profile header's, marked
 * `data-slot="candidate-profile-header"`. The profile link isn't printed.
 */
export function CandidateSharedProfileHeader({
  person,
  anonymised = false,
  titleLevel = 1,
  padding,
  eyebrow,
  status,
  className,
  labels,
  ...props
}: CandidateSharedProfileHeaderProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const name = anonymised ? undefined : person.name?.trim() || undefined;
  const link = anonymised ? null : person.profileLink;
  const hasRole = present(person.title) || present(person.company);
  const hasFacts = present(person.location) || person.yearsExperience != null;

  return (
    <CandidateProfileHeader
      {...sharedProfileRootAttributes(props)}
      className={cn(SHARED_PROFILE_WRAP, className)}
      padding={padding}
      eyebrow={eyebrow}
      status={status}
      titleLevel={titleLevel}
      name={name ?? text.anonymous}
      // Anonymised, the person's own cover is never drawn and nothing of
      // theirs deals the stock one: only their wish for no cover is kept.
      cover={anonymised ? (person.cover === null ? null : undefined) : person.cover}
      coverSeed={anonymised ? null : person.coverSeed}
      avatar={anonymised ? <WithheldAvatar /> : person.avatar}
      meta={
        hasRole || hasFacts ? (
          <Stack gap="sm">
            {hasRole ? (
              <Text variant="small" tone="soft">
                {person.title}
                {present(person.title) && present(person.company) ? <span aria-hidden> · </span> : null}
                {present(person.company) ? (
                  <CurrentCompanyLabel company={person.company} size="sm" tone="inherit" />
                ) : null}
              </Text>
            ) : null}
            {hasFacts ? (
              <Text variant="caption">
                {person.location}
                {present(person.location) && person.yearsExperience != null ? <span aria-hidden> · </span> : null}
                {person.yearsExperience != null ? text.yearsExperience(person.yearsExperience) : null}
              </Text>
            ) : null}
          </Stack>
        ) : undefined
      }
      // Beside the whole identity, not on the name line: the icon button is
      // taller than the name and would push the meta down.
      actionsPlacement="aside"
      actions={
        link ? (
          <CandidateProfileLinkButton
            href={link.href}
            title={link.title}
            icon={link.icon}
            className={cn("print:hidden", COARSE_POINTER_TOUCH_TARGET)}
          />
        ) : undefined
      }
    />
  );
}

/* ---------- a spoken note ---------- */

// The browser's own player, no wider than its section, and dark where the
// theme is: a browser draws light controls unless told the scheme.
function NativeAudio({ src, label }: CandidatePresentationRecorderAudio) {
  return (
    <audio
      src={src}
      aria-label={label}
      controls
      preload="metadata"
      className="max-w-full dark:[color-scheme:dark]"
    />
  );
}

export interface CandidateSharedProfileVoiceNoteProps extends CandidateSharedProfileRootProps {
  /** Where the recording plays from. The host resolves it. */
  src: string;
  /** What it says, for a reader who would sooner read. Line breaks are kept. */
  transcript?: string | null;
  /** The heading's level: 2 (the default), or 3 to 5 to fit the page's outline. */
  titleLevel?: CandidateSharedProfileSectionLevel;
  /** Renders the player. Defaults to the browser's own audio controls. */
  renderAudio?: (audio: CandidatePresentationRecorderAudio) => ReactNode;
  labels?: Partial<CandidateSharedProfileLabels>;
}

/**
 * A spoken note from whoever shared the profile, such as a recording made
 * with `CandidatePresentationRecorder`: a player, and its transcript under
 * it for a reader who would sooner read.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="candidate-shared-profile-voice-note"`. Printed, it is the
 * transcript alone, and nothing at all without one.
 */
export function CandidateSharedProfileVoiceNote({
  src,
  transcript,
  titleLevel = 2,
  renderAudio = NativeAudio,
  labels,
  className,
  ...props
}: CandidateSharedProfileVoiceNoteProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const words = transcript?.trim();

  return (
    <CandidateSharedProfileSection
      data-slot="candidate-shared-profile-voice-note"
      title={text.voiceNote}
      titleLevel={titleLevel}
      printVisibility={words ? "visible" : "hidden"}
      className={className}
      {...sharedProfileRootAttributes(props)}
    >
      <Stack gap="md">
        <Stack gap="none" align="start" className="print:hidden">
          {renderAudio({ src, label: text.voiceNotePlayer })}
        </Stack>
        {words ? (
          <Text variant="small" tone="muted" whitespace="pre-line">
            {words}
          </Text>
        ) : null}
      </Stack>
    </CandidateSharedProfileSection>
  );
}

/* ---------- a written note ---------- */

export interface CandidateSharedProfileNoteProps extends CandidateSharedProfileRootProps {
  /** The note, as written. Line breaks are kept. */
  text: string;
  /** Who wrote it, for the heading ("Note from Jordan"). */
  author?: string | null;
  /** The heading's level: 2 (the default), or 3 to 5 to fit the page's outline. */
  titleLevel?: CandidateSharedProfileSectionLevel;
  labels?: Partial<CandidateSharedProfileLabels>;
}

/**
 * A written note from whoever shared the profile, to whoever reads it. It
 * takes the words and who they are from, and nothing else: there is no way
 * to hand it a record.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="candidate-shared-profile-note"`.
 */
export function CandidateSharedProfileNote({
  text: words,
  author,
  titleLevel = 2,
  labels,
  className,
  ...props
}: CandidateSharedProfileNoteProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };

  return (
    <CandidateSharedProfileSection
      data-slot="candidate-shared-profile-note"
      title={text.note(author?.trim() || undefined)}
      titleLevel={titleLevel}
      className={className}
      {...sharedProfileRootAttributes(props)}
    >
      <Callout padding="lg">
        <Text variant="small" whitespace="pre-line">
          {words}
        </Text>
      </Callout>
    </CandidateSharedProfileSection>
  );
}

/* ---------- how well they fit ---------- */

// A browser prints no backgrounds unless told to, and the grade's tone and
// each line's sentiment dot are backgrounds: without this a printed caution
// reads like a strength.
const PRINT_COLOURS = "[-webkit-print-color-adjust:exact] [print-color-adjust:exact]";

/** A grade as the profile shows it: the settings of a `CandidateGradeBadge` that say what it reads and how it looks. */
export type CandidateSharedProfileGrade = Pick<
  CandidateGradeBadgeProps,
  "grade" | "label" | "labels" | "tone" | "showLabel" | "size" | "format" | "appearance" | "sentiment" | "title"
>;

/** A further list under the fit's evidence, under a heading of its own. */
export interface CandidateSharedProfileFitGroup {
  /** The list's heading, such as "What to test". */
  title: ReactNode;
  /** Its lines, each with the host's sentiment. */
  items: readonly CandidateSummaryBullet[];
}

/** How well the person fits a role, as the profile shows it. */
export interface CandidateSharedProfileAssessment {
  /** The role they were assessed for, for the heading ("Fit for Staff Engineer"). */
  roleTitle?: ReactNode;
  /**
   * The grade, as `CandidateGradeBadge` takes it: the letter with the
   * host's own label and tone, or sentiment. Nothing is read into the
   * letter here. The badge is one line of text unless `format` says
   * otherwise.
   */
  grade?: CandidateSharedProfileGrade | null;
  /** A line or two on why, over the evidence. */
  summary?: ReactNode;
  /** The evidence, a line each, each with the host's sentiment. */
  evidence?: readonly CandidateSummaryBullet[];
  /**
   * Further lists that belong with the assessment, under the evidence and
   * each under its own heading, such as what to test in an interview and
   * what stands out. The host names each and gives each line its
   * sentiment. A group with no lines isn't drawn.
   */
  groups?: readonly CandidateSharedProfileFitGroup[];
}

export interface CandidateSharedProfileFitProps
  extends CandidateSharedProfileRootProps,
    CandidateSharedProfileAssessment {
  /** The heading's level: 2 (the default), or 3 to 5 to fit the page's outline. */
  titleLevel?: CandidateSharedProfileSectionLevel;
  labels?: Partial<CandidateSharedProfileLabels>;
}

/**
 * How well the person fits the role they were shared for: the grade
 * (`CandidateGradeBadge`), a line on why, and the evidence, each line with
 * its sentiment as a dot and a word a screen reader says
 * (`CandidateSummaryBullets`). `groups` are further lists that belong with
 * the assessment, each under a heading one level under the section's, such
 * as what to test and what stands out. The host owns the grade, its
 * wording, each group's name and every line. With no grade, summary,
 * evidence or group with a line in it, it draws nothing.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="candidate-shared-profile-fit"`; each group is a `section`
 * named by its own heading and marked
 * `data-slot="candidate-shared-profile-fit-group"`.
 */
export function CandidateSharedProfileFit({
  roleTitle,
  grade,
  summary,
  evidence,
  groups,
  titleLevel = 2,
  labels,
  className,
  ...props
}: CandidateSharedProfileFitProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const groupId = useId();
  // A grade, or the host's wording for a record that has none yet.
  const graded = grade != null && (present(grade.grade) || present(grade.label));
  const lines = evidence ?? [];
  const lists = (groups ?? []).filter((group) => group.items.length > 0);
  if (!graded && !present(summary) && lines.length === 0 && lists.length === 0) return null;

  return (
    <CandidateSharedProfileSection
      data-slot="candidate-shared-profile-fit"
      title={text.fit(roleTitle)}
      titleLevel={titleLevel}
      className={cn(PRINT_COLOURS, className)}
      {...sharedProfileRootAttributes(props)}
    >
      <Stack gap="md">
        {graded ? (
          <Stack direction="horizontal" gap="sm" align="center">
            {/* Field by field: whatever else the host's grade carries stays off the page. */}
            <CandidateGradeBadge
              as="span"
              shrink
              grade={grade.grade}
              label={grade.label}
              labels={grade.labels}
              tone={grade.tone}
              showLabel={grade.showLabel}
              size={grade.size}
              format={grade.format ?? "inline"}
              appearance={grade.appearance}
              sentiment={grade.sentiment}
              title={grade.title}
            />
          </Stack>
        ) : null}
        {present(summary) ? (
          <Text variant="small" whitespace="pre-line">
            {summary}
          </Text>
        ) : null}
        {lines.length > 0 ? <CandidateSummaryBullets bullets={lines} presentation="body" /> : null}
        {lists.map((group, index) => (
          <Stack
            key={index}
            as="section"
            data-slot="candidate-shared-profile-fit-group"
            aria-labelledby={`${groupId}-${index}`}
            gap="sm"
          >
            {/* One level under the section's heading, in the look of a role's title in the career under it. */}
            <Heading id={`${groupId}-${index}`} level={5} as={`h${(titleLevel + 1) as 3 | 4 | 5 | 6}` as const}>
              {group.title}
            </Heading>
            <CandidateSummaryBullets bullets={group.items} presentation="body" />
          </Stack>
        ))}
      </Stack>
    </CandidateSharedProfileSection>
  );
}

/* ---------- the reader's answer ---------- */

export interface CandidateSharedProfileAnswerProps
  extends CandidateSharedProfileRootProps,
    Pick<CandidateClientDecisionProps, "reasonOptional" | "reasonPrompt" | "reasonSheet"> {
  /** The person's name as the question should say it. */
  candidateName: string;
  /** The reader's answer, once they have given one. */
  decision?: CandidateDecisionChoice | null;
  /** The reader's own reason for it, shown under the answer. */
  reason?: ReactNode;
  /**
   * Saves the reader's Yes or No with their reason, as
   * `CandidateClientDecision` takes it: what asks for the reason stays open
   * until the promise settles, and a rejected one says so and keeps the
   * buttons. Without it the section only shows the answer given.
   */
  onDecide?: (decision: CandidateDecisionChoice, reason: string) => Promise<void>;
  /** One-tap reasons for each answer, already worded. */
  reasonSuggestions?: { yes?: readonly string[]; no?: readonly string[] };
  /** Shows the answer and takes none: no Yes, No or Change. */
  readOnly?: boolean;
  /** Holds Yes, No and Change, such as while another person's profile is opening. */
  disabled?: boolean;
  /**
   * The heading's level in the page's outline: 2 (the default), or 3 to 5.
   * The heading is the kit's small section header at every level.
   */
  titleLevel?: CandidateSharedProfileSectionLevel;
  labels?: Partial<CandidateSharedProfileLabels>;
  /** The Yes or No row's wording, as `CandidateClientDecision` takes it. */
  decisionLabels?: Partial<CandidateClientDecisionLabels>;
}

/**
 * The reader's Yes or No on the person, with why: `CandidateClientDecision`
 * as a section of the profile, under a heading. The reason is typed in a
 * dialog, or with `reasonPrompt="sheet"` spoken, picked or typed in the
 * voice-first sheet; `reasonOptional` lets the answer go without one. Once
 * answered, it says so in words with a way to change it.
 *
 * The host saves the answer and passes it back as `decision`: nothing is
 * recorded here. `readOnly`, or no `onDecide`, shows the answer and takes
 * none.
 *
 * The root is the kit PanelSection, a `section` named by its heading and
 * marked `data-slot="candidate-shared-profile-answer"`; the decision row
 * inside keeps its own. It isn't printed.
 */
export function CandidateSharedProfileAnswer({
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
}: CandidateSharedProfileAnswerProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const titleId = useId();
  const answers = !readOnly && onDecide != null;

  return (
    <PanelSection
      data-slot="candidate-shared-profile-answer"
      aria-labelledby={titleId}
      border="top"
      // On a touchscreen Yes, No and Change are each a 44px target.
      className={cn(SHARED_PROFILE_WRAP, "print:hidden", COARSE_POINTER_TOUCH_TARGETS_WITHIN, className)}
      {...sharedProfileRootAttributes(props)}
    >
      {/* The kit's header is an h3 whatever it heads: its level is said here. */}
      <SectionHeader
        id={titleId}
        aria-level={titleLevel}
        label={answers ? text.answer : text.answerReadOnly}
        spacing="loose"
      />
      <CandidateClientDecision
        padding="none"
        candidateName={candidateName}
        decision={decision}
        reason={reason}
        readOnly={!answers}
        disabled={disabled}
        reasonOptional={reasonOptional}
        reasonPrompt={reasonPrompt}
        reasonSheet={reasonSheet}
        suggestions={reasonSuggestions}
        labels={decisionLabels}
        onDecide={async (choice, why) => {
          await onDecide?.(choice, why);
        }}
      />
    </PanelSection>
  );
}

/* ---------- the reader's notes ---------- */

/**
 * A note the reader left on the profile. It is the words, who they are from
 * and when, as text the host chose to show: there is no field for a record,
 * a kind or a scope, so nothing of the host's own notes can ride along.
 */
export interface CandidateSharedProfileClientNote {
  /** Tells the note from the others. */
  id: string | number;
  /** The note, as written. Line breaks are kept. */
  text: string;
  /** Who wrote it. Defaults to `labels.you`. */
  author?: string;
  /** When, already worded. */
  date?: string;
}

export interface CandidateSharedProfileNotesProps extends CandidateSharedProfileRootProps {
  /** The reader's notes, in the order to show them. */
  notes: readonly CandidateSharedProfileClientNote[];
  /** The person's name as the note field should say it. */
  candidateName: string;
  /**
   * Saves a note. Resolve once it is saved, and pass it back in `notes`;
   * reject to keep the words in the composer, with `labels.noteFailed`
   * under them. Without it the section only shows the notes.
   */
  onAdd?: (text: string) => Promise<void>;
  /** Shows the notes and takes none. */
  readOnly?: boolean;
  /** Holds the composer, such as while another person's profile is opening. */
  disabled?: boolean;
  /**
   * `false` leaves dictation out, and the composer opens for typing. It
   * also opens there wherever dictation can't run.
   */
  voice?: boolean;
  /** The longest note the composer takes, typed or spoken. */
  maxLength?: number;
  /**
   * The heading's level in the page's outline: 2 (the default), or 3 to 5.
   * The heading is the kit's small section header at every level.
   */
  titleLevel?: CandidateSharedProfileSectionLevel;
  labels?: Partial<CandidateSharedProfileLabels>;
}

/**
 * The notes the reader has left on the person, and room for another, spoken
 * first or typed (`CandidateNoteCard`, `CandidateNoteComposer`). A note is
 * separate from the Yes or No: it decides nothing.
 *
 * The host saves each note and passes the list back: nothing is kept here
 * but the draft. A typed note that doesn't save stays in the field with an
 * error under it. A spoken one holds the composer while it saves, so it
 * can't be sent twice; if it doesn't save, or runs past `maxLength`, it is
 * put in the field, so it needn't be said again. Dictation runs through the
 * host's `DictationProvider`, as the kit's mic does everywhere, or the
 * browser's speech recognition without one. `readOnly`, or no `onAdd`, shows
 * the notes alone.
 *
 * The root is marked `data-slot="candidate-shared-profile-notes"`; inside it
 * is a `section` named by its heading, and the cards and the composer keep
 * their own. It isn't printed.
 */
export function CandidateSharedProfileNotes({
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
}: CandidateSharedProfileNotesProps) {
  const text = { ...candidateSharedProfileLabels, ...labels };
  const writes = !readOnly && onAdd != null;
  const dictation = useDictationSupport();
  const [draft, setDraft] = useState("");
  // A spoken note that didn't save sits in the field until it is sent or discarded.
  const [recovering, setRecovering] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  // A spoken note on its way: the composer shows no save of its own for it.
  const [savingSpoken, setSavingSpoken] = useState(false);
  const spokenInFlight = useRef(false);

  const save = async (words: string) => {
    try {
      await onAdd?.(words);
      setDraft("");
      setRecovering(false);
      setProblem(null);
    } catch (cause) {
      setProblem(text.noteFailed(cause));
      // The composer keeps the words when it sees this.
      throw cause;
    }
  };

  const recover = (words: string) => {
    setDraft(words);
    setRecovering(true);
  };

  const spoken = useCandidateVoiceNote({
    title: text.noteVoiceTitle(candidateName),
    onCommit: async (heard) => {
      const words = heard.trim();
      if (!words || spokenInFlight.current) return;
      // Too long to save as it is: in the field, to shorten.
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
    },
  });
  // Whether dictation can run is known once the first effects have: until
  // then no composer is drawn, so it never opens one way and turns into the other.
  const composerReady = !voice || dictation !== null;
  const speaks = voice && dictation === true;
  const title = writes ? text.notes : text.notesReadOnly;

  return (
    <Stack
      data-slot="candidate-shared-profile-notes"
      gap="none"
      // On a touchscreen the composer's controls are each a 44px target.
      className={cn(SHARED_PROFILE_WRAP, "print:hidden", COARSE_POINTER_TOUCH_TARGETS_WITHIN, className)}
      {...sharedProfileRootAttributes(props)}
    >
      {writes && speaks ? spoken.control : null}
      {/* Named by its words, not by its heading, which also holds the count. */}
      <PanelSection aria-label={title} border="top">
        {/* The kit's header is an h3 whatever it heads: its level is said here. */}
        <SectionHeader aria-level={titleLevel} label={title} count={notes.length} />
        {notes.length > 0 ? (
          <Stack direction="vertical" gap="sm" marginTop="md">
            {notes.map((note) => (
              <CandidateNoteCard key={note.id} author={note.author ?? text.you} date={note.date} text={note.text} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            variant="empty"
            size="inline"
            icon={StickyNote}
            title={text.notesEmpty.title}
            description={text.notesEmpty.description ?? ""}
          />
        )}
        {writes && composerReady ? (
          <CandidateNoteComposer
            value={draft}
            onValueChange={setDraft}
            editing={recovering ? true : undefined}
            onVoice={speaks ? spoken.open : undefined}
            onCancel={() => {
              setDraft("");
              setRecovering(false);
              setProblem(null);
            }}
            onSubmit={save}
            disabled={disabled || savingSpoken}
            error={problem}
            maxLength={maxLength}
            // Said busy for a spoken save too; a typed one the composer says itself.
            {...(savingSpoken ? { "aria-busy": true } : null)}
            labels={{
              input: text.noteInput(candidateName),
              placeholder: text.notePlaceholder,
              ...(recovering ? { cancel: text.noteDiscard } : null),
            }}
          />
        ) : null}
      </PanelSection>
    </Stack>
  );
}
