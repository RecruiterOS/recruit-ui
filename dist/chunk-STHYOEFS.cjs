"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkLAOJ26MOcjs = require('./chunk-LAOJ26MO.cjs');


var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');

// src/recruit/candidate-pipeline-board.tsx
var _usemobile = require('@epicbagel/saas-kit/hooks/use-mobile');
var _utils = require('@epicbagel/saas-kit/lib/utils');
var _alert = require('@epicbagel/saas-kit/primitives/alert');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _countbadge = require('@epicbagel/saas-kit/primitives/count-badge');





var _dropdownmenu = require('@epicbagel/saas-kit/primitives/dropdown-menu');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _resourcelist = require('@epicbagel/saas-kit/primitives/resource-list');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  move: (name) => `Move ${name} to another stage`,
  moveTo: (stage) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
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
  _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGET
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
  const people = _nullishCoalesce(items, () => ( NO_ITEMS));
  const isMobile = _usemobile.useIsMobile.call(void 0, );
  const [moves, setMoves] = _react.useState.call(void 0, () => /* @__PURE__ */ new Map());
  const [announcement, setAnnouncement] = _react.useState.call(void 0, null);
  const root = _react.useRef.call(void 0, null);
  const triggers = _react.useRef.call(void 0, /* @__PURE__ */ new Map());
  const sequence = _react.useRef.call(void 0, 0);
  const latestMove = _react.useRef.call(void 0, /* @__PURE__ */ new Map());
  const focusAfterMove = _react.useRef.call(void 0, null);
  const cardId = (item) => String(getId(item));
  const shownStage = (item) => {
    const stage = getStage(item);
    const moved = moves.get(cardId(item));
    return moved && moveApplies(moved, item, stage) ? moved.to : stage;
  };
  const stageTitle = (stage) => _nullishCoalesce(_optionalChain([columns, 'access', _ => _.find, 'call', _2 => _2((column) => column.id === stage), 'optionalAccess', _3 => _3.title]), () => ( stage));
  const announce = (words) => setAnnouncement({ words, count: ++sequence.current });
  const drawn = _react.useRef.call(void 0, { people, getId, getStage });
  _react.useEffect.call(void 0, () => {
    drawn.current = { people, getId, getStage };
  });
  _react.useEffect.call(void 0, () => {
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
  _react.useEffect.call(void 0, () => {
    const next = focusAfterMove.current;
    if (next === null) return;
    focusAfterMove.current = null;
    const trigger = triggers.current.get(next.id);
    if (_optionalChain([trigger, 'optionalAccess', _4 => _4.isConnected])) trigger.focus({ preventScroll: !next.reveal });
    else _optionalChain([root, 'access', _5 => _5.current, 'optionalAccess', _6 => _6.focus, 'call', _7 => _7({ preventScroll: true })]);
  });
  const hasFocus = (id) => _nullishCoalesce(_optionalChain([triggers, 'access', _8 => _8.current, 'access', _9 => _9.get, 'call', _10 => _10(id), 'optionalAccess', _11 => _11.parentElement, 'optionalAccess', _12 => _12.contains, 'call', _13 => _13(document.activeElement)]), () => ( false));
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
          if (_optionalChain([current, 'access', _14 => _14.get, 'call', _15 => _15(id), 'optionalAccess', _16 => _16.token]) !== token) return current;
          if (now === void 0 || stage === to) return withoutMove(current, id);
          return new Map(current).set(id, { to, token, saved: { item: now, stage } });
        });
      },
      () => {
        if (latestMove.current.get(id) !== token) return;
        if (hasFocus(id)) focusAfterMove.current = { id, reveal: true };
        setMoves((current) => _optionalChain([current, 'access', _17 => _17.get, 'call', _18 => _18(id), 'optionalAccess', _19 => _19.token]) === token ? withoutMove(current, id) : current);
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
  const isNarrowed = _nullishCoalesce(narrowed, () => ( (Boolean(_optionalChain([searchTerm, 'optionalAccess', _20 => _20.trim, 'call', _21 => _21()])) || Object.values(_nullishCoalesce(filters, () => ( NO_FILTERS))).some(isNarrowing))));
  const isBlank = !loading && !hasError && people.length === 0;
  const HeadingTag = `h${columnHeadingLevel}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      ref: root,
      "data-slot": "candidate-pipeline-board",
      gap: "none",
      minWidth: "zero",
      tabIndex: -1,
      className: _utils.cn.call(void 0, "focus:outline-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "status", className: "sr-only", children: announcement ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: announcement.words }, announcement.count) : null }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _resourcelist.ResourceList,
          {
            title: "",
            showTitle: false,
            variant: "flush",
            containerClassName: WITHOUT_EMPTY_TOOLBAR,
            data: people,
            loading,
            error: hasError ? error : null,
            refetch: ignore,
            renderError: () => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.Alert, { variant: "destructive", children: error }),
            enableServerSearch: true,
            searchTerm: _nullishCoalesce(searchTerm, () => ( "")),
            onSearchChange,
            searchPlaceholder,
            showSearch: onSearchChange != null,
            filterSchema: _nullishCoalesce(filterSchema, () => ( NO_FILTER_SCHEMA)),
            filters: _nullishCoalesce(filters, () => ( NO_FILTERS)),
            onFiltersChange: _nullishCoalesce(onFiltersChange, () => ( ignore)),
            showFilters: (_nullishCoalesce(_optionalChain([filterSchema, 'optionalAccess', _22 => _22.length]), () => ( 0))) > 0,
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
            renderEmpty: () => isNarrowed ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _emptystate.EmptyState,
              {
                variant: "search",
                size: "md",
                icon: _lucidereact.SearchX,
                title: text.noMatches,
                description: text.noMatchesDescription
              }
            ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _emptystate.EmptyState,
              {
                variant: "empty",
                size: "md",
                icon: _lucidereact.Users,
                title: empty.title,
                description: _nullishCoalesce(empty.description, () => ( ""))
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
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  _stack.Stack,
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
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", truncate: true, className: COLUMN_LABEL, children: kitColumn.label }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        _countbadge.CountBadge,
                        {
                          value: _nullishCoalesce(_optionalChain([column, 'optionalAccess', _23 => _23.count]), () => ( columnItems.length)),
                          variant: TONE_VARIANT[_nullishCoalesce(_optionalChain([column, 'optionalAccess', _24 => _24.tone]), () => ( "default"))]
                        }
                      )
                    ]
                  }
                );
              },
              renderColumnEmpty: (kitColumn) => isNarrowed ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _emptystate.EmptyState,
                {
                  variant: "search",
                  size: "inline",
                  icon: _lucidereact.SearchX,
                  title: text.columnNoMatches,
                  description: text.columnNoMatchesDescription(kitColumn.label)
                }
              ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _emptystate.EmptyState,
                {
                  variant: "empty",
                  size: "inline",
                  icon: _lucidereact.Users,
                  title: text.columnEmpty(kitColumn.label),
                  description: onMove ? text.columnEmptyDescription : ""
                }
              ),
              renderCard: (item, stage) => {
                const id = cardId(item);
                const moved = moves.get(id);
                const moving = moved !== void 0 && !moved.saved;
                const others = columns.filter((column) => column.id !== stage);
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  _stack.Stack,
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
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: renderCard ? renderCard(item, stage) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLAOJ26MOcjs.CandidatePipelineCard, { name: getName(item), onSelect: () => _optionalChain([onSelect, 'optionalCall', _25 => _25(item)]) }) }),
                      onMove && others.length > 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _dropdownmenu.DropdownMenu, { children: [
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          _button.Button,
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
                            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.ArrowRightLeft, size: "sm" })
                          }
                        ) }),
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _dropdownmenu.DropdownMenuContent, { align: "end", "data-slot": "candidate-pipeline-board-menu", children: others.map((column) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          _dropdownmenu.DropdownMenuItem,
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



exports.CandidatePipelineBoard = CandidatePipelineBoard;
