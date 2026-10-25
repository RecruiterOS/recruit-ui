"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunk4VHYW2RDcjs = require('./chunk-4VHYW2RD.cjs');

// src/recruit/matched-call-card.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _callcard = require('@epicbagel/saas-kit/primitives/call-card');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _input = require('@epicbagel/saas-kit/primitives/input');
var _list = require('@epicbagel/saas-kit/primitives/list');






var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_LABELS = {
  untitled: "Untitled call",
  showTranscript: "Show full transcript",
  peopleSeparator: " and ",
  openPerson: (name) => `Open ${name}`,
  insights: "Call insights",
  generate: "Generate",
  regenerate: "Regenerate",
  noRolesTitle: "No suggested roles yet",
  noRolesDescription: "No other live role fits this person from this call.",
  linkPerson: "Link another person",
  linkTitle: "Link this call to another person",
  searchPlaceholder: "Search people\u2026",
  searching: "Searching\u2026",
  noMatchesTitle: "No people match that name",
  noMatchesDescription: "Try a different name or spelling."
};
var isShown = (node) => node != null && node !== false && node !== "";
var noSearch = async () => [];
function MatchedCallCard({
  title,
  people = [],
  onOpenPerson,
  source,
  timestamp,
  participants,
  summary,
  transcript,
  segments,
  loadTranscript,
  linkPerson,
  insights,
  roleMatches,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = _chunk4VHYW2RDcjs.useCallTranscript.call(void 0, { transcript, segments, loadTranscript });
  const [linkOpen, setLinkOpen] = _react.useState.call(void 0, false);
  const [query, setQuery] = _react.useState.call(void 0, "");
  const [linking, setLinking] = _react.useState.call(void 0, false);
  const { results, searching } = _chunk4VHYW2RDcjs.useCallPeopleSearch.call(void 0,
    query,
    linkOpen && linkPerson != null,
    _nullishCoalesce(_optionalChain([linkPerson, 'optionalAccess', _ => _.searchPeople]), () => ( noSearch))
  );
  const ready = insights.status === "ready";
  async function link(person) {
    if (!linkPerson) return;
    setLinking(true);
    try {
      await linkPerson.onLink(person);
      setLinkOpen(false);
      setQuery("");
    } catch (e) {
    } finally {
      setLinking(false);
    }
  }
  const heading = people.length > 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", wrap: true, children: people.map((person, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react.Fragment, { children: [
    index > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", children: text.peopleSeparator }),
    onOpenPerson ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        variant: "ghost",
        size: "compact",
        onClick: () => onOpenPerson(person),
        "aria-label": text.openPerson(person.name),
        children: person.name
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", children: person.name })
  ] }, person.id)) }) : title || text.untitled;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _callcard.CallCard,
      {
        className,
        title: heading,
        source,
        timestamp,
        participants,
        summary,
        headerAside: linkPerson ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "outline", size: "compact", onClick: () => setLinkOpen(true), disabled: linking, children: text.linkPerson }) : void 0,
        transcript: call.transcript,
        segments: call.segments,
        transcriptLabel: text.showTranscript,
        onLoadTranscript: call.onLoadTranscript,
        actions: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", width: "full", textAlign: "start", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", justify: "between", align: "center", children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Sparkles, size: "sm" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", weight: "medium", children: text.insights })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { variant: "ghost", size: "compact", onClick: () => insights.onGenerate(ready), disabled: insights.generating, children: [
              insights.generating ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "sm", spin: true }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Sparkles, size: "sm" }),
              " ",
              ready ? text.regenerate : text.generate
            ] })
          ] }),
          ready && (isShown(roleMatches) ? roleMatches : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _emptystate.EmptyState,
            {
              variant: "empty",
              size: "inline",
              icon: _lucidereact.BriefcaseBusiness,
              title: text.noRolesTitle,
              description: text.noRolesDescription
            }
          )),
          insights.error && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "destructive", children: insights.error })
        ] })
      }
    ),
    linkPerson && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open: linkOpen, onOpenChange: setLinkOpen, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.linkTitle }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { value: query, onChange: (event) => setQuery(event.target.value), placeholder: text.searchPlaceholder, autoFocus: true }),
        searching && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "small", tone: "muted", children: text.searching }),
        results.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.List, { surface: "bordered", radius: "md", children: results.map((person) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _list.ListItem, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { variant: "ghost", width: "full", align: "start", onClick: () => void link(person), disabled: linking, children: person.name }) }, person.id)) }),
        !searching && query.trim().length >= _chunk4VHYW2RDcjs.CALL_PEOPLE_SEARCH_MIN_LENGTH && results.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _emptystate.EmptyState,
          {
            variant: "search",
            size: "inline",
            icon: _lucidereact.UserSearch,
            title: text.noMatchesTitle,
            description: text.noMatchesDescription
          }
        )
      ] }) })
    ] }) })
  ] });
}



exports.MatchedCallCard = MatchedCallCard;
