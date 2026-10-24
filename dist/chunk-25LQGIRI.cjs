"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk52HKAJMEcjs = require('./chunk-52HKAJME.cjs');


var _chunkFO63JBU3cjs = require('./chunk-FO63JBU3.cjs');


var _chunkPF3673C2cjs = require('./chunk-PF3673C2.cjs');


var _chunkRTB3COSUcjs = require('./chunk-RTB3COSU.cjs');


var _chunkYMPXXC7Bcjs = require('./chunk-YMPXXC7B.cjs');


var _chunkJ5RZWWAWcjs = require('./chunk-J5RZWWAW.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/empty-state.tsx
var _react = require('react'); var React = _interopRequireWildcard(_react);
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function EmptyState({
  variant = "select",
  icon: Icon,
  iconMotion = "none",
  title,
  description,
  action,
  entityType,
  animated = true,
  size = "md",
  children,
  className,
  showGradient = false,
  surface = "subtle",
  minHeight = "none",
  paddingY = "none"
}) {
  const autoTitle = () => {
    if (title) return title;
    switch (variant) {
      case "select":
        return entityType ? `Select ${getArticle(entityType)} ${entityType} to view details` : "Select an item to view details";
      case "search":
        return "No results found";
      case "empty":
        return entityType ? `No ${entityType}s yet` : "Nothing here yet";
      case "error":
        return "Something went wrong";
      case "success":
        return "All done";
      default:
        return "Empty";
    }
  };
  const autoDescription = () => {
    if (description !== void 0) return description;
    switch (variant) {
      case "search":
        return "Try adjusting your filters or search terms";
      case "empty":
        return "Get started by creating your first item";
      case "error":
        return "Please try again or contact support if the problem persists";
      default:
        return void 0;
    }
  };
  const sizeConfig = {
    inline: {
      icon: "h-5 w-5",
      iconWrapper: "",
      title: "text-sm",
      description: "text-xs",
      spacing: "gap-1",
      padding: "py-6",
      content: "max-w-lg"
    },
    sm: {
      icon: "h-8 w-8",
      iconWrapper: "mb-3",
      title: "text-base",
      description: "text-xs",
      spacing: "space-y-2",
      padding: "py-6",
      content: "max-w-md"
    },
    md: {
      icon: "h-10 w-10",
      iconWrapper: "mb-4",
      title: "text-lg",
      description: "text-sm",
      spacing: "space-y-3",
      padding: "py-10",
      content: "max-w-md"
    },
    lg: {
      icon: "h-12 w-12",
      iconWrapper: "mb-6",
      title: "text-xl",
      description: "text-base",
      spacing: "space-y-4",
      padding: "py-12",
      content: "max-w-3xl"
    }
  };
  const config = sizeConfig[size];
  const finalTitle = autoTitle();
  const finalDescription = autoDescription();
  const displayIcon = _nullishCoalesce(Icon, () => ( (variant === "success" ? _lucidereact.CheckCircle2 : void 0)));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-slot": "empty-state",
      "data-surface": surface,
      role: variant === "error" ? "alert" : void 0,
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "relative flex w-full items-center justify-center",
        surface === "subtle" && "overflow-hidden rounded-lg border border-border bg-muted/20",
        size === "inline" ? "h-auto" : "h-full",
        paddingY === "none" && config.padding,
        minHeight === "viewport" && "min-h-[40vh]",
        paddingY === "xl" && "py-12",
        paddingY === "lg" && "py-10",
        className
      ),
      children: [
        showGradient && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "absolute inset-0 bg-gradient-to-br from-muted/5 via-transparent to-muted/5 pointer-events-none" }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-slot": "empty-state-content",
            className: _chunk42BCVSWNcjs.cn.call(void 0,
              "relative flex w-full flex-col items-center justify-center px-6 sm:px-8",
              config.content,
              animated && "animate-in fade-in-50 duration-500"
            ),
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                "div",
                {
                  "data-slot": "empty-state-message",
                  className: _chunk42BCVSWNcjs.cn.call(void 0,
                    "flex items-center justify-center",
                    size === "inline" && displayIcon ? "flex-row gap-5 text-left" : _chunk42BCVSWNcjs.cn.call(void 0, "flex-col text-center", config.spacing)
                  ),
                  children: [
                    displayIcon && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: _chunk42BCVSWNcjs.cn.call(void 0, "relative shrink-0", config.iconWrapper), children: [
                      _react.isValidElement.call(void 0, displayIcon) ? displayIcon : (() => {
                        const IconComp = displayIcon;
                        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          IconComp,
                          {
                            className: _chunk42BCVSWNcjs.cn.call(void 0,
                              config.icon,
                              variant === "success" ? "text-emerald-500" : "text-muted-foreground",
                              iconMotion === "spin" && "animate-spin",
                              iconMotion === "pulse" && "animate-pulse",
                              animated && "animate-in zoom-in-95 duration-700 delay-150"
                            ),
                            strokeWidth: 1.5
                          }
                        );
                      })(),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "div",
                        {
                          className: _chunk42BCVSWNcjs.cn.call(void 0,
                            "absolute inset-0 blur-xl opacity-20 pointer-events-none",
                            showGradient && "bg-primary/10"
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: _chunk42BCVSWNcjs.cn.call(void 0, "flex min-w-0 flex-col", size === "inline" ? "gap-1" : "contents"), children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "h3",
                        {
                          className: _chunk42BCVSWNcjs.cn.call(void 0,
                            config.title,
                            size === "inline" ? "font-medium text-foreground" : "font-semibold text-foreground/80 tracking-tight"
                          ),
                          children: finalTitle
                        }
                      ),
                      finalDescription && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "p",
                        {
                          className: _chunk42BCVSWNcjs.cn.call(void 0,
                            config.description,
                            "text-muted-foreground max-w-sm leading-relaxed"
                          ),
                          children: finalDescription
                        }
                      )
                    ] })
                  ]
                }
              ),
              action && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-2", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chunkJ5RZWWAWcjs.Button,
                {
                  type: "button",
                  variant: action.variant || "outline",
                  onClick: action.onClick,
                  className: _chunk42BCVSWNcjs.cn.call(void 0,
                    "shadow-xs",
                    animated && "animate-in slide-in-from-bottom-2 duration-500 delay-300"
                  ),
                  children: action.label
                }
              ) }),
              children && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-3 w-full text-left", children })
            ]
          }
        )
      ]
    }
  );
}
function getArticle(word) {
  if (!word || word.length === 0) return "a";
  const vowels = ["a", "e", "i", "o", "u"];
  const firstChar = word[0];
  if (!firstChar) return "a";
  return vowels.includes(firstChar.toLowerCase()) ? "an" : "a";
}

// vendor/core/files/src/primitives/list.tsx


var spacingStyles = { none: "", tight: "space-y-1.5", normal: "space-y-3" };
var markerStyles = {
  none: "list-none",
  disc: "list-disc pl-5",
  decimal: "list-decimal pl-5"
};
var List = _react.forwardRef.call(void 0, function List2({ ordered = false, spacing = "none", marker = "none", divided = false, inset = "none", guide = false, textSize = "inherit", tone = "inherit", marginTop = "none", surface = "none", radius = "none", className, ...props }, ref) {
  const Component = ordered ? "ol" : "ul";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Component,
    {
      ref,
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        spacingStyles[spacing],
        markerStyles[marker],
        divided && "divide-y divide-border",
        inset === "xs" && "pl-1",
        inset === "md" && "pl-4",
        guide && "border-l border-border",
        textSize === "xs" && "text-xs",
        textSize === "sm" && "text-sm",
        tone === "muted" && "text-muted-foreground",
        tone === "soft" && "text-foreground/80",
        marginTop === "sm" && "mt-2",
        marginTop === "md" && "mt-4",
        surface === "bordered" && "border border-border bg-background",
        radius === "md" && "rounded-md",
        className
      ),
      ...props
    }
  );
});
var ListItem = _react.forwardRef.call(void 0, function ListItem2({ className, layout = "plain", surface = "none", padding = "none", textSize = "inherit", tone = "inherit", position = "static", justify = "start", align = "start", gap = "xs", interactiveGroup = false, radius = "none", accent = "none", ...props }, ref) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { ref, className: _chunk42BCVSWNcjs.cn.call(void 0,
    layout === "row" && "flex items-start",
    surface === "bordered" && "rounded-md border",
    padding === "sm" && "p-2",
    padding === "md" && "px-3 py-2",
    padding === "compact" && "py-2.5",
    textSize === "xs" && "text-xs",
    textSize === "sm" && "text-sm",
    tone === "soft" && "text-foreground/80",
    position === "relative" && "relative",
    justify === "between" && "justify-between gap-3",
    align === "center" && "items-center",
    align === "baseline" && "items-baseline",
    gap === "xs" && "gap-1.5",
    gap === "sm" && "gap-2",
    interactiveGroup && "group",
    radius === "md" && "rounded-md",
    accent === "success" && "border-l-2 border-emerald-500 bg-emerald-500/5",
    accent === "destructive" && "border-l-2 border-red-500 bg-red-500/5",
    className
  ), ...props });
});

// vendor/core/files/src/primitives/separator.tsx

var _reactseparator = require('@radix-ui/react-separator'); var SeparatorPrimitive = _interopRequireWildcard(_reactseparator);

var Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, grow = false, ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        grow && "flex-1",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// vendor/core/files/src/primitives/skeleton.tsx

var presets = {
  blank: "",
  line: "h-4 w-1/3",
  "line-short": "h-4 w-32",
  "line-full": "h-4 w-full",
  "line-wide": "h-4 w-2/3",
  title: "h-9 w-2/3",
  "title-full": "h-9 w-full",
  heading: "h-8 w-48",
  "heading-wide": "h-8 w-64",
  bar: "h-6 w-full",
  "control-sm": "h-10 w-full",
  control: "h-12 w-full",
  "row-compact": "h-12 w-full",
  row: "h-16 w-full",
  "row-lg": "h-20 w-full",
  panel: "h-32 w-full",
  "panel-lg": "h-40 w-full",
  article: "h-48 w-full",
  "card-sm": "h-24 w-full",
  "card-md": "h-44 w-full"
};
function Skeleton({ className, preset = "line", radius = "md", width = "preset", height = "preset", shape = "rounded", centered = false, shrink = true, marginTop = "none", ...props }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "animate-pulse bg-muted",
        shape === "circle" ? "rounded-full" : radius === "md" ? "rounded-md" : "rounded-xl",
        presets[preset],
        width === "full" && "w-full",
        width === "three-quarter" && "w-3/4",
        width === "two-third" && "w-2/3",
        width === "half" && "w-1/2",
        width === "two-fifth" && "w-2/5",
        width === "one-third" && "w-1/3",
        width === "three-fifth" && "w-3/5",
        width === "four-fifth" && "w-4/5",
        width === "sm" && "w-20",
        width === "md" && "w-24",
        height === "dot" && "h-2",
        height === "xs" && "h-2.5",
        height === "sm" && "h-3",
        height === "md" && "h-7",
        height === "lg" && "h-8",
        height === "xl" && "h-10",
        centered && "mx-auto",
        !shrink && "shrink-0",
        marginTop === "xs" && "mt-1",
        className
      ),
      ...props
    }
  );
}

// src/recruit/candidate-career-history-timeline.tsx


function CareerDateRange({
  start,
  end,
  current = false,
  presentLabel = "Present",
  locale = "en"
}) {
  const startLabel = _chunkFO63JBU3cjs.formatCalendarDate.call(void 0, start, locale);
  const endLabel = current ? presentLabel : _chunkFO63JBU3cjs.formatCalendarDate.call(void 0, end, locale);
  if (!startLabel && !endLabel) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    startLabel,
    startLabel && endLabel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \u2013 " }) : null,
    endLabel
  ] });
}
function companyGroupKey(item) {
  if (_optionalChain([item, 'access', _ => _.companyGroup, 'optionalAccess', _2 => _2.trim, 'call', _3 => _3()])) return item.companyGroup.trim().toLocaleLowerCase();
  return typeof item.company === "string" ? item.company.trim().toLocaleLowerCase() || null : null;
}
function groupConsecutiveEmployments(items) {
  return items.reduce((groups, item) => {
    const key = companyGroupKey(item);
    const previous = groups.at(-1);
    if (key && _optionalChain([previous, 'optionalAccess', _4 => _4.key]) === key) {
      previous.items.push(item);
    } else {
      groups.push({ key, items: [item] });
    }
    return groups;
  }, []);
}
function descriptionParts(description) {
  const parts = description.split(/\r?\n|\s+[•●]\s+/).map((part) => part.replace(/^[-–—•●]\s*/, "").trim()).filter(Boolean);
  return parts.length > 0 ? parts : [description.trim()];
}
function CareerDescription({ description }) {
  const [expanded, setExpanded] = _react.useState.call(void 0, false);
  if (typeof description !== "string") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTB3COSUcjs.Text, { as: "div", variant: "caption", size: "xs", tone: "subtle", children: description });
  }
  const trimmed = description.trim();
  if (!trimmed) return null;
  const parts = descriptionParts(trimmed);
  const hasMore = parts.length > 3 || parts.length === 1 && trimmed.length > 180;
  const visibleParts = expanded ? parts : parts.slice(0, 3);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "xs", children: [
    parts.length > 1 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      List,
      {
        marker: "disc",
        spacing: "tight",
        textSize: "xs",
        tone: "muted",
        className: "leading-relaxed",
        children: visibleParts.map((part, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ListItem, { children: part }, index))
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkRTB3COSUcjs.Text,
      {
        variant: "caption",
        size: "xs",
        tone: "subtle",
        lineClamp: !expanded && hasMore ? 3 : void 0,
        children: trimmed
      }
    ),
    hasMore ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunkJ5RZWWAWcjs.Button,
      {
        type: "button",
        variant: "link-muted",
        size: "bare",
        "aria-expanded": expanded,
        onClick: () => setExpanded((value) => !value),
        children: expanded ? "Show less" : "Show more"
      }
    ) : null
  ] });
}
function CareerRole({
  item,
  detailed,
  locale,
  presentLabel
}) {
  const date = _nullishCoalesce(item.dateRange, () => ( /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    CareerDateRange,
    {
      start: item.startDate,
      end: item.endDate,
      current: item.current,
      locale,
      presentLabel
    }
  )));
  const hasDate = item.dateRange != null || item.startDate != null || item.endDate != null || item.current;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "xs", minWidth: "zero", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk52HKAJMEcjs.Heading, { level: 5, children: item.title }),
    item.company != null || hasDate ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkRTB3COSUcjs.Text, { variant: "caption", size: "xs", children: [
      item.company,
      item.company != null && hasDate ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": true, children: " \xB7 " }) : null,
      hasDate ? date : null
    ] }) : null,
    detailed && item.description != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CareerDescription, { description: item.description }) : null
  ] });
}
function CandidateCareerHistoryTimeline({
  items,
  loading = false,
  emptyTitle = "No career history yet",
  emptyDescription = "Career history is not available.",
  earlierLabel = "Earlier",
  presentLabel = "Present",
  detailedCompanyGroups = 2,
  locale = "en",
  className
}) {
  if (loading && items.length === 0) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { "data-slot": "candidate-career-history-loading", gap: "compact", className, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Skeleton, { preset: "row-compact" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Skeleton, { preset: "row-compact" })
    ] });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      EmptyState,
      {
        variant: "empty",
        size: "inline",
        title: emptyTitle,
        description: emptyDescription,
        className
      }
    );
  }
  const groups = groupConsecutiveEmployments(items);
  const detailedItems = groups.slice(0, detailedCompanyGroups).flatMap((group) => group.items);
  const earlierItems = groups.slice(detailedCompanyGroups).flatMap((group) => group.items);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { "data-slot": "candidate-career-history", gap: "lg", className, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "lg", children: detailedItems.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      CareerRole,
      {
        item,
        detailed: true,
        locale,
        presentLabel
      },
      index
    )) }),
    earlierItems.length > 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkYMPXXC7Bcjs.Stack, { gap: "md", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Separator, {}),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkPF3673C2cjs.SectionHeader, { label: earlierLabel, spacing: "none" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, List, { spacing: "normal", children: earlierItems.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ListItem, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        CareerRole,
        {
          item,
          detailed: false,
          locale,
          presentLabel
        }
      ) }, index)) })
    ] }) : null
  ] });
}




exports.CareerDateRange = CareerDateRange; exports.CandidateCareerHistoryTimeline = CandidateCareerHistoryTimeline;
