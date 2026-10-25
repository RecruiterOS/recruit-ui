import * as react from 'react';
import { HTMLAttributes, ReactNode, Key } from 'react';

/** One labelled fact in the card's three-column row. */
interface CandidateRelationshipFact {
    /** Keys the fact; defaults to its position. */
    id?: Key;
    label: ReactNode;
    value: ReactNode;
    /** A muted line under the value. */
    detail?: ReactNode;
}
/** The newest signal about the person, already worded by the host. */
interface CandidateRelationshipSignal {
    /** The section's eyebrow, such as "Signal". */
    label: ReactNode;
    /** What changed, in one line. */
    summary: ReactNode;
    /** A muted line counting the others, such as "+2 more signals". */
    more?: ReactNode;
    /** Controls on the eyebrow row, such as a CandidateSignalMenu. */
    actions?: ReactNode;
}
/** The roles suggested for the person, as one row that opens them. */
interface CandidateRelationshipSuggestion {
    /** The row's eyebrow, such as "Suggested roles". */
    label: ReactNode;
    /** The first role, shown in a badge. */
    primary: ReactNode;
    /** The badge's tooltip. Defaults to `primary` when that is plain text. */
    primaryTitle?: string;
    /** The first role's grade, usually a CandidateGradeBadge. */
    grade?: ReactNode;
    /** A count badge for the other roles, such as { value: "+2", title: "2 more roles" }. */
    more?: {
        value: number | string;
        title?: string;
    };
    /** Called when the row is activated. It never also selects the card. */
    onOpen: () => void;
}
/** The latest note about the person, at the foot of the card. */
interface CandidateRelationshipNote {
    /** Who left it, or a generic heading such as "Recruiter note". */
    heading: ReactNode;
    /** When it was left, already formatted. */
    date?: ReactNode;
    /** The note itself, clamped to three lines. */
    text: ReactNode;
}
interface CandidateRelationshipCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "onSelect" | "title" | "children"> {
    /** The person's name, a level-3 heading on one truncated line. */
    name: ReactNode;
    /** Avatar at the start of the header. */
    avatar?: ReactNode;
    /** Media for the 4:1 cover frame, softened until the card is hovered. Omit it and no frame is drawn. */
    cover?: ReactNode;
    /** Marks a verified contact with a check after the name. */
    verified?: boolean;
    /** The line under the name, usually the current title. */
    headline?: ReactNode;
    /** The current company, usually a CurrentCompanyPopover or CurrentCompanyLabel. */
    company?: ReactNode;
    /** Where they are, after the company. */
    location?: ReactNode;
    /** Controls at the end of the header, such as a favourite button and a profile link. */
    actions?: ReactNode;
    signal?: CandidateRelationshipSignal;
    /** Up to three facts, in a row that stacks on narrow screens. */
    facts: readonly CandidateRelationshipFact[];
    suggestion?: CandidateRelationshipSuggestion;
    note?: CandidateRelationshipNote;
    /** Selected treatment, and aria-current. */
    selected?: boolean;
    /** Called when the card is activated, but not from a click on a nested control. */
    onSelect: () => void;
}
/**
 * A person in a relationship network: who they are and where they work, the
 * newest signal about them, three facts, the roles suggested for them and
 * the latest note, each section shown only when the host supplies it.
 *
 * The whole card is one kit InteractiveCard with button semantics that
 * selects the person, by click or with Enter or Space while the card has
 * focus. A click on a nested link or button never also selects it, Enter and
 * Space on a focused nested control activate that control alone, and the
 * suggestion row opens its roles instead. The host owns every value, its wording and its dates. The
 * root is marked `data-slot="candidate-relationship-card"`.
 */
declare function CandidateRelationshipCard({ name, avatar, cover, verified, headline, company, location, actions, signal, facts, suggestion, note, selected, onSelect, onKeyDown, ...props }: CandidateRelationshipCardProps): react.JSX.Element;

export { CandidateRelationshipCard, type CandidateRelationshipCardProps, type CandidateRelationshipFact, type CandidateRelationshipNote, type CandidateRelationshipSignal, type CandidateRelationshipSuggestion };
