"use client";

import { useIsMobile } from "@epicbagel/saas-kit/hooks/use-mobile";
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Alert } from "@epicbagel/saas-kit/primitives/alert";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge, type CountBadgeProps } from "@epicbagel/saas-kit/primitives/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { ResourceList } from "@epicbagel/saas-kit/primitives/resource-list";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ArrowRightLeft, SearchX, Users } from "lucide-react";
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";
import { CandidatePipelineCard } from "./candidate-pipeline-card";
import { COARSE_POINTER_TOUCH_TARGET } from "./touch-targets";

/** The kit Badge variant a column's count takes. */
export type CandidatePipelineBoardTone = "default" | "info" | "success" | "warning" | "destructive";

/** One stage of the pipeline, as a column. */
export interface CandidatePipelineBoardColumn {
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
export interface CandidatePipelineBoardLabels {
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

const DEFAULT_LABELS: CandidatePipelineBoardLabels = {
  move: (name) => `Move ${name} to another stage`,
  moveTo: (stage) => <>Move to {stage}</>,
  moved: (name, stage) => `Moved ${name} to ${stage}.`,
  moveFailed: (name, stage) => `${name} could not be moved to ${stage}.`,
  columnEmpty: (stage) => `No candidates in ${stage}`,
  columnEmptyDescription: "Move a card here when they reach this stage.",
  columnNoMatches: "No matches",
  columnNoMatchesDescription: (stage) => `Nobody in ${stage} matches this view.`,
  noMatches: "No candidates match this view",
  noMatchesDescription: "Clear the search or filters to see the whole pipeline.",
};

/** How wide each column is: 400px, or the screen's width if that is less, or the kit's 280px. */
export type CandidatePipelineBoardColumnWidth = "wide" | "narrow";

/** Whether the board fills the screen's height or grows with its longest column. */
export type CandidatePipelineBoardHeight = "viewport" | "content";

type ResourceListProps<T> = Parameters<typeof ResourceList<T>>[0];

/**
 * The kit list's own toolbar, passed straight through: a search box, a
 * filter menu, quick filters, a sort and two slots for the host's controls.
 * Each shows only when the host wires it. The board narrows nothing itself:
 * the host passes the `items` that match.
 */
export type CandidatePipelineBoardToolbarProps<T> = Partial<
  Pick<
    ResourceListProps<T>,
    | "searchTerm"
    | "onSearchChange"
    | "searchPlaceholder"
    | "filterSchema"
    | "filters"
    | "onFiltersChange"
    | "quickFilters"
    | "quickFiltersAppearance"
    | "quickFiltersShowLabel"
    | "sortOptions"
    | "sortValue"
    | "onSortChange"
    | "actions"
    | "filterActions"
    | "toolbarSize"
  >
>;

export type CandidatePipelineBoardProps<T> = CandidatePipelineBoardToolbarProps<T> &
  Omit<HTMLAttributes<HTMLElement>, "children" | "onSelect"> & {
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

const COLUMN_WIDTH: Record<CandidatePipelineBoardColumnWidth, string> = {
  wide: "min(400px, calc(100vw - 4rem))",
  narrow: "280px",
};
const COLUMN_MIN_HEIGHT = "300px";

// `default` is the kit board's own neutral count.
const TONE_VARIANT: Record<CandidatePipelineBoardTone, NonNullable<CountBadgeProps["variant"]>> = {
  default: "secondary",
  info: "info",
  success: "success",
  warning: "warning",
  destructive: "destructive",
};

// The kit board's own column label, so a heading reads as the kit's did.
const COLUMN_LABEL = "text-xs font-medium uppercase tracking-wider";

// The kit list keeps an empty header above its content when the host wires
// no toolbar, and spaces it from the board all the same.
const WITHOUT_EMPTY_TOOLBAR = "[&>:empty]:hidden";

// The kit's column scrolls inside a table-sized box, which grows to fit the
// longest unbroken line in any card, so one long name pushed every card in
// the column past the column's edge. A card that asks for no width and then
// takes all there is adds nothing to that measure, and its text truncates.
const CARD = "group/pipeline-card relative w-0 min-w-full";

// A mouse can drag, so a card's move menu keeps out of its way: over the
// card's bottom corner, and shown only while the card is hovered, the button
// focused or its menu open. Where nothing hovers (a touchscreen, a keyboard
// with no mouse) it stands beside the card instead, always shown, and at the
// 44px a finger needs on a touchscreen.
const MOVE_TRIGGER = [
  "transition-opacity [@media(hover:hover)]:absolute [@media(hover:hover)]:bottom-1.5",
  "[@media(hover:hover)]:right-1.5 [@media(hover:hover)]:opacity-0",
  "group-hover/pipeline-card:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
  COARSE_POINTER_TOUCH_TARGET,
].join(" ");

const KIT_ID_PREFIX = "card:";
const NO_ITEMS: readonly never[] = [];
const NO_FILTER_SCHEMA: NonNullable<ResourceListProps<unknown>["filterSchema"]> = [];
const NO_FILTERS: Record<string, unknown> = {};
const ignore = () => undefined;

/** A move the host is saving, or has saved and not yet shown in `items`. */
interface CardMove<T> {
  to: string;
  /** Tells this move from a later one of the same card. */
  token: number;
  /**
   * Set once the host's promise has resolved: the host's own record of the
   * person at that moment, and the stage it had them in.
   */
  saved?: { item: T; stage: string };
}

/**
 * Whether a move still decides where its card shows. It always does while
 * the host is saving it. Once saved, it does until the host says anything
 * new about the person, by passing another record for them or by changing
 * the stage of the one it had: from then on the host's `items` are the truth
 * again, whether or not they agree with the move.
 */
function moveApplies<T>(move: CardMove<T>, item: T, stage: string): boolean {
  return !move.saved || (move.saved.item === item && move.saved.stage === stage);
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof (value as PromiseLike<unknown>).then === "function";
}

function shown(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

function isNarrowing(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "" && value !== false;
}

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
export function CandidatePipelineBoard<T>({
  columns,
  items,
  getId,
  getStage,
  getName,
  renderCard,
  onSelect,
  onMove,
  loading = false,
  error,
  empty = { title: "No candidates yet" },
  narrowed,
  columnWidth = "wide",
  height = "viewport",
  columnHeadingLevel = 3,
  labels,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filterSchema,
  filters,
  onFiltersChange,
  quickFilters,
  quickFiltersAppearance = "underline",
  quickFiltersShowLabel,
  sortOptions,
  sortValue,
  onSortChange,
  actions,
  filterActions,
  toolbarSize,
  className,
  ...props
}: CandidatePipelineBoardProps<T>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const people: readonly T[] = items ?? NO_ITEMS;
  // The kit shows one stage at a time below its mobile breakpoint.
  const isMobile = useIsMobile();

  const [moves, setMoves] = useState<ReadonlyMap<string, CardMove<T>>>(() => new Map());
  // What the board last said to a screen reader. A new object each time, so
  // the same words are said again when the same thing happens again.
  const [announcement, setAnnouncement] = useState<{ words: string; count: number } | null>(null);
  const root = useRef<HTMLElement>(null);
  // Each card's move menu button, by card id.
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  // Each card's latest move, so an earlier one that settles late changes nothing.
  const sequence = useRef(0);
  const latestMove = useRef(new Map<string, number>());
  // The card whose move menu takes focus once the card is drawn again, and
  // whether to scroll to it there.
  const focusAfterMove = useRef<{ id: string; reveal: boolean } | null>(null);

  const cardId = (item: T) => String(getId(item));
  const shownStage = (item: T) => {
    const stage = getStage(item);
    const moved = moves.get(cardId(item));
    return moved && moveApplies(moved, item, stage) ? moved.to : stage;
  };
  const stageTitle = (stage: string) => columns.find((column) => column.id === stage)?.title ?? stage;
  const announce = (words: string) => setAnnouncement({ words, count: ++sequence.current });

  // The host's people as last drawn, for a move whose save resolves later.
  const drawn = useRef({ people, getId, getStage });
  useEffect(() => {
    drawn.current = { people, getId, getStage };
  });

  // Forget a saved move once it no longer decides anything: the host has
  // said something new about the person, or no longer has them.
  useEffect(() => {
    if (moves.size === 0) return;
    const byId = new Map(people.map((item) => [cardId(item), item]));
    const stale = [...moves].filter(([id, moved]) => {
      if (!moved.saved) return false;
      const item = byId.get(id);
      return item === undefined || !moveApplies(moved, item, getStage(item));
    });
    if (stale.length === 0) return;
    const kept = new Map(moves);
    for (const [id] of stale) kept.delete(id);
    setMoves(kept);
  });

  // A card that changes column is drawn again there, so whatever had focus
  // on it is gone: give focus to its move menu in the new place, or to the
  // board when the card is now out of sight, as on a phone. Every move is
  // announced, so this runs after each one.
  useEffect(() => {
    const next = focusAfterMove.current;
    if (next === null) return;
    focusAfterMove.current = null;
    const trigger = triggers.current.get(next.id);
    if (trigger?.isConnected) trigger.focus({ preventScroll: !next.reveal });
    else root.current?.focus({ preventScroll: true });
  });

  /** Whether focus is on the card or on its move menu button. */
  const hasFocus = (id: string) =>
    triggers.current.get(id)?.parentElement?.contains(document.activeElement) ?? false;

  const withoutMove = (current: ReadonlyMap<string, CardMove<T>>, id: string) => {
    if (!current.has(id)) return current;
    const next = new Map(current);
    next.delete(id);
    return next;
  };

  const move = (item: T, to: string, { fromMenu = false } = {}) => {
    if (!onMove || shownStage(item) === to) return;
    const id = cardId(item);
    const name = getName(item);
    const title = stageTitle(to);

    const result = onMove(item, to);
    const token = ++sequence.current;
    latestMove.current.set(id, token);
    // A menu holds focus itself while it is open, and hands it back to a
    // button that is about to go: a card moved from its menu is followed,
    // and scrolled to. A dragged card keeps focus if it had it, where it is.
    if (fromMenu || hasFocus(id)) focusAfterMove.current = { id, reveal: fromMenu };
    announce(text.moved(name, title));

    if (!isPromiseLike(result)) {
      // The host places the card itself; an earlier move of it no longer does.
      setMoves((current) => withoutMove(current, id));
      return;
    }

    setMoves((current) => new Map(current).set(id, { to, token }));
    Promise.resolve(result).then(
      () => {
        // Saved. The card stays where it was moved until the host says
        // something new about the person; if it already has them there, or
        // no longer has them at all, there is nothing left to hold.
        const host = drawn.current;
        const now = host.people.find((each) => String(host.getId(each)) === id);
        const stage = now === undefined ? to : host.getStage(now);
        setMoves((current) => {
          if (current.get(id)?.token !== token) return current;
          if (now === undefined || stage === to) return withoutMove(current, id);
          return new Map(current).set(id, { to, token, saved: { item: now, stage } });
        });
      },
      () => {
        if (latestMove.current.get(id) !== token) return;
        // The card goes back, and focus with it if it was still on the card.
        if (hasFocus(id)) focusAfterMove.current = { id, reveal: true };
        setMoves((current) => (current.get(id)?.token === token ? withoutMove(current, id) : current));
        announce(text.moveFailed(name, title));
      },
    );
  };

  // The kit hands a dropped card's id back as a number wherever it reads as
  // one, so "007" would come back as 7. A prefix keeps every id a string.
  const kitId = (item: T) => `${KIT_ID_PREFIX}${cardId(item)}`;
  const droppedItem = (dropped: string | number) => {
    const id = String(dropped).slice(KIT_ID_PREFIX.length);
    return people.find((item) => cardId(item) === id);
  };

  const hasError = shown(error);
  const isNarrowed =
    narrowed ?? (Boolean(searchTerm?.trim()) || Object.values(filters ?? NO_FILTERS).some(isNarrowing));
  // The kit's board never shows a blank slate for the whole list, only its
  // columns, so a board with nobody on it is drawn as a plain list instead.
  const isBlank = !loading && !hasError && people.length === 0;
  const HeadingTag = `h${columnHeadingLevel}` as const;

  return (
    <Stack
      ref={root}
      data-slot="candidate-pipeline-board"
      gap="none"
      minWidth="zero"
      // Focus lands here only when a moved card has left the screen.
      tabIndex={-1}
      className={cn("focus:outline-hidden", className)}
      {...props}
    >
      <span role="status" className="sr-only">
        {announcement ? <span key={announcement.count}>{announcement.words}</span> : null}
      </span>
      <ResourceList<T>
        title=""
        showTitle={false}
        variant="flush"
        containerClassName={WITHOUT_EMPTY_TOOLBAR}
        data={people as T[]}
        loading={loading}
        error={hasError ? error : null}
        refetch={ignore}
        renderError={() => <Alert variant="destructive">{error}</Alert>}
        // The host narrows `items`; the kit's own matching stays off.
        enableServerSearch
        searchTerm={searchTerm ?? ""}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        showSearch={onSearchChange != null}
        filterSchema={filterSchema ?? NO_FILTER_SCHEMA}
        filters={filters ?? NO_FILTERS}
        onFiltersChange={onFiltersChange ?? ignore}
        showFilters={(filterSchema?.length ?? 0) > 0}
        quickFilters={quickFilters}
        quickFiltersAppearance={quickFiltersAppearance}
        quickFiltersShowLabel={quickFiltersShowLabel}
        sortOptions={sortOptions}
        sortValue={sortValue}
        onSortChange={onSortChange}
        actions={actions}
        filterActions={filterActions}
        toolbarSize={toolbarSize}
        showViewToggle={false}
        viewMode={isBlank ? "card" : "board"}
        renderItem={() => null}
        renderEmpty={() =>
          isNarrowed ? (
            <EmptyState
              variant="search"
              size="md"
              icon={SearchX}
              title={text.noMatches}
              description={text.noMatchesDescription}
            />
          ) : (
            <EmptyState
              variant="empty"
              size="md"
              icon={Users}
              title={empty.title}
              // Without host wording, no description: the kit's generic one
              // ("Get started by creating...") doesn't fit a pipeline.
              description={empty.description ?? ""}
            />
          )
        }
        boardConfig={{
          columns: columns.map((column) => ({ id: column.id, label: column.title })),
          getColumnId: shownStage,
          getItemId: kitId,
          columnWidth: COLUMN_WIDTH[columnWidth],
          columnMinHeight: COLUMN_MIN_HEIGHT,
          viewport: height === "viewport" ? "bounded" : "auto",
          // The kit's drag, where it lays the columns side by side. On a
          // phone its own per-card select would stand where the move menu
          // does, so it is left out there.
          onMove:
            onMove && !isMobile
              ? (dropped, _from, to) => {
                  const item = droppedItem(dropped);
                  if (item) move(item, to);
                }
              : undefined,
          renderColumnHeader: (kitColumn, columnItems) => {
            const column = columns.find((candidate) => candidate.id === kitColumn.id);
            return (
              <Stack
                as={HeadingTag}
                data-slot="candidate-pipeline-board-column"
                data-stage={kitColumn.id}
                direction="horizontal"
                gap="sm"
                align="center"
                justify="between"
                padding="control"
                paddingY="compact"
                border="bottom"
              >
                <Text as="span" variant="inherit" truncate className={COLUMN_LABEL}>
                  {kitColumn.label}
                </Text>
                <CountBadge
                  value={column?.count ?? columnItems.length}
                  variant={TONE_VARIANT[column?.tone ?? "default"]}
                />
              </Stack>
            );
          },
          renderColumnEmpty: (kitColumn) =>
            isNarrowed ? (
              <EmptyState
                variant="search"
                size="inline"
                icon={SearchX}
                title={text.columnNoMatches}
                description={text.columnNoMatchesDescription(kitColumn.label)}
              />
            ) : (
              <EmptyState
                variant="empty"
                size="inline"
                icon={Users}
                title={text.columnEmpty(kitColumn.label)}
                // Nothing can be moved here on a board that is only read.
                description={onMove ? text.columnEmptyDescription : ""}
              />
            ),
          renderCard: (item, stage) => {
            const id = cardId(item);
            const moved = moves.get(id);
            const moving = moved !== undefined && !moved.saved;
            const others = columns.filter((column) => column.id !== stage);
            return (
              <Stack
                data-slot="candidate-pipeline-board-card"
                data-moving={moving || undefined}
                aria-busy={moving || undefined}
                direction="horizontal"
                gap="xs"
                align="center"
                opacity={moving ? "soft" : "full"}
                className={CARD}
              >
                <FlexItem grow minWidth="zero">
                  {renderCard ? (
                    renderCard(item, stage)
                  ) : (
                    <CandidatePipelineCard name={getName(item)} onSelect={() => onSelect?.(item)} />
                  )}
                </FlexItem>
                {onMove && others.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        ref={(element) => {
                          if (element) triggers.current.set(id, element);
                          else triggers.current.delete(id);
                        }}
                        type="button"
                        variant="outline"
                        size="icon-compact"
                        shrink
                        title={text.move(getName(item))}
                        className={MOVE_TRIGGER}
                      >
                        <Icon icon={ArrowRightLeft} size="sm" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" data-slot="candidate-pipeline-board-menu">
                      {others.map((column) => (
                        <DropdownMenuItem
                          key={column.id}
                          onSelect={() => move(item, column.id, { fromMenu: true })}
                        >
                          {text.moveTo(column.title)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </Stack>
            );
          },
        }}
      />
    </Stack>
  );
}
