import * as react from 'react';
import { ReactNode, HTMLAttributes } from 'react';

/** A role id: whatever key the host uses for its roles. */
type CandidateRoleMatchId = string | number;
/** A role suggested for a candidate, in the compact summary. */
interface CandidateRoleMatchSummaryItem<TId extends CandidateRoleMatchId = CandidateRoleMatchId> {
    id: TId;
    title: ReactNode;
    /** Usually a CandidateGradeBadge. */
    grade?: ReactNode;
}
interface CandidateRoleMatchSummaryProps<TItem extends CandidateRoleMatchSummaryItem = CandidateRoleMatchSummaryItem> extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    matches: readonly TItem[];
    /** Called with a role's id when its row is activated. */
    onOpen: (id: TItem["id"]) => void;
}
/**
 * A compact cue that a candidate may fit other roles: one full-width row per
 * role with its title, grade and a chevron, each opening wherever the host
 * shows the full rationale. Renders nothing when there are no matches, so it
 * can sit in a call or list overview unconditionally. The root is marked
 * `data-slot="candidate-role-match-summary"`.
 */
declare function CandidateRoleMatchSummary<TItem extends CandidateRoleMatchSummaryItem>({ matches, onOpen, ...props }: CandidateRoleMatchSummaryProps<TItem>): react.JSX.Element | null;
/** A role suggested for a candidate, with why, in the full list. */
interface CandidateRoleMatchListItem<TId extends CandidateRoleMatchId = CandidateRoleMatchId> extends CandidateRoleMatchSummaryItem<TId> {
    /** Where the role title links to. */
    href?: string;
    /** One line of why the candidate fits, already worded. */
    reason: ReactNode;
    /** Already on the role: shows the added badge instead of the add action. */
    added?: boolean;
    /** The added badge's text for this role, such as "Added · screening". */
    addedLabel?: ReactNode;
}
/** Host-owned wording for the list's actions. */
interface CandidateRoleMatchListLabels {
    /** The add button and the confirm button. */
    add: ReactNode;
    /** The badge on a role the candidate was added to here. */
    added: ReactNode;
    cancel: ReactNode;
}
/** Host-owned wording for the confirmation an add asks for first. */
interface CandidateRoleMatchConfirm<TItem> {
    title: (match: TItem) => ReactNode;
    description?: (match: TItem) => ReactNode;
}
interface CandidateRoleMatchListProps<TItem extends CandidateRoleMatchListItem = CandidateRoleMatchListItem> extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** The eyebrow over the list, such as "Possible roles for Mei". */
    heading: ReactNode;
    matches: readonly TItem[];
    /**
     * Opens a role in place. When set, a click on the title calls it instead of
     * following `href`, for a surface that already shows the person.
     */
    onOpen?: (id: TItem["id"]) => void;
    /**
     * Enables the add action. Resolve once the candidate is on the role (the row
     * then shows the added badge); reject when it failed, having told the person
     * why, and the role stays addable.
     */
    onAddToRole?: (id: TItem["id"]) => Promise<void>;
    confirm: CandidateRoleMatchConfirm<TItem>;
    labels?: Partial<CandidateRoleMatchListLabels>;
}
/**
 * Roles a candidate may fit, each with a linked title, a grade, one line of
 * why, and an add action that asks for confirmation in the kit's bottom
 * ConfirmBar before calling `onAddToRole`. A role added here keeps its
 * added badge for as long as the list is mounted. Renders nothing when
 * there are no matches. The root is marked `data-slot="candidate-role-match-list"`.
 */
declare function CandidateRoleMatchList<TItem extends CandidateRoleMatchListItem>({ heading, matches, onOpen, onAddToRole, confirm, labels, ...props }: CandidateRoleMatchListProps<TItem>): react.JSX.Element | null;

export { type CandidateRoleMatchConfirm, type CandidateRoleMatchId, CandidateRoleMatchList, type CandidateRoleMatchListItem, type CandidateRoleMatchListLabels, type CandidateRoleMatchListProps, CandidateRoleMatchSummary, type CandidateRoleMatchSummaryItem, type CandidateRoleMatchSummaryProps };
