import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { ResourceList } from '@epicbagel/saas-kit/primitives/resource-list';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

/** The kit Badge variant a column's count takes. */
type CandidatePipelineBoardTone = "default" | "info" | "success" | "warning" | "destructive";
/** One stage of the pipeline, as a column. */
interface CandidatePipelineBoardColumn {
    /** The stage: what `getStage` returns for a person in it. */
    id: string;
    /** The stage's name, as the column's heading and in a card's move menu. */
    title: string;
    /**
     * How many people are in the stage, where the board holds only some of
     * them, such as one page. Defaults to the cards the column shows.
     */
    count?: number;
    /** The count's tone, such as `success` for a stage of hires. Defaults to `default`. */
    tone?: CandidatePipelineBoardTone;
}
/** Host-owned wording for the board's fixed parts. */
interface CandidatePipelineBoardLabels {
    /** A card's move menu: its tooltip and accessible name, from the person's name. */
    move: (name: string) => string;
    /** One stage in a card's move menu, from the stage's name. */
    moveTo: (stage: string) => ReactNode;
    /** Announced to a screen reader when a card moves. */
    moved: (name: string, stage: string) => string;
    /** Announced when a promise from `onMove` rejects and the card goes back. */
    moveFailed: (name: string, stage: string) => string;
    /** A stage with nobody in it. */
    columnEmpty: (stage: string) => string;
    /** Under it, on a board whose cards can be moved. */
    columnEmptyDescription: string;
    /** A stage where nobody matches the search or the filters. */
    columnNoMatches: string;
    columnNoMatchesDescription: (stage: string) => string;
    /** The whole board, when nobody matches the search or the filters. */
    noMatches: string;
    noMatchesDescription: string;
}
/** How wide each column is: 400px, or the screen's width if that is less, or the kit's 280px. */
type CandidatePipelineBoardColumnWidth = "wide" | "narrow";
/** Whether the board fills the screen's height or grows with its longest column. */
type CandidatePipelineBoardHeight = "viewport" | "content";
type ResourceListProps<T> = Parameters<typeof ResourceList<T>>[0];
/**
 * The kit list's own toolbar, passed straight through: a search box, a
 * filter menu, quick filters, a sort and two slots for the host's controls.
 * Each shows only when the host wires it. The board narrows nothing itself:
 * the host passes the `items` that match.
 */
type CandidatePipelineBoardToolbarProps<T> = Partial<Pick<ResourceListProps<T>, "searchTerm" | "onSearchChange" | "searchPlaceholder" | "filterSchema" | "filters" | "onFiltersChange" | "quickFilters" | "quickFiltersAppearance" | "quickFiltersShowLabel" | "sortOptions" | "sortValue" | "onSortChange" | "actions" | "filterActions" | "toolbarSize">>;
type CandidatePipelineBoardProps<T> = CandidatePipelineBoardToolbarProps<T> & Omit<HTMLAttributes<HTMLElement>, "children" | "onSelect"> & {
    /** The stages, in pipeline order. */
    columns: readonly CandidatePipelineBoardColumn[];
    /**
     * The people on the board, in the order each column lists them. A person
     * whose stage is not one of `columns` is not shown.
     */
    items: readonly T[] | undefined;
    /** A stable id for each person's card. */
    getId: (item: T) => string | number;
    /** The id of the column the person is in. */
    getStage: (item: T) => string;
    /**
     * The person's name: on the default card, and how their move menu and
     * the board's announcements name them whoever draws the card.
     */
    getName: (item: T) => string;
    /**
     * Draws a person's card, given the stage it is shown in. Defaults to a
     * `CandidatePipelineCard` with the name, which calls `onSelect`. The card
     * needs no wrapper and no drag handling of its own.
     */
    renderCard?: (item: T, stage: string) => ReactNode;
    /** Called when the default card is activated, usually to open the person. */
    onSelect?: (item: T) => void;
    /**
     * Makes the cards movable, and is called with the person and the stage
     * they were moved to, by a drag or from the card's move menu. The host
     * saves the move. If it returns a promise, the card shows in the new
     * stage at once. If the promise rejects, the card goes back to where
     * `getStage` puts it. Once it resolves, the card stays where it was
     * moved until the host says something new about the person, by passing
     * another record for them or changing their stage, and `getStage`
     * decides from then on. A callback that returns nothing leaves the card
     * where `getStage` puts it throughout.
     */
    onMove?: (item: T, toStage: string) => unknown;
    /** Skeleton cards in each column that has nobody to show yet. */
    loading?: boolean;
    /** A failed load, worded by the host, in place of the columns. */
    error?: ReactNode;
    /** The blank slate when the board holds nobody. Defaults to "No candidates yet". */
    empty?: CandidateEmptyCopy;
    /**
     * Whether a search or a filter is narrowing the board, which words the
     * blank slates ("No matches", not "No candidates"). Worked out from
     * `searchTerm` and `filters` when left out.
     */
    narrowed?: boolean;
    /** `wide` (the default) is 400px, or the screen's width if less; `narrow` is 280px. */
    columnWidth?: CandidatePipelineBoardColumnWidth;
    /**
     * `viewport` (the default) fills the screen's height, each column
     * scrolling under its own heading, so the headings and the sideways
     * scrollbar stay in view. `content` grows with the longest column.
     */
    height?: CandidatePipelineBoardHeight;
    /** The column headings' level: 3 (the default), or 2 or 4 to fit the page's outline. */
    columnHeadingLevel?: 2 | 3 | 4;
    labels?: Partial<CandidatePipelineBoardLabels>;
};
/**
 * A job's pipeline as a board: a column for each stage, a card for each
 * person, and a move between stages by dragging a card or from its move
 * menu.
 *
 * The board is the kit's (`ResourceList` in board mode), which lays the
 * columns out side by side and takes the drag, and below its 768px
 * breakpoint shows one stage at a time under a row of stage tabs. The kit
 * moves a card by mouse only, so every card also has a move menu, which is
 * how a keyboard or a touchscreen moves one, and the only control this
 * component adds: the kit's own per-card select on a phone is replaced by
 * it, so there is one at every width. Where a mouse can hover, the menu's
 * button sits over the card's corner and shows on hover or focus; anywhere
 * else it stands beside the card, always shown, at 44px on a touchscreen. A
 * move is announced to a screen reader, and focus follows a card moved from
 * its menu.
 *
 * The host owns the people, the stages, the save and the wording. `onMove`
 * may return a promise: the card then shows in its new stage while the move
 * saves, goes back if it fails, and once it is saved follows the host's
 * `items` again as soon as they say anything new about the person. Nothing
 * here searches or filters: the kit's toolbar props pass straight through,
 * each shown only when wired, and the host passes the `items` that match.
 *
 * Each column says why it is empty, a board with nobody on it shows `empty`
 * in place of its columns, `loading` draws skeleton cards and `error` a
 * failed load.
 *
 * The root is marked `data-slot="candidate-pipeline-board"`, each column's
 * heading `data-slot="candidate-pipeline-board-column"` with the stage in
 * `data-stage`, each card's wrapper `data-slot="candidate-pipeline-board-card"`
 * (`data-moving` while its move saves) and a move menu's surface
 * `data-slot="candidate-pipeline-board-menu"`.
 */
declare function CandidatePipelineBoard<T>({ columns, items, getId, getStage, getName, renderCard, onSelect, onMove, loading, error, empty, narrowed, columnWidth, height, columnHeadingLevel, labels, searchTerm, onSearchChange, searchPlaceholder, filterSchema, filters, onFiltersChange, quickFilters, quickFiltersAppearance, quickFiltersShowLabel, sortOptions, sortValue, onSortChange, actions, filterActions, toolbarSize, className, ...props }: CandidatePipelineBoardProps<T>): react.JSX.Element;

export { CandidatePipelineBoard, type CandidatePipelineBoardColumn, type CandidatePipelineBoardColumnWidth, type CandidatePipelineBoardHeight, type CandidatePipelineBoardLabels, type CandidatePipelineBoardProps, type CandidatePipelineBoardTone, type CandidatePipelineBoardToolbarProps };
