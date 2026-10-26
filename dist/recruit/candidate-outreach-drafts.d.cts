import * as react from 'react';
import { ElementType, Key, HTMLAttributes, ReactNode } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

/**
 * Where a drafted message stands: written and waiting (`draft`), cleared to
 * send (`approved`), `sent`, or set aside (`dismissed`).
 */
type CandidateOutreachDraftStatus = "draft" | "approved" | "sent" | "dismissed";
/** The channel a draft was written for, such as email or a message app. */
interface CandidateOutreachDraftChannel {
    /** The channel's name, beside its icon and in each action's accessible name. */
    label: string;
    /** A glyph for the channel, as a component such as a lucide icon. */
    icon?: ElementType;
}
/** One drafted message to a person. */
interface CandidateOutreachDraftItem {
    /** Unique within the list; the row's React key. */
    id: Key;
    channel: CandidateOutreachDraftChannel;
    status: CandidateOutreachDraftStatus;
    /** Shown above the message, for channels that have one. */
    subject?: string | null;
    /** The message. Line breaks are kept. */
    body: string;
}
/** A row action, as `CandidateOutreachDraftListLabels.actionName` receives it. */
type CandidateOutreachDraftAction = "copy" | "approve" | "dismiss" | "markSent";
/** The actions that change where a draft stands; Copy is always offered. */
type CandidateOutreachDraftStatusAction = Exclude<CandidateOutreachDraftAction, "copy">;
/**
 * The actions a draft offers by default, for an approve-then-send workflow:
 * Approve and Dismiss while it is a `draft`, Mark sent once it is `approved`,
 * and none once it is `sent` or `dismissed`. Pass your own
 * `availableActions` for a workflow without an approval step.
 */
declare function defaultOutreachDraftActions(draft: Pick<CandidateOutreachDraftItem, "status">): readonly CandidateOutreachDraftStatusAction[];
interface CandidateOutreachDraftListLabels {
    /** Each status's badge. Defaults to the status itself. */
    status: Record<CandidateOutreachDraftStatus, ReactNode>;
    /** The approve button's tooltip. */
    approve: string;
    /** The dismiss button's tooltip. */
    dismiss: string;
    /** The mark-sent button's tooltip. */
    markSent: string;
    /** Each action button's accessible name, for the channel of the draft it acts on. */
    actionName: (action: CandidateOutreachDraftAction, channel: string) => string;
}
/** What Copy puts on the clipboard by default: the subject line, if any, then the message. */
declare function outreachDraftCopyText(draft: Pick<CandidateOutreachDraftItem, "subject" | "body">): string;
/** A row callback. A returned promise disables the row's buttons until it settles. */
type CandidateOutreachDraftCallback<TDraft> = (draft: TDraft) => unknown;
interface CandidateOutreachDraftListProps<TDraft extends CandidateOutreachDraftItem = CandidateOutreachDraftItem> extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The drafts, newest first or in whatever order you choose. */
    drafts: readonly TDraft[];
    /** A skeleton row while there are no drafts to show yet, and no count. */
    loading?: boolean;
    /** The section heading. Defaults to "Outreach drafts". */
    title?: ReactNode;
    /** The blank slate's wording. Defaults to "No outreach drafts yet". */
    empty?: CandidateEmptyCopy;
    /**
     * Adds Approve to each draft that offers it (by default, one that is still
     * a `draft`). A returned promise disables the row until it settles, as it
     * does for each callback.
     */
    onApprove?: CandidateOutreachDraftCallback<TDraft>;
    /** Adds Dismiss to each draft that offers it (by default, one that is still a `draft`). */
    onDismiss?: CandidateOutreachDraftCallback<TDraft>;
    /** Adds Mark sent to each draft that offers it (by default, an `approved` one). */
    onMarkSent?: CandidateOutreachDraftCallback<TDraft>;
    /**
     * Which of Approve, Dismiss and Mark sent each draft offers, as your
     * workflow decides; a button shows only when its callback is given too.
     * Defaults to `defaultOutreachDraftActions`, an approve-then-send workflow.
     */
    availableActions?: (draft: TDraft) => readonly CandidateOutreachDraftStatusAction[];
    /** What Copy puts on the clipboard. Defaults to `outreachDraftCopyText`. */
    copyText?: (draft: TDraft) => string;
    /** The kit PanelSection's divider. Defaults to `bottom`. */
    border?: "none" | "top" | "bottom";
    labels?: Partial<CandidateOutreachDraftListLabels>;
}
/**
 * The messages drafted to a person, one card per draft: the channel, where
 * the draft stands, and Copy, with the status actions your workflow allows
 * (by default Approve and Dismiss while it is a draft, and Mark sent once it
 * is approved). You write the drafts, decide which actions each offers, save
 * each status change and send the messages; the list lays them out under a
 * counted heading, with a skeleton while they load and the kit's empty state
 * when there are none.
 *
 * The root is the kit PanelSection, a section named by its title and marked
 * `data-slot="candidate-outreach-draft-list"`.
 */
declare function CandidateOutreachDraftList<TDraft extends CandidateOutreachDraftItem = CandidateOutreachDraftItem>({ drafts, loading, title, empty, onApprove, onDismiss, onMarkSent, availableActions, copyText, border, labels, ...props }: CandidateOutreachDraftListProps<TDraft>): react.JSX.Element;

export { type CandidateOutreachDraftAction, type CandidateOutreachDraftCallback, type CandidateOutreachDraftChannel, type CandidateOutreachDraftItem, CandidateOutreachDraftList, type CandidateOutreachDraftListLabels, type CandidateOutreachDraftListProps, type CandidateOutreachDraftStatus, type CandidateOutreachDraftStatusAction, defaultOutreachDraftActions, outreachDraftCopyText };
