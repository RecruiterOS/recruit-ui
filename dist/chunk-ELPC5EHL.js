import {
  CandidatePipelineCard
} from "./chunk-MMB4GPLS.js";
import {
  COARSE_POINTER_TOUCH_TARGET
} from "./chunk-YKEE5RQG.js";

// src/recruit/candidate-pipeline-board.tsx
import { useIsMobile } from "@epicbagel/saas-kit/hooks/use-mobile";
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Alert } from "@epicbagel/saas-kit/primitives/alert";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { ResourceList } from "@epicbagel/saas-kit/primitives/resource-list";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ArrowRightLeft, SearchX, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_LABELS = {
  move: (name) => `Move ${name} to another stage`,
  moveTo: (stage) => /* @__PURE__ */ jsxs(Fragment, { children: [
    "Move to ",
    stage
  ] }),
  moved: (name, stage) => `Moved ${name} to ${stage}.`,
  moveFailed: (name, stage) => `${name} could not be moved to ${stage}.`,
  columnEmpty: (stage) => `No candidates in ${stage}`,
  columnEmptyDescription: "Move a card here when they reach this stage.",
  columnNoMatches: "No matches",
  columnNoMatchesDescription: (stage) => `Nobody in ${stage} matches this view.`,
  noMatches: "No candidates match this view",
  noMatchesDescription: "Clear the search or filters to see the whole pipeline."
};
var COLUMN_WIDTH = {
  wide: "min(400px, calc(100vw - 4rem))",
  narrow: "280px"
};
var COLUMN_MIN_HEIGHT = "300px";
var TONE_VARIANT = {
  default: "secondary",
  info: "info",
  success: "success",
  warning: "warning",
  destructive: "destructive"
};
var COLUMN_LABEL = "text-xs font-medium uppercase tracking-wider";
var WITHOUT_EMPTY_TOOLBAR = "[&>:empty]:hidden";
var CARD = "group/pipeline-card relative w-0 min-w-full";
var MOVE_TRIGGER = [
  "transition-opacity [@media(hover:hover)]:absolute [@media(hover:hover)]:bottom-1.5",
  "[@media(hover:hover)]:right-1.5 [@media(hover:hover)]:opacity-0",
  "group-hover/pipeline-card:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
  COARSE_POINTER_TOUCH_TARGET
].join(" ");
var KIT_ID_PREFIX = "card:";
var NO_ITEMS = [];
var NO_FILTER_SCHEMA = [];
var NO_FILTERS = {};
var ignore = () => void 0;
function moveApplies(move, item, stage) {
  return !move.saved || move.saved.item === item && move.saved.stage === stage;
}
function isPromiseLike(value) {
  return value != null && typeof value.then === "function";
}
function shown(node) {
  return node != null && node !== false && node !== "";
}
function isNarrowing(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== void 0 && value !== null && value !== "" && value !== false;
}
function CandidatePipelineBoard({
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
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const people = items ?? NO_ITEMS;
  const isMobile = useIsMobile();
  const [moves, setMoves] = useState(() => /* @__PURE__ */ new Map());
  const [announcement, setAnnouncement] = useState(null);
  const root = useRef(null);
  const triggers = useRef(/* @__PURE__ */ new Map());
  const sequence = useRef(0);
  const latestMove = useRef(/* @__PURE__ */ new Map());
  const focusAfterMove = useRef(null);
  const cardId = (item) => String(getId(item));
  const shownStage = (item) => {
    const stage = getStage(item);
    const moved = moves.get(cardId(item));
    return moved && moveApplies(moved, item, stage) ? moved.to : stage;
  };
  const stageTitle = (stage) => columns.find((column) => column.id === stage)?.title ?? stage;
  const announce = (words) => setAnnouncement({ words, count: ++sequence.current });
  const drawn = useRef({ people, getId, getStage });
  useEffect(() => {
    drawn.current = { people, getId, getStage };
  });
  useEffect(() => {
    if (moves.size === 0) return;
    const byId = new Map(people.map((item) => [cardId(item), item]));
    const stale = [...moves].filter(([id, moved]) => {
      if (!moved.saved) return false;
      const item = byId.get(id);
      return item === void 0 || !moveApplies(moved, item, getStage(item));
    });
    if (stale.length === 0) return;
    const kept = new Map(moves);
    for (const [id] of stale) kept.delete(id);
    setMoves(kept);
  });
  useEffect(() => {
    const next = focusAfterMove.current;
    if (next === null) return;
    focusAfterMove.current = null;
    const trigger = triggers.current.get(next.id);
    if (trigger?.isConnected) trigger.focus({ preventScroll: !next.reveal });
    else root.current?.focus({ preventScroll: true });
  });
  const hasFocus = (id) => triggers.current.get(id)?.parentElement?.contains(document.activeElement) ?? false;
  const withoutMove = (current, id) => {
    if (!current.has(id)) return current;
    const next = new Map(current);
    next.delete(id);
    return next;
  };
  const move = (item, to, { fromMenu = false } = {}) => {
    if (!onMove || shownStage(item) === to) return;
    const id = cardId(item);
    const name = getName(item);
    const title = stageTitle(to);
    const result = onMove(item, to);
    const token = ++sequence.current;
    latestMove.current.set(id, token);
    if (fromMenu || hasFocus(id)) focusAfterMove.current = { id, reveal: fromMenu };
    announce(text.moved(name, title));
    if (!isPromiseLike(result)) {
      setMoves((current) => withoutMove(current, id));
      return;
    }
    setMoves((current) => new Map(current).set(id, { to, token }));
    Promise.resolve(result).then(
      () => {
        const host = drawn.current;
        const now = host.people.find((each) => String(host.getId(each)) === id);
        const stage = now === void 0 ? to : host.getStage(now);
        setMoves((current) => {
          if (current.get(id)?.token !== token) return current;
          if (now === void 0 || stage === to) return withoutMove(current, id);
          return new Map(current).set(id, { to, token, saved: { item: now, stage } });
        });
      },
      () => {
        if (latestMove.current.get(id) !== token) return;
        if (hasFocus(id)) focusAfterMove.current = { id, reveal: true };
        setMoves((current) => current.get(id)?.token === token ? withoutMove(current, id) : current);
        announce(text.moveFailed(name, title));
      }
    );
  };
  const kitId = (item) => `${KIT_ID_PREFIX}${cardId(item)}`;
  const droppedItem = (dropped) => {
    const id = String(dropped).slice(KIT_ID_PREFIX.length);
    return people.find((item) => cardId(item) === id);
  };
  const hasError = shown(error);
  const isNarrowed = narrowed ?? (Boolean(searchTerm?.trim()) || Object.values(filters ?? NO_FILTERS).some(isNarrowing));
  const isBlank = !loading && !hasError && people.length === 0;
  const HeadingTag = `h${columnHeadingLevel}`;
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      ref: root,
      "data-slot": "candidate-pipeline-board",
      gap: "none",
      minWidth: "zero",
      tabIndex: -1,
      className: cn("focus:outline-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { role: "status", className: "sr-only", children: announcement ? /* @__PURE__ */ jsx("span", { children: announcement.words }, announcement.count) : null }),
        /* @__PURE__ */ jsx(
          ResourceList,
          {
            title: "",
            showTitle: false,
            variant: "flush",
            containerClassName: WITHOUT_EMPTY_TOOLBAR,
            data: people,
            loading,
            error: hasError ? error : null,
            refetch: ignore,
            renderError: () => /* @__PURE__ */ jsx(Alert, { variant: "destructive", children: error }),
            enableServerSearch: true,
            searchTerm: searchTerm ?? "",
            onSearchChange,
            searchPlaceholder,
            showSearch: onSearchChange != null,
            filterSchema: filterSchema ?? NO_FILTER_SCHEMA,
            filters: filters ?? NO_FILTERS,
            onFiltersChange: onFiltersChange ?? ignore,
            showFilters: (filterSchema?.length ?? 0) > 0,
            quickFilters,
            quickFiltersAppearance,
            quickFiltersShowLabel,
            sortOptions,
            sortValue,
            onSortChange,
            actions,
            filterActions,
            toolbarSize,
            showViewToggle: false,
            viewMode: isBlank ? "card" : "board",
            renderItem: () => null,
            renderEmpty: () => isNarrowed ? /* @__PURE__ */ jsx(
              EmptyState,
              {
                variant: "search",
                size: "md",
                icon: SearchX,
                title: text.noMatches,
                description: text.noMatchesDescription
              }
            ) : /* @__PURE__ */ jsx(
              EmptyState,
              {
                variant: "empty",
                size: "md",
                icon: Users,
                title: empty.title,
                description: empty.description ?? ""
              }
            ),
            boardConfig: {
              columns: columns.map((column) => ({ id: column.id, label: column.title })),
              getColumnId: shownStage,
              getItemId: kitId,
              columnWidth: COLUMN_WIDTH[columnWidth],
              columnMinHeight: COLUMN_MIN_HEIGHT,
              viewport: height === "viewport" ? "bounded" : "auto",
              // The kit's drag, where it lays the columns side by side. On a
              // phone its own per-card select would stand where the move menu
              // does, so it is left out there.
              onMove: onMove && !isMobile ? (dropped, _from, to) => {
                const item = droppedItem(dropped);
                if (item) move(item, to);
              } : void 0,
              renderColumnHeader: (kitColumn, columnItems) => {
                const column = columns.find((candidate) => candidate.id === kitColumn.id);
                return /* @__PURE__ */ jsxs(
                  Stack,
                  {
                    as: HeadingTag,
                    "data-slot": "candidate-pipeline-board-column",
                    "data-stage": kitColumn.id,
                    direction: "horizontal",
                    gap: "sm",
                    align: "center",
                    justify: "between",
                    padding: "control",
                    paddingY: "compact",
                    border: "bottom",
                    children: [
                      /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", truncate: true, className: COLUMN_LABEL, children: kitColumn.label }),
                      /* @__PURE__ */ jsx(
                        CountBadge,
                        {
                          value: column?.count ?? columnItems.length,
                          variant: TONE_VARIANT[column?.tone ?? "default"]
                        }
                      )
                    ]
                  }
                );
              },
              renderColumnEmpty: (kitColumn) => isNarrowed ? /* @__PURE__ */ jsx(
                EmptyState,
                {
                  variant: "search",
                  size: "inline",
                  icon: SearchX,
                  title: text.columnNoMatches,
                  description: text.columnNoMatchesDescription(kitColumn.label)
                }
              ) : /* @__PURE__ */ jsx(
                EmptyState,
                {
                  variant: "empty",
                  size: "inline",
                  icon: Users,
                  title: text.columnEmpty(kitColumn.label),
                  description: onMove ? text.columnEmptyDescription : ""
                }
              ),
              renderCard: (item, stage) => {
                const id = cardId(item);
                const moved = moves.get(id);
                const moving = moved !== void 0 && !moved.saved;
                const others = columns.filter((column) => column.id !== stage);
                return /* @__PURE__ */ jsxs(
                  Stack,
                  {
                    "data-slot": "candidate-pipeline-board-card",
                    "data-moving": moving || void 0,
                    "aria-busy": moving || void 0,
                    direction: "horizontal",
                    gap: "xs",
                    align: "center",
                    opacity: moving ? "soft" : "full",
                    className: CARD,
                    children: [
                      /* @__PURE__ */ jsx(FlexItem, { grow: true, minWidth: "zero", children: renderCard ? renderCard(item, stage) : /* @__PURE__ */ jsx(CandidatePipelineCard, { name: getName(item), onSelect: () => onSelect?.(item) }) }),
                      onMove && others.length > 0 ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                          Button,
                          {
                            ref: (element) => {
                              if (element) triggers.current.set(id, element);
                              else triggers.current.delete(id);
                            },
                            type: "button",
                            variant: "outline",
                            size: "icon-compact",
                            shrink: true,
                            title: text.move(getName(item)),
                            className: MOVE_TRIGGER,
                            children: /* @__PURE__ */ jsx(Icon, { icon: ArrowRightLeft, size: "sm" })
                          }
                        ) }),
                        /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", "data-slot": "candidate-pipeline-board-menu", children: others.map((column) => /* @__PURE__ */ jsx(
                          DropdownMenuItem,
                          {
                            onSelect: () => move(item, column.id, { fromMenu: true }),
                            children: text.moveTo(column.title)
                          },
                          column.id
                        )) })
                      ] }) : null
                    ]
                  }
                );
              }
            }
          }
        )
      ]
    }
  );
}

export {
  CandidatePipelineBoard
};
