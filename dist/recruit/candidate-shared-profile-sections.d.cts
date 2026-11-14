import * as react from 'react';
import { CSSProperties, ReactNode, ElementType } from 'react';
import { CandidateClientDecisionProps, CandidateClientDecisionLabels } from './candidate-client-decision.cjs';
import { CandidateDecisionChoice } from './candidate-decision-buttons.cjs';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';
import { CandidateGradeBadgeProps } from './candidate-grade.cjs';
import { CandidateSummaryBullet } from './candidate-pipeline-list.cjs';
import { CandidatePresentationRecorderAudio } from './candidate-presentation-recorder.cjs';
import { CandidateProfileHeaderProps, CandidateProfileHeaderTitleLevel } from './candidate-profile.cjs';
import './candidate-decision-reason-sheet.cjs';
import '@epicbagel/saas-kit/primitives/badge';
import '@epicbagel/saas-kit/primitives/sentiment-dot';
import './candidate-stage-select.cjs';
import '@epicbagel/saas-kit/primitives/select';
import './candidate-cover-header.cjs';

/**
 * The fixed words of a candidate's shared profile, and of each section of
 * it. A section reads only the ones it shows; pass `labels` to change any.
 */
interface CandidateSharedProfileLabels {
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
/** The default wording of a candidate's shared profile. Pass `labels` to change any of it. */
declare const candidateSharedProfileLabels: Readonly<CandidateSharedProfileLabels>;
/**
 * What a host may put on the root of a shared profile, or of a section of
 * it: where it sits and how it is found. `data-` and `aria-` attributes are
 * taken too. Anything else handed to a root is dropped, not written into
 * the page: these are opened by people outside the host's organisation,
 * and a field spread in by mistake, off a record or a view model, would
 * otherwise be there to read in the page's source.
 */
interface CandidateSharedProfileRootProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
}
/** A section's heading level: 2 under a profile whose name is the page's h1, or deeper to fit the page's outline. */
type CandidateSharedProfileSectionLevel = 2 | 3 | 4 | 5;
interface CandidateSharedProfileSectionProps extends CandidateSharedProfileRootProps {
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
declare function CandidateSharedProfileSection({ title, titleLevel, printVisibility, className, children, ...props }: CandidateSharedProfileSectionProps): react.JSX.Element;
/** One of the people a link shares, as the switcher shows them. */
interface CandidateSharedProfilePersonOption {
    /** Tells the person from the others, and tells the host who was picked. */
    id: string;
    /** Their name: the chip's words. */
    name: string;
    /** Tells apart two people with one name, such as their company. Shown only for those two. */
    detail?: string;
    /** Their face, usually the kit's PersonAvatar at 20px. The name beside it is what a screen reader says. */
    avatar?: ReactNode;
}
interface CandidateSharedProfileSwitcherProps extends CandidateSharedProfileRootProps {
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
declare function CandidateSharedProfileSwitcher({ people, value, onChange, opening, error, anonymised, labels, className, ...props }: CandidateSharedProfileSwitcherProps): react.JSX.Element | null;
/** A link to the person's own profile elsewhere, as `CandidateProfileLinkButton` takes it. */
interface CandidateSharedProfileLink {
    /** Where the profile lives. */
    href: string;
    /** The link's tooltip and accessible name. */
    title: string;
    /** The glyph for the profile's network or source, as a component reference. */
    icon: ElementType;
}
/** Who a shared profile is about, as its header shows them. Every field is a display value. */
interface CandidateSharedProfilePerson {
    /** Their name. Without one the header says `labels.anonymous`. */
    name?: string | null;
    /** Their face, usually the kit's PersonAvatar at 64px. */
    avatar?: ReactNode;
    /** A banner over the header, as `CandidateProfileHeader` takes it. */
    cover?: ReactNode;
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
interface CandidateSharedProfileHeaderProps extends CandidateSharedProfileRootProps, Pick<CandidateProfileHeaderProps, "padding" | "eyebrow" | "status"> {
    person: CandidateSharedProfilePerson;
    /**
     * Shows nobody: the heading is `labels.anonymous`, a glyph stands in for
     * the face, and there is no cover and no profile link, whatever `person`
     * holds.
     */
    anonymised?: boolean;
    /** The name's heading level, as `CandidateProfileHeader` takes it. 1 by default. */
    titleLevel?: CandidateProfileHeaderTitleLevel;
    labels?: Partial<CandidateSharedProfileLabels>;
}
/**
 * Who a shared profile is about: their face, their name as the heading,
 * their title and company, where they are and how long they have worked,
 * with a link to their own profile beside it all (`CandidateProfileHeader`).
 *
 * `anonymised` is enforced here, not left to the host: the name, the avatar,
 * the cover and the profile link are never drawn on an anonymised header,
 * even when `person` carries them, and a glyph stands where the face would
 * be. What the host passes as a title or a company is the host's to redact.
 *
 * The root is the profile header's, marked
 * `data-slot="candidate-profile-header"`. The profile link isn't printed.
 */
declare function CandidateSharedProfileHeader({ person, anonymised, titleLevel, padding, eyebrow, status, className, labels, ...props }: CandidateSharedProfileHeaderProps): react.JSX.Element;
interface CandidateSharedProfileVoiceNoteProps extends CandidateSharedProfileRootProps {
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
declare function CandidateSharedProfileVoiceNote({ src, transcript, titleLevel, renderAudio, labels, className, ...props }: CandidateSharedProfileVoiceNoteProps): react.JSX.Element;
interface CandidateSharedProfileNoteProps extends CandidateSharedProfileRootProps {
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
declare function CandidateSharedProfileNote({ text: words, author, titleLevel, labels, className, ...props }: CandidateSharedProfileNoteProps): react.JSX.Element;
/** A grade as the profile shows it: the settings of a `CandidateGradeBadge` that say what it reads and how it looks. */
type CandidateSharedProfileGrade = Pick<CandidateGradeBadgeProps, "grade" | "label" | "labels" | "tone" | "showLabel" | "size" | "format" | "appearance" | "sentiment" | "title">;
/** How well the person fits a role, as the profile shows it. */
interface CandidateSharedProfileAssessment {
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
}
interface CandidateSharedProfileFitProps extends CandidateSharedProfileRootProps, CandidateSharedProfileAssessment {
    /** The heading's level: 2 (the default), or 3 to 5 to fit the page's outline. */
    titleLevel?: CandidateSharedProfileSectionLevel;
    labels?: Partial<CandidateSharedProfileLabels>;
}
/**
 * How well the person fits the role they were shared for: the grade
 * (`CandidateGradeBadge`), a line on why, and the evidence, each line with
 * its sentiment as a dot and a word a screen reader says
 * (`CandidateSummaryBullets`). The host owns the grade, its wording and
 * every line. With no grade, summary or evidence it draws nothing.
 *
 * The root is a `section` named by its heading and marked
 * `data-slot="candidate-shared-profile-fit"`.
 */
declare function CandidateSharedProfileFit({ roleTitle, grade, summary, evidence, titleLevel, labels, className, ...props }: CandidateSharedProfileFitProps): react.JSX.Element | null;
interface CandidateSharedProfileAnswerProps extends CandidateSharedProfileRootProps, Pick<CandidateClientDecisionProps, "reasonOptional" | "reasonPrompt" | "reasonSheet"> {
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
    reasonSuggestions?: {
        yes?: readonly string[];
        no?: readonly string[];
    };
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
declare function CandidateSharedProfileAnswer({ candidateName, decision, reason, onDecide, reasonSuggestions, reasonOptional, reasonPrompt, reasonSheet, readOnly, disabled, titleLevel, labels, decisionLabels, className, ...props }: CandidateSharedProfileAnswerProps): react.JSX.Element;
/**
 * A note the reader left on the profile. It is the words, who they are from
 * and when, as text the host chose to show: there is no field for a record,
 * a kind or a scope, so nothing of the host's own notes can ride along.
 */
interface CandidateSharedProfileClientNote {
    /** Tells the note from the others. */
    id: string | number;
    /** The note, as written. Line breaks are kept. */
    text: string;
    /** Who wrote it. Defaults to `labels.you`. */
    author?: string;
    /** When, already worded. */
    date?: string;
}
interface CandidateSharedProfileNotesProps extends CandidateSharedProfileRootProps {
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
declare function CandidateSharedProfileNotes({ notes, candidateName, onAdd, readOnly, disabled, voice, maxLength, titleLevel, labels, className, ...props }: CandidateSharedProfileNotesProps): react.JSX.Element;

export { CandidateSharedProfileAnswer, type CandidateSharedProfileAnswerProps, type CandidateSharedProfileAssessment, type CandidateSharedProfileClientNote, CandidateSharedProfileFit, type CandidateSharedProfileFitProps, type CandidateSharedProfileGrade, CandidateSharedProfileHeader, type CandidateSharedProfileHeaderProps, type CandidateSharedProfileLabels, type CandidateSharedProfileLink, CandidateSharedProfileNote, type CandidateSharedProfileNoteProps, CandidateSharedProfileNotes, type CandidateSharedProfileNotesProps, type CandidateSharedProfilePerson, type CandidateSharedProfilePersonOption, type CandidateSharedProfileRootProps, CandidateSharedProfileSection, type CandidateSharedProfileSectionLevel, type CandidateSharedProfileSectionProps, CandidateSharedProfileSwitcher, type CandidateSharedProfileSwitcherProps, CandidateSharedProfileVoiceNote, type CandidateSharedProfileVoiceNoteProps, candidateSharedProfileLabels };
