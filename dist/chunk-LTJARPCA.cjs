"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkL2JVZDKScjs = require('./chunk-L2JVZDKS.cjs');

// src/recruit/candidate-share-dialog.tsx
var _alert = require('@epicbagel/saas-kit/primitives/alert');
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');






var _field = require('@epicbagel/saas-kit/primitives/field');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _input = require('@epicbagel/saas-kit/primitives/input');
var _radiogroup = require('@epicbagel/saas-kit/primitives/radio-group');









var _responsivedialog = require('@epicbagel/saas-kit/primitives/responsive-dialog');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _tabs = require('@epicbagel/saas-kit/primitives/tabs');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _textarea = require('@epicbagel/saas-kit/primitives/textarea');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var candidateShareDialogLabels = Object.freeze({
  title: (name) => `Share ${name}`,
  description: "",
  reason: "Your reason",
  audience: "Who is this link for?",
  liveBadge: "Live",
  live: "A link for them is already live. Stop sharing it to make a new one.",
  visibility: "How they appear",
  named: "Named",
  namedDescription: "Shows their name and photo.",
  anonymised: "Anonymised",
  anonymisedDescription: "Leaves out their name and photo.",
  note: "A note for them",
  noteDescription: "Optional. It shows above the profile.",
  notePlaceholder: "Why should they meet this person?",
  noteFormat: "Note format",
  voiceNote: "Voice note",
  writtenNote: "Written note",
  link: "Link",
  create: (copies) => copies ? "Create and copy link" : "Create link",
  update: (copies) => copies ? "Save and copy link" : "Save changes",
  sharing: "Creating link\u2026",
  ready: "Your link is ready.",
  copy: "Copy",
  copied: "Copied",
  linkCopied: "Link copied.",
  copyFailed: "Copying didn't work in this browser. The link is selected, so you can copy it yourself.",
  done: "Done",
  failed: () => "That link couldn't be made. Try again."
});
function candidateShareLinkText(url, maxLength = 36) {
  const text = url.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
  return text.length > maxLength ? `${text.slice(0, Math.max(1, maxLength - 1))}\u2026` : text;
}
var NO_AUDIENCES = [];
var INACTIVE_PANEL = "data-[state=inactive]:hidden";
function present(value) {
  return value != null && value !== false && value !== "";
}
function clipboard() {
  return typeof navigator === "undefined" ? void 0 : navigator.clipboard;
}
function writeLink(link) {
  const target = clipboard();
  if (!_optionalChain([target, 'optionalAccess', _ => _.writeText])) return Promise.resolve(false);
  try {
    return target.writeText(link).then(
      () => true,
      () => false
    );
  } catch (e) {
    return Promise.resolve(false);
  }
}
function writeLinkWhenMade(link) {
  const later = () => link.then(writeLink, () => false);
  const target = clipboard();
  if (!target) return link.then(() => false, () => false);
  if (typeof ClipboardItem !== "undefined" && typeof target.write === "function") {
    const blob = link.then((value) => new Blob([value], { type: "text/plain" }));
    blob.catch(() => void 0);
    try {
      return target.write([new ClipboardItem({ "text/plain": blob })]).then(() => true, later);
    } catch (e2) {
    }
  }
  return later();
}
function firstAudience(audiences) {
  return _optionalChain([(_nullishCoalesce(audiences.find((audience) => !audience.live), () => ( audiences[0]))), 'optionalAccess', _2 => _2.id]);
}
function resolveChoices(own, held, audiences, anonymisable) {
  const audience = _nullishCoalesce(_optionalChain([held, 'optionalAccess', _3 => _3.audience]), () => ( own.audience));
  return {
    audience: audiences.some((candidate) => candidate.id === audience) ? audience : firstAudience(audiences),
    anonymised: anonymisable && Boolean(_nullishCoalesce(_optionalChain([held, 'optionalAccess', _4 => _4.anonymised]), () => ( own.anonymised))),
    note: _nullishCoalesce(_nullishCoalesce(_optionalChain([held, 'optionalAccess', _5 => _5.note]), () => ( own.note)), () => ( ""))
  };
}
function CandidateShareDialog(props) {
  const [session, setSession] = _react.useState.call(void 0, 0);
  const [wasOpen, setWasOpen] = _react.useState.call(void 0, props.open);
  if (props.open !== wasOpen) {
    setWasOpen(props.open);
    if (props.open) setSession(session + 1);
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ShareDialogSession, { ...props }, session);
}
function ShareDialogSession({
  open,
  onOpenChange,
  candidateName,
  avatar,
  headline,
  reason,
  audiences = NO_AUDIENCES,
  anonymisable = false,
  note: takesNote = false,
  noteMaxLength,
  recorder,
  defaultNoteFormat = "voice",
  choices: heldChoices,
  defaultChoices,
  onChoicesChange,
  url,
  onShare,
  copyOnShare = false,
  waitingFor,
  error,
  labels
}) {
  const text = { ...candidateShareDialogLabels, ...labels };
  const described = present(text.description);
  const id = _react.useId.call(void 0, );
  const [ownChoices, setOwnChoices] = _react.useState.call(void 0, _nullishCoalesce(defaultChoices, () => ( {})));
  const choices = resolveChoices(ownChoices, heldChoices, audiences, anonymisable);
  const [madeLink, setMadeLink] = _react.useState.call(void 0, null);
  const [sharing, setSharing] = _react.useState.call(void 0, false);
  const [failure, setFailure] = _react.useState.call(void 0, null);
  const [copy, setCopy] = _react.useState.call(void 0, "idle");
  const [noteFormat, setNoteFormat] = _react.useState.call(void 0, defaultNoteFormat);
  const inFlight = _react.useRef.call(void 0, false);
  const mounted = _react.useRef.call(void 0, true);
  const copyButton = _react.useRef.call(void 0, null);
  const linkField = _react.useRef.call(void 0, null);
  _react.useEffect.call(void 0, () => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  _react.useEffect.call(void 0, () => {
    if (copy !== "copied") return;
    const timer = window.setTimeout(() => setCopy("idle"), 2e3);
    return () => window.clearTimeout(timer);
  }, [copy]);
  _react.useEffect.call(void 0, () => {
    if (madeLink !== null) _optionalChain([copyButton, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.focus, 'call', _8 => _8()]);
  }, [madeLink]);
  _react.useEffect.call(void 0, () => {
    if (copy !== "refused") return;
    _optionalChain([linkField, 'access', _9 => _9.current, 'optionalAccess', _10 => _10.focus, 'call', _11 => _11()]);
    _optionalChain([linkField, 'access', _12 => _12.current, 'optionalAccess', _13 => _13.select, 'call', _14 => _14()]);
  }, [copy]);
  const link = _nullishCoalesce(madeLink, () => ( (_optionalChain([url, 'optionalAccess', _15 => _15.trim, 'call', _16 => _16()]) || null)));
  const result = madeLink !== null || onShare == null && link !== null;
  const audience = audiences.find((candidate) => candidate.id === choices.audience);
  const taken = _optionalChain([audience, 'optionalAccess', _17 => _17.live]) === true && link === null;
  const waiting = present(waitingFor);
  const canShare = onShare != null && !waiting && !taken && _optionalChain([audience, 'optionalAccess', _18 => _18.ready]) !== false;
  const change = (patch) => {
    const next = { ...choices, ...patch };
    setOwnChoices(next);
    setFailure(null);
    _optionalChain([onChoicesChange, 'optionalCall', _19 => _19(next)]);
  };
  const share = () => {
    if (!onShare || !canShare || inFlight.current) return;
    setFailure(null);
    let made;
    try {
      made = onShare({ ...choices, note: choices.note.trim() });
    } catch (cause) {
      setFailure({ cause });
      return;
    }
    const making = Promise.resolve(made).then(
      (value) => typeof value === "string" && value.trim() ? value.trim() : null
    );
    const copying = copyOnShare ? writeLinkWhenMade(making.then((value) => _nullishCoalesce(value, () => ( Promise.reject(new Error("no link")))))) : Promise.resolve(false);
    inFlight.current = true;
    setSharing(true);
    making.then(async (value) => ({ value, copied: value !== null && await copying })).then(
      ({ value, copied }) => {
        inFlight.current = false;
        if (!mounted.current) return;
        setSharing(false);
        if (value === null) {
          onOpenChange(false);
          return;
        }
        setMadeLink(value);
        setCopy(copied ? "copied" : "idle");
      },
      (cause) => {
        inFlight.current = false;
        if (!mounted.current) return;
        setSharing(false);
        setFailure({ cause });
      }
    );
  };
  const copyLink = () => {
    if (link === null) return;
    void writeLink(link).then((copied) => {
      if (mounted.current) setCopy(copied ? "copied" : "refused");
    });
  };
  const audienceTitleId = `${id}-audience`;
  const visibilityTitleId = `${id}-visibility`;
  const noteTitleId = `${id}-note`;
  const noteDescriptionId = `${id}-note-description`;
  const linkTitleId = `${id}-link`;
  const noteDescribed = present(text.noteDescription);
  const said = copy === "refused" ? text.copyFailed : copy === "copied" ? text.linkCopied : result ? text.ready : "";
  const noteField = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _textarea.Textarea,
      {
        "aria-labelledby": noteTitleId,
        "aria-describedby": noteDescribed ? noteDescriptionId : void 0,
        value: choices.note,
        onChange: (event) => change({ note: event.target.value }),
        rows: 4,
        maxLength: noteMaxLength,
        placeholder: text.notePlaceholder,
        disabled: sharing
      }
    ),
    noteDescribed ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { id: noteDescriptionId, size: "sm", tone: "muted", children: text.noteDescription }) : null
  ] });
  const linkBlock = link !== null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-share-dialog-link", gap: "none", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { id: linkTitleId, label: text.link }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "center", surface: "muted", radius: "lg", padding: "control", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Link2, size: "md", tone: "muted" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: copy === "refused" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _input.Input,
        {
          ref: linkField,
          readOnly: true,
          value: link,
          "aria-labelledby": linkTitleId,
          controlSize: "sm",
          selectOnFocus: true
        }
      ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "span", variant: "inherit", size: "sm", display: "block", truncate: true, title: link, children: candidateShareLinkText(link) }) }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _button.Button,
        {
          ref: copyButton,
          type: "button",
          variant: result ? "default" : "outline",
          size: "sm",
          shrink: false,
          onClick: copyLink,
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: copy === "copied" ? _lucidereact.Check : _lucidereact.Copy, size: "sm" }),
            copy === "copied" ? text.copied : text.copy
          ]
        }
      )
    ] })
  ] }) : null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialog, { open, onOpenChange, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogContent, { ...described ? {} : { "aria-describedby": void 0 }, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _responsivedialog.ResponsiveDialogHeader, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogTitle, { children: text.title(candidateName) }),
      described ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogDescription, { children: text.description }) : null
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogBody, { "data-slot": "candidate-share-dialog", "data-view": result ? "result" : "compose", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "lg", className: "[overflow-wrap:anywhere]", children: [
      present(avatar) || present(headline) || present(reason) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-share-dialog-summary", gap: "md", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "md", align: "center", children: [
          avatar,
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", weight: "semibold", truncate: true, children: candidateName }),
            present(headline) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", truncate: true, children: headline }) : null
          ] })
        ] }),
        present(reason) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", children: text.reason }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", children: reason })
        ] }) : null
      ] }) : null,
      result ? null : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        audiences.length > 0 && choices.audience !== void 0 ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-share-dialog-audience", gap: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { id: audienceTitleId, label: text.audience, spacing: "none" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkL2JVZDKScjs.ChoiceChips,
            {
              "aria-labelledby": audienceTitleId,
              chips: audiences.map((candidate) => ({
                id: candidate.id,
                label: candidate.label,
                trailing: candidate.live ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { as: "span", variant: "success", size: "micro", children: text.liveBadge }) : void 0
              })),
              value: choices.audience,
              disabled: sharing,
              onChange: (next) => change({ audience: next })
            }
          ),
          taken ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: present(_optionalChain([audience, 'optionalAccess', _20 => _20.liveDescription])) ? _optionalChain([audience, 'optionalAccess', _21 => _21.liveDescription]) : text.live }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
            present(_optionalChain([audience, 'optionalAccess', _22 => _22.description])) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: _optionalChain([audience, 'optionalAccess', _23 => _23.description]) }) : null,
            _optionalChain([audience, 'optionalAccess', _24 => _24.fields])
          ] })
        ] }) : null,
        anonymisable && !taken ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-share-dialog-visibility", gap: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { id: visibilityTitleId, label: text.visibility, spacing: "none" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _radiogroup.RadioGroup,
            {
              "aria-labelledby": visibilityTitleId,
              value: choices.anonymised ? "anonymised" : "named",
              onValueChange: (next) => change({ anonymised: next === "anonymised" }),
              disabled: sharing,
              children: ["named", "anonymised"].map((option) => (
                // The label makes the whole card the target. The radio
                // is named by the title and described by the line under
                // it outright, not left to how a browser reads a label
                // that wraps a group.
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldLabel, { htmlFor: `${id}-${option}`, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { orientation: "horizontal", children: [
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.FieldContent, { children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldTitle, { id: `${id}-${option}-title`, children: option === "named" ? text.named : text.anonymised }),
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldDescription, { id: `${id}-${option}-description`, children: option === "named" ? text.namedDescription : text.anonymisedDescription })
                  ] }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    _radiogroup.RadioGroupItem,
                    {
                      value: option,
                      id: `${id}-${option}`,
                      "aria-labelledby": `${id}-${option}-title`,
                      "aria-describedby": `${id}-${option}-description`
                    }
                  )
                ] }) }, option)
              ))
            }
          )
        ] }) : null,
        (takesNote || present(recorder)) && !taken ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "candidate-share-dialog-note", gap: "sm", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _sectionheader.SectionHeader, { id: noteTitleId, label: text.note, spacing: "none" }),
          takesNote && present(recorder) ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            _tabs.Tabs,
            {
              value: noteFormat,
              onValueChange: (next) => setNoteFormat(next === "written" ? "written" : "voice"),
              children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _tabs.TabsList, { "aria-label": text.noteFormat, children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _tabs.TabsTrigger, { value: "voice", padding: "md", children: text.voiceNote }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _tabs.TabsTrigger, { value: "written", padding: "md", children: text.writtenNote })
                ] }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _tabs.TabsContent, { value: "voice", marginTop: "md", forceMount: true, className: INACTIVE_PANEL, children: recorder }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _tabs.TabsContent, { value: "written", marginTop: "md", forceMount: true, className: INACTIVE_PANEL, children: noteField })
              ]
            }
          ) : takesNote ? noteField : recorder
        ] }) : null
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "none", className: link === null ? "sr-only" : void 0, children: [
        linkBlock,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _text.Text,
          {
            role: "status",
            size: "sm",
            tone: copy === "refused" ? "destructive" : "muted",
            marginTop: said ? "sm" : "none",
            children: said
          }
        )
      ] }),
      failure || present(error) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.Alert, { variant: "destructive", role: "alert", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.AlertDescription, { children: failure ? text.failed(failure.cause) : error }) }) : null
    ] }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogFooter, { layout: "fill", children: result ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _responsivedialog.ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", variant: "outline", children: text.done }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", onClick: share, disabled: !canShare || sharing, "aria-busy": sharing || void 0, children: sharing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "md", spin: true }),
      text.sharing
    ] }) : waiting ? waitingFor : link !== null ? text.update(copyOnShare) : text.create(copyOnShare) }) })
  ] }) });
}





exports.candidateShareDialogLabels = candidateShareDialogLabels; exports.candidateShareLinkText = candidateShareLinkText; exports.CandidateShareDialog = CandidateShareDialog;
