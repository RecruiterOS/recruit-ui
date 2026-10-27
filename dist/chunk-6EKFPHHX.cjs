"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk73CVHR52cjs = require('./chunk-73CVHR52.cjs');


var _chunkGVQPJCZ6cjs = require('./chunk-GVQPJCZ6.cjs');



var _chunkD5BXTRVNcjs = require('./chunk-D5BXTRVN.cjs');

// src/recruit/job-brief-card.tsx
var _alert = require('@epicbagel/saas-kit/primitives/alert');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _card = require('@epicbagel/saas-kit/primitives/card');
var _collapsiblesection = require('@epicbagel/saas-kit/primitives/collapsible-section');
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _editablelist = require('@epicbagel/saas-kit/primitives/editable-list');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _list = require('@epicbagel/saas-kit/primitives/list');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  processing: "Reading your document. The brief will fill in shortly.",
  processingTitle: "Reading your document",
  processingDescription: "The brief will fill in shortly.",
  showMore: (hidden) => hidden > 0 ? `Show full brief (${hidden} more)` : "Show full brief",
  showLess: "Show less"
};
var RULE_KINDS = ["mustHaves", "niceToHaves", "redFlags"];
var NO_ITEMS = [];
var NO_FACTS = [];
var NO_SECTIONS = [];
var SENTIMENT = {
  mustHaves: "positive",
  niceToHaves: "warning",
  redFlags: "negative"
};
var ITEM_NAME = {
  mustHaves: "mustHaveItem",
  niceToHaves: "niceToHaveItem",
  redFlags: "redFlagItem"
};
var COLLAPSIBLE_TRIGGER = "gap-4 p-[26px] text-[length:inherit] data-[state=open]:pb-4";
var COLLAPSIBLE_BODY = "px-[26px] pb-[26px]";
var SECTION_LABEL = "text-xs font-medium uppercase tracking-wider";
var RULE_LIST = "[&_li]:[overflow-wrap:anywhere] [&_li>*]:min-w-0";
var EDITABLE_LIST = [
  "pointer-coarse:[&_button]:opacity-100",
  "pointer-coarse:[&_input]:min-h-[max(44px,2.75rem)]",
  "pointer-coarse:[&_li]:items-center",
  "pointer-coarse:[&_li>:first-child]:mt-0",
  _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGETS_WITHIN
].join(" ");
function present(value) {
  return value != null && value !== false && value !== "";
}
function sectionRows(section) {
  return (_nullishCoalesce(_optionalChain([section, 'access', _ => _.facts, 'optionalAccess', _2 => _2.length]), () => ( 0))) + (_nullishCoalesce(_optionalChain([section, 'access', _3 => _3.items, 'optionalAccess', _4 => _4.length]), () => ( 0)));
}
function BriefHeader({
  title,
  status,
  titleId,
  statusId,
  heading
}) {
  const as = heading ? "div" : "span";
  return (
    // In the trigger the row takes the width the chevron leaves.
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { as, direction: "horizontal", gap: "md", align: "start", justify: "between", grow: !heading, minWidth: "zero", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { as, grow: true, minWidth: "zero", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { id: titleId, level: 3, as: _nullishCoalesce(heading, () => ( "span")), children: title }) }),
      present(status) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { as, id: statusId, shrink: false, children: status }) : null
    ] })
  );
}
function BriefFacts({ facts, bordered }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { variant: "divided", className: bordered ? "border-t" : void 0, children: facts.map((fact) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: fact.label, children: fact.value }, fact.id)) });
}
function RuleList({
  kind,
  items,
  label,
  itemName,
  level,
  onRulesChange
}) {
  const [pending, save, sent] = _chunkGVQPJCZ6cjs.usePendingCall.call(void 0, onRulesChange);
  const shown = pending && sent ? sent[1] : items;
  if (!onRulesChange && shown.length === 0) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "job-brief-rule-list", "data-kind": kind, "aria-busy": pending || void 0, gap: "none", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _editablelist.EditableList,
    {
      label: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "heading", "aria-level": level, children: label }),
      itemName,
      sentiment: SENTIMENT[kind],
      items: [...shown],
      onChange: onRulesChange ? (next) => save(kind, next) : void 0,
      className: onRulesChange ? `${RULE_LIST} ${EDITABLE_LIST}` : RULE_LIST
    }
  ) });
}
function BriefSection({ section, level }) {
  const facts = _nullishCoalesce(section.facts, () => ( NO_FACTS));
  const items = _nullishCoalesce(section.items, () => ( []));
  if (facts.length === 0 && items.length === 0) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "job-brief-section", border: "top", paddingTop: "base", gap: "compact", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: `h${level}`, variant: "inherit", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "caption", className: SECTION_LABEL, children: section.title }) }),
    facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BriefFacts, { facts }) : null,
    items.length > 0 ? (
      // The rule lists' rhythm: small type, 12px between entries.
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _list.List,
        {
          ordered: section.ordered,
          marker: section.ordered ? "decimal" : "disc",
          spacing: "normal",
          textSize: "sm",
          children: items.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: item }, index))
        }
      )
    ) : null
  ] });
}
function JobBriefCard({
  presentation = "collapsible",
  title = _chunk73CVHR52cjs.jobBriefLabels.title,
  titleLevel = 2,
  status,
  description,
  facts = NO_FACTS,
  mustHaves = NO_ITEMS,
  niceToHaves = NO_ITEMS,
  redFlags = NO_ITEMS,
  rules = RULE_KINDS,
  onRulesChange,
  sections = NO_SECTIONS,
  footer,
  processing = false,
  loading = false,
  open,
  defaultOpen = false,
  onOpenChange,
  previewCount = 3,
  empty = { title: "No brief yet" },
  ruleLabels,
  labels,
  ...props
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const ruleText = { ..._chunk73CVHR52cjs.jobBriefLabels, ...ruleLabels };
  const titleId = _react.useId.call(void 0, );
  const statusId = _react.useId.call(void 0, );
  const bodyId = _react.useId.call(void 0, );
  const labelledBy = present(status) ? `${titleId} ${statusId}` : titleId;
  const header = (heading) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BriefHeader, { title, status, titleId, statusId, heading });
  const [openState, setOpenState] = _react.useState.call(void 0, defaultOpen);
  const expanded = _nullishCoalesce(open, () => ( openState));
  const setExpanded = (next) => {
    if (open === void 0) setOpenState(next);
    _optionalChain([onOpenChange, 'optionalCall', _5 => _5(next)]);
  };
  const returnTo = _react.useRef.call(void 0, null);
  _react.useEffect.call(void 0, () => {
    const card = returnTo.current;
    if (expanded || !card) return;
    returnTo.current = null;
    if (typeof card.scrollIntoView === "function") card.scrollIntoView({ block: "nearest" });
  }, [expanded]);
  const lists = { mustHaves, niceToHaves, redFlags };
  const shownRules = rules.filter((kind, index) => RULE_KINDS.includes(kind) && rules.indexOf(kind) === index);
  const editable = onRulesChange != null;
  const subLevel = presentation === "collapsible" ? titleLevel : titleLevel + 1;
  const hasDescription = present(description);
  const hasContent = hasDescription || facts.length > 0 || shownRules.some((kind) => lists[kind].length > 0) || sections.some((section) => sectionRows(section) > 0);
  const state = hasContent ? "content" : loading ? "loading" : editable ? "content" : processing ? "processing" : "empty";
  const blank = state === "loading" ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "job-brief-loading", "aria-busy": true, gap: "sm", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "line-full" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "line-wide" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: "row-compact" })
  ] }) : state === "processing" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _emptystate.EmptyState,
    {
      variant: "empty",
      size: "inline",
      icon: _lucidereact.Loader2,
      iconMotion: "spin",
      title: text.processingTitle,
      description: text.processingDescription
    }
  ) : state === "empty" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _emptystate.EmptyState,
    {
      variant: "empty",
      size: "inline",
      icon: _lucidereact.FileText,
      title: empty.title,
      description: _nullishCoalesce(empty.description, () => ( ""))
    }
  ) : null;
  const notice = processing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _alert.Alert, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "sm", spin: true }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.AlertDescription, { children: text.processing })
  ] }) : null;
  const ruleList = (kind, items, canEdit) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    RuleList,
    {
      kind,
      items,
      label: ruleText[kind],
      itemName: ruleText[ITEM_NAME[kind]],
      level: subLevel,
      onRulesChange: canEdit ? onRulesChange : void 0
    },
    kind
  );
  const fullBody = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    notice,
    hasDescription ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "caption", children: description }) : null,
    facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BriefFacts, { facts, bordered: true }) : null,
    shownRules.map((kind) => ruleList(kind, lists[kind], editable)),
    sections.map((section) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BriefSection, { section, level: subLevel }, section.id))
  ] });
  if (presentation === "collapsible") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _stack.Stack,
      {
        as: "section",
        "data-slot": "job-brief-card",
        "data-presentation": "collapsible",
        "aria-labelledby": labelledBy,
        gap: "none",
        ...props,
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _card.Card, { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          _collapsiblesection.CollapsibleSection,
          {
            title: header(),
            open,
            defaultOpen,
            onOpenChange,
            density: "roomy",
            divided: false,
            inset: "none",
            triggerClassName: COLLAPSIBLE_TRIGGER,
            contentClassName: COLLAPSIBLE_BODY,
            children: [
              _nullishCoalesce(blank, () => ( fullBody)),
              state === "loading" ? null : footer
            ]
          }
        ) })
      }
    );
  }
  const count = Math.max(0, Math.floor(previewCount));
  const first = _nullishCoalesce(shownRules.find((kind) => lists[kind].length > 0), () => ( shownRules[0]));
  const hidden = Math.max(0, facts.length - count) + shownRules.reduce(
    (sum, kind) => sum + (kind === first ? Math.max(0, lists[kind].length - count) : lists[kind].length),
    0
  ) + sections.reduce((sum, section) => sum + sectionRows(section), 0);
  const hasToggle = state === "content" && (hidden > 0 || editable);
  const full = !hasToggle || expanded;
  const hasBody = full || notice !== null || hasDescription || count > 0 && (facts.length > 0 || first !== void 0 && lists[first].length > 0);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _stack.Stack,
    {
      as: "section",
      "data-slot": "job-brief-card",
      "data-presentation": "preview",
      "aria-labelledby": labelledBy,
      gap: "none",
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _card.Card, { padding: "md", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
        header(`h${titleLevel}`),
        _nullishCoalesce(blank, () => ( (hasBody ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { id: bodyId, gap: "md", children: full ? fullBody : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          notice,
          hasDescription ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "caption", lineClamp: 2, children: description }) : null,
          count > 0 && facts.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BriefFacts, { facts: facts.slice(0, count), bordered: true }) : null,
          count > 0 && first ? ruleList(first, lists[first].slice(0, count), false) : null
        ] }) }) : null))),
        hasToggle ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "none", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _button.Button,
          {
            type: "button",
            variant: "link-muted",
            size: "bare",
            align: "start",
            "aria-expanded": expanded,
            "aria-controls": expanded ? bodyId : void 0,
            onClick: (event) => {
              if (expanded) {
                returnTo.current = event.currentTarget.closest('[data-slot="job-brief-card"]');
              }
              setExpanded(!expanded);
            },
            className: _chunkD5BXTRVNcjs.COARSE_POINTER_TOUCH_TARGET,
            children: expanded ? text.showLess : text.showMore(hidden)
          }
        ) }) : null,
        state === "loading" ? null : footer
      ] }) })
    }
  );
}



exports.JobBriefCard = JobBriefCard;
