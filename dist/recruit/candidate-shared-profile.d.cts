import * as react from 'react';
import { ReactNode } from 'react';
import { CareerHistoryItem, CandidateCareerHistoryTimelineProps } from './candidate-career-history-timeline.cjs';
import { CandidateClientDecisionProps, CandidateClientDecisionLabels } from './candidate-client-decision.cjs';
import { CandidateDecisionChoice } from './candidate-decision-buttons.cjs';
import { CandidatePresentationRecorderAudio } from './candidate-presentation-recorder.cjs';
import { CandidateProfileHeaderTitleLevel } from './candidate-profile.cjs';
import { CandidateSharedProfileRootProps, CandidateSharedProfilePerson, CandidateSharedProfilePersonOption, CandidateSharedProfileAssessment, CandidateSharedProfileClientNote, CandidateSharedProfileLabels } from './candidate-shared-profile-sections.cjs';
import '../core/calendar-date.cjs';
import '../candidate-empty-copy-CZmg2ZoX.cjs';
import './candidate-decision-reason-sheet.cjs';
import './candidate-cover-header.cjs';
import './candidate-grade.cjs';
import '@epicbagel/saas-kit/primitives/badge';
import '@epicbagel/saas-kit/primitives/sentiment-dot';
import './candidate-pipeline-list.cjs';
import './candidate-stage-select.cjs';
import '@epicbagel/saas-kit/primitives/select';

/** A spoken note from whoever shared the profile. */
interface CandidateSharedProfileRecording {
    /** Where the recording plays from. The host resolves it. */
    src: string;
    /** What it says, for a reader who would sooner read. */
    transcript?: string | null;
}
/** A written note from whoever shared the profile: the words, and who they are from. */
interface CandidateSharedProfileWrittenNote {
    /** The note, as written. */
    text: string;
    /** Who wrote it, for the heading ("Note from Jordan"). */
    author?: string | null;
}
/** One line of the person's education. */
interface CandidateSharedProfileEducationItem {
    /** What they studied or earned, such as "BSc, Computer Science". */
    title?: ReactNode;
    /** Where. It is the line's title when there is no `title`. */
    institution?: ReactNode;
    /** When, already worded, such as the year they finished. */
    date?: ReactNode;
}
interface CandidateSharedProfileProps extends CandidateSharedProfileRootProps {
    /** Who the profile is about. */
    person: CandidateSharedProfilePerson;
    /**
     * Shows nobody. The name, the avatar, the cover and the profile link are
     * never drawn, even when `person` carries them, the switcher names nobody,
     * and the Yes or No and the note field say `labels.anonymousReference`.
     * Everything else is drawn as passed, so the host redacts what an
     * employer's name or a note gives away.
     */
    anonymised?: boolean;
    /** Above everything, such as the search or the role the person was shared for. */
    eyebrow?: ReactNode;
    /** The people the link shares, for a link that shares several. With fewer than two there is no switcher. */
    people?: readonly CandidateSharedProfilePersonOption[];
    /** Which of `people` this profile is. */
    personId?: string;
    /**
     * Called with the person picked in the switcher; the host shows their
     * profile. While a promise it returns is pending the switcher says who is
     * opening, and it, the Yes or No and the note field are held.
     */
    onPersonChange?: (id: string) => unknown;
    /**
     * The person whose profile is on its way, for a host that knows it some
     * other way than that promise. It holds the same controls.
     */
    openingPersonId?: string | null;
    /**
     * The link has been archived: a notice says so above the profile, which
     * dims. For whoever can still see an archived profile, such as the person
     * who shared it.
     */
    archived?: boolean;
    /** A spoken note from whoever shared the profile. */
    voiceNote?: CandidateSharedProfileRecording | null;
    /** A written note from them. */
    note?: CandidateSharedProfileWrittenNote | null;
    /** How well the person fits the role they were shared for. */
    fit?: CandidateSharedProfileAssessment | null;
    /** A summary of the person. A string keeps its line breaks. */
    summary?: ReactNode;
    /** Their career, newest first, as `CandidateCareerHistoryTimeline` takes it. */
    experience?: readonly CareerHistoryItem[];
    /** How the career is drawn, as `CandidateCareerHistoryTimeline` takes it. */
    experienceOptions?: Pick<CandidateCareerHistoryTimelineProps, "detailedCompanyGroups" | "earlierLabel" | "presentLabel" | "locale">;
    /** Their education. */
    education?: readonly CandidateSharedProfileEducationItem[];
    /** Their skills, a tag each. */
    skills?: readonly ReactNode[];
    /** Their certifications, a line each. */
    certifications?: readonly ReactNode[];
    /** The languages they speak, a line each. */
    languages?: readonly ReactNode[];
    /** Further sections of the host's own, under the profile's, usually `CandidateSharedProfileSection`s. */
    children?: ReactNode;
    /** The reader's Yes or No on the person, once they have given one. */
    decision?: CandidateDecisionChoice | null;
    /** The reader's own reason for it, shown under the answer. */
    decisionReason?: ReactNode;
    /**
     * Saves the reader's Yes or No with their reason, as
     * `CandidateSharedProfileAnswer` takes it. Without it the profile has no
     * Yes or No: it shows an answer already given, and nothing where there is
     * none.
     */
    onDecide?: (decision: CandidateDecisionChoice, reason: string) => Promise<void>;
    /** Lets the answer be saved with no reason. A reason is required without it. */
    reasonOptional?: boolean;
    /** One-tap reasons for each answer, already worded. */
    reasonSuggestions?: {
        yes?: readonly string[];
        no?: readonly string[];
    };
    /** How the reason is asked for: typed in a dialog (the default), or voice first in a sheet. */
    reasonPrompt?: CandidateClientDecisionProps["reasonPrompt"];
    /** The sheet's own settings for `reasonPrompt="sheet"`, as `CandidateClientDecision` takes them. */
    reasonSheet?: CandidateClientDecisionProps["reasonSheet"];
    /** The notes the reader has left on the person, in the order to show them. */
    clientNotes?: readonly CandidateSharedProfileClientNote[];
    /**
     * Saves a note from the reader, as `CandidateSharedProfileNotes` takes it.
     * Without it the profile takes no notes: it shows the ones given, and
     * nothing where there are none.
     */
    onAddNote?: (text: string) => Promise<void>;
    /** `false` leaves dictation out of the note field. */
    noteVoice?: boolean;
    /** The longest note the field takes. */
    noteMaxLength?: number;
    /**
     * The profile as its reader sees it, for someone who can't act for them:
     * the answer and the notes show, and none can be given.
     */
    readOnly?: boolean;
    /** A closing line inside the profile, such as who shared it. It isn't printed. */
    credit?: ReactNode;
    /**
     * The name's heading level: 1 (the default) for a profile that is the
     * page, or 2 to 4 under a page that has its own h1. The sections sit one
     * level under it.
     */
    titleLevel?: CandidateProfileHeaderTitleLevel;
    /** Renders the spoken note's player. Defaults to the browser's own audio controls. */
    renderAudio?: (audio: CandidatePresentationRecorderAudio) => ReactNode;
    labels?: Partial<CandidateSharedProfileLabels>;
    /** The Yes or No row's wording, as `CandidateClientDecision` takes it. */
    decisionLabels?: Partial<CandidateClientDecisionLabels>;
}
/**
 * A candidate's profile as someone it was shared with sees it: who they
 * are, what the person who shared them says about them, how well they fit,
 * and their career, with room for the reader to say Yes or No and to leave
 * notes.
 *
 * It is the content of a page and no more. It draws no header, brand,
 * theme or shell: the host wraps it in its own page, and decides the page's
 * width. In order it shows an `eyebrow`; the people the link shares, when it
 * shares several (`CandidateSharedProfileSwitcher`); a notice on an
 * `archived` link; then the profile (`CandidateProfile`): the person
 * (`CandidateSharedProfileHeader`), a spoken note
 * (`CandidateSharedProfileVoiceNote`), a written one
 * (`CandidateSharedProfileNote`), the fit (`CandidateSharedProfileFit`), a
 * summary, experience (`CandidateCareerHistoryTimeline`), education, skills,
 * certifications and languages, the host's own `children`, the reader's
 * answer (`CandidateSharedProfileAnswer`), their notes
 * (`CandidateSharedProfileNotes`) and a `credit`.
 *
 * Every part is optional and shows only when the host passes what it
 * shows: a profile given a name alone is a heading. A host that passes no
 * `onDecide` gets no Yes or No, and one that passes no `onAddNote` no note
 * field.
 *
 * It is a view: it fetches nothing, navigates nowhere, stores nothing and
 * holds no timer. Every value is a display value the host chose to show:
 * there is no prop for a record, and a note is its words and who they are
 * from. Nothing else reaches the page either: the root takes an id, a
 * class, a style and `data-` and `aria-` attributes, and anything more a
 * host spreads in is dropped, not written into the page as an attribute.
 * What the reader does goes out through `onPersonChange`, `onDecide` and
 * `onAddNote`; a promise from one holds its controls, and a rejected one
 * says so where it was sent. While another person's profile is opening the
 * answer and the note field are held, and both start afresh for each
 * person.
 *
 * `anonymised` is enforced here: the name, avatar, cover and profile link
 * are never drawn, whatever `person` holds.
 *
 * A word longer than its line, such as a link pasted into a note, wraps
 * inside the profile. Printed, it is a resume: the profile loses its
 * border, and the switcher, the archived notice, the profile link, the
 * audio player, the answer, the notes and the credit are left out.
 *
 * The root is marked `data-slot="candidate-shared-profile"`, with
 * `data-anonymised` and `data-archived` where they apply; each section
 * inside keeps its own. While another person's profile is opening, the
 * profile under the switcher is `aria-busy`.
 */
declare function CandidateSharedProfile({ person, anonymised, eyebrow, people, personId, onPersonChange, openingPersonId, archived, voiceNote, note, fit, summary, experience, experienceOptions, education, skills, certifications, languages, children, decision, decisionReason, onDecide, reasonOptional, reasonSuggestions, reasonPrompt, reasonSheet, clientNotes, onAddNote, noteVoice, noteMaxLength, readOnly, credit, titleLevel, renderAudio, labels, decisionLabels, className, ...props }: CandidateSharedProfileProps): react.JSX.Element;

export { CandidateSharedProfile, type CandidateSharedProfileEducationItem, type CandidateSharedProfileProps, type CandidateSharedProfileRecording, type CandidateSharedProfileWrittenNote };
