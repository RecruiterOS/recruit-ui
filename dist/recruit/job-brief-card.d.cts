import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';
import { JobBriefRuleKind, JobBriefRuleLabels } from './job-brief-view.cjs';
export { JobBriefCompanyOverview, JobBriefContent, JobBriefInterviewStep, JobBriefLabels, JobBriefPersona, JobBriefRoleDetails, JobBriefTitleStyle, JobBriefView, JobBriefViewFact, JobBriefViewOptions, JobBriefViewSection, formatJobBriefSalary, jobBriefLabels, jobBriefTitle, jobBriefView } from './job-brief-view.cjs';

/**
 * How a JobBriefCard sits. `collapsible` is a card whose whole body folds
 * under its title, for a section of a page. `preview` is a card that shows
 * the start of the brief and opens the rest in place, for a message in a
 * conversation.
 */
type JobBriefCardPresentation = "collapsible" | "preview";
/** One labelled fact about a role, such as its location or salary, worded by the host. */
interface JobBriefFact {
    /** Stable key for the row. */
    id: string;
    label: ReactNode;
    value: ReactNode;
}
/**
 * A titled part of the brief after the three lists, such as the role's
 * details, who it sells to, or the interview process. It holds facts, items,
 * or both; a section with neither isn't drawn.
 */
interface JobBriefSection {
    /** Stable key for the section. */
    id: string;
    /** The section's heading, such as "Role details". */
    title: ReactNode;
    /** Labelled facts, drawn as a divided list. */
    facts?: readonly JobBriefFact[];
    /** Entries drawn as a bulleted list, or a numbered one with `ordered`. */
    items?: readonly ReactNode[];
    /** Number the items, such as for the steps of an interview process. */
    ordered?: boolean;
}
/**
 * Host-owned wording for a JobBriefCard's states and toggle. The lists' names
 * are the brief's wording, not the host's: they come in `ruleLabels`.
 */
interface JobBriefCardLabels {
    /** The notice over a brief that is still being read from a document. */
    processing: ReactNode;
    /** The in-progress blank slate's title, while nothing has been read yet. */
    processingTitle: string;
    /** The in-progress blank slate's description, under its title. */
    processingDescription: string;
    /**
     * The preview's toggle while part of the brief is hidden. It receives how
     * many facts, list entries and section rows are hidden (zero when only the
     * editing controls are).
     */
    showMore: (hidden: number) => ReactNode;
    /** The preview's toggle while the whole brief is shown. */
    showLess: ReactNode;
}
interface JobBriefCardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** `collapsible` (the default) for a page, `preview` for a message. */
    presentation?: JobBriefCardPresentation;
    /**
     * The brief's title, such as `jobBriefView`'s. With the status, it names the
     * section. Defaults to "Job brief".
     */
    title?: ReactNode;
    /**
     * The title's heading level: 2 (the default), or 3 or 4 where the card sits
     * deeper in the page's outline. Only the tags change, never the look. In
     * `preview` the title is a heading at this level and the lists' and
     * sections' headings sit one level below it. In `collapsible` the title is
     * the kit CollapsibleSection's trigger, which can't hold a heading, so the
     * lists' and sections' headings take this level themselves and the outline
     * skips none.
     */
    titleLevel?: 2 | 3 | 4;
    /**
     * At the title's end, such as a "Current" badge, in the same place in both
     * presentations. It keeps its width: on a narrow screen the title wraps
     * rather than the status. It names the section with the title ("… Current"),
     * so versions of one brief stay apart in a screen reader's list of regions.
     * In `collapsible` it sits inside the trigger button, so pass phrasing
     * content (a Badge rendered `as="span"`).
     */
    status?: ReactNode;
    /** What the role is, in a sentence or two. Clamped to two lines in a closed preview. */
    description?: ReactNode;
    /** Headline facts after the description, such as location, salary and on-target earnings. */
    facts?: readonly JobBriefFact[];
    mustHaves?: readonly string[];
    niceToHaves?: readonly string[];
    redFlags?: readonly string[];
    /**
     * Which lists show, in order. Defaults to all three. Whether a page shows
     * its red flags is the host's call: leave `redFlags` out of `rules` where
     * they mustn't be seen.
     */
    rules?: readonly JobBriefRuleKind[];
    /**
     * Given, the lists are editable in place: each add, edit or remove hands
     * the whole new list to the host, with which list it is. The lists stay
     * controlled: they show the host's arrays. If the callback returns a
     * promise, the list shows what it sent, marked busy, until the promise
     * settles, then the host's arrays again, so a save that fails reverts and
     * the host says why. Resolve once the arrays reflect the save.
     */
    onRulesChange?: (kind: JobBriefRuleKind, items: string[]) => void | PromiseLike<unknown>;
    /** Titled parts after the lists, in order, such as role details, buyers, interview steps and the company. */
    sections?: readonly JobBriefSection[];
    /**
     * Last, such as example candidates or an action. In `collapsible` it folds
     * with the body; in `preview` it shows in both states, under the toggle.
     */
    footer?: ReactNode;
    /**
     * The brief is still being read from a document. With nothing to show and
     * nothing to edit yet, an in-progress blank slate stands in for the body;
     * otherwise a notice sits above it, so an editable brief keeps its lists
     * and add fields however long the reading takes.
     */
    processing?: boolean;
    /** Skeleton rows in place of a body that has nothing to show yet. */
    loading?: boolean;
    /** Whether the body is open: the collapsible's body, or the preview's full brief. */
    open?: boolean;
    /** Whether the body starts open when `open` is left to the card. Defaults to false. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * In a closed preview, how many facts and how many entries of the first
     * shown list with any show. Defaults to 3; 0 leaves the title, the
     * description and the toggle.
     */
    previewCount?: number;
    /**
     * The blank slate's wording when there is nothing to show and nothing to
     * edit. Defaults to "No brief yet".
     */
    empty?: CandidateEmptyCopy;
    /**
     * The lists' names and what one entry of each is called in their controls
     * ("Add must-have…", "Remove must-have"), such as `jobBriefView`'s. Defaults
     * to `jobBriefLabels`' wording.
     */
    ruleLabels?: Partial<JobBriefRuleLabels>;
    labels?: Partial<JobBriefCardLabels>;
}
/**
 * A job brief: what the role is, its headline facts, the must-have,
 * nice-to-have and red-flag lists, then titled sections such as role details
 * or the interview process, and a footer slot. Every value enters as a
 * display value or a slot, worded by the host; `jobBriefView` maps a brief's
 * fields onto them, so one brief reads the same in every host.
 *
 * Two presentations share one look: the same title row (the title in the
 * card-title type, the status at its end), inset and body, and differ only
 * in what folds. `collapsible` is a kit Card holding a CollapsibleSection,
 * for a page: the title row is the trigger and the whole body folds under
 * it. `preview` is a kit Card with the title as a heading, for a message:
 * closed, it shows the description (two lines), the first `previewCount`
 * facts and entries of the first shown list that has any, then a toggle
 * that opens the full brief in place; with nothing hidden, the full brief
 * shows and no toggle does. Closing it from the toggle brings the card back
 * into view, since a long brief's toggle sits far below its top.
 *
 * Given `onRulesChange`, the lists are editable in place, and saving stays
 * with the host. A read-only empty list draws nothing; an editable one keeps
 * the kit's "None set" and its add field, also while `processing`, under the
 * notice. A read-only brief with nothing to show is the kit's empty state,
 * or an in-progress one while `processing`; while `loading`, skeleton rows.
 *
 * The root is a `section` named by the title and the status together, and
 * marked `data-slot="job-brief-card"`, with `data-presentation`; each list's
 * wrapper is marked `data-slot="job-brief-rule-list"` with its `data-kind`,
 * each section `data-slot="job-brief-section"`, and the skeleton
 * `data-slot="job-brief-loading"`. The kit Card inside keeps its own.
 */
declare function JobBriefCard({ presentation, title, titleLevel, status, description, facts, mustHaves, niceToHaves, redFlags, rules, onRulesChange, sections, footer, processing, loading, open, defaultOpen, onOpenChange, previewCount, empty, ruleLabels, labels, ...props }: JobBriefCardProps): react.JSX.Element;

export { JobBriefCard, type JobBriefCardLabels, type JobBriefCardPresentation, type JobBriefCardProps, type JobBriefFact, JobBriefRuleKind, JobBriefRuleLabels, type JobBriefSection };
