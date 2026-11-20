"use client";
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk24HXMKK7cjs = require('./chunk-24HXMKK7.cjs');


var _chunkX6GX3U3Xcjs = require('./chunk-X6GX3U3X.cjs');
require('./chunk-K4NZRRJK.cjs');


var _chunkJ4LAJRRHcjs = require('./chunk-J4LAJRRH.cjs');
require('./chunk-HUCMR5O6.cjs');

// src/recruit/interview-scheduler.tsx
var _alert = require('@epicbagel/saas-kit/primitives/alert');
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _definitionlist = require('@epicbagel/saas-kit/primitives/definition-list');
var _field = require('@epicbagel/saas-kit/primitives/field');
var _heading = require('@epicbagel/saas-kit/primitives/heading');
var _input = require('@epicbagel/saas-kit/primitives/input');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _resourcecard = require('@epicbagel/saas-kit/primitives/resource-card');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _textarea = require('@epicbagel/saas-kit/primitives/textarea');
var _react = require('react');

// src/recruit/workflow-candidate-header.tsx
var _image = require('@epicbagel/saas-kit/primitives/image');
var _personavatar = require('@epicbagel/saas-kit/primitives/person-avatar');


var _jsxruntime = require('react/jsx-runtime');
function WorkflowCandidateHeader({ name, media, role, eyebrow }) {
  const [failedBanner, setFailedBanner] = _react.useState.call(void 0, );
  const banner = media.bannerUrl;
  const cover = banner && banner !== failedBanner ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _image.Image, { src: banner, alt: "", fit: "cover", onError: () => setFailedBanner(banner) }) : void 0;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk24HXMKK7cjs.CandidateProfileHeader,
    {
      name,
      avatar: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _personavatar.PersonAvatar, { name, photoUrl: media.photoUrl, size: 48, decorative: true }),
      cover,
      coverSize: "compact",
      titleLevel: 3,
      eyebrow,
      meta: role && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: role })
    }
  );
}

// src/recruit/interview-scheduler.tsx

function instant(value) {
  if (!value) return void 0;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : void 0;
}
function formatTime(date, locale, timeZone) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short"
  }).format(date);
}
function InterviewTimeFields({ id, stamp, locale, timeZone, timeZoneLabel }) {
  const [day, setDay] = _react.useState.call(void 0, stamp.slice(0, 10));
  const [time, setTime] = _react.useState.call(void 0, stamp.slice(11, stamp.endsWith(":00.000Z") ? 16 : -1));
  const local = instant(day + "T" + time + "Z");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "sm", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.FieldGrid, { columns: 2, children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldLabel, { htmlFor: id + "-date", children: "Date (UTC)" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { id: id + "-date", name: "date", type: "date", required: true, value: day, onChange: (event) => setDay(event.target.value) })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldLabel, { htmlFor: id + "-time", children: "Time (UTC)" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _input.Input,
          {
            id: id + "-time",
            name: "time",
            type: "time",
            step: time.length > 5 ? "any" : 60,
            required: true,
            value: time,
            onChange: (event) => setTime(event.target.value)
          }
        )
      ] })
    ] }),
    local && timeZone !== "UTC" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "sm", tone: "muted", "aria-live": "polite", children: [
      timeZoneLabel,
      " \xB7 ",
      formatTime(local, locale, timeZone)
    ] })
  ] });
}
var statusLabels = { SCHEDULED: "Scheduled", COMPLETED: "Completed", CANCELLED: "Cancelled" };
function InterviewScheduler({ candidate, candidateMedia, role, appointment, defaults, timeZone = "UTC", timeZoneLabel = timeZone.replaceAll("_", " "), locale = "en-GB", onSchedule, onUpdate }) {
  const id = _react.useId.call(void 0, );
  const heading = _react.useRef.call(void 0, null);
  const [edit, setEdit] = _react.useState.call(void 0, null);
  const [error, setError] = _react.useState.call(void 0, "");
  const busy = _react.useRef.call(void 0, false);
  const original = _optionalChain([edit, 'optionalAccess', _ => _.original]);
  const details = _nullishCoalesce(original, () => ( defaults));
  const stamp = _nullishCoalesce(_optionalChain([instant, 'call', _2 => _2(_optionalChain([details, 'optionalAccess', _3 => _3.scheduledAt])), 'optionalAccess', _4 => _4.toISOString, 'call', _5 => _5()]), () => ( ""));
  const viewing = !!appointment && !edit;
  const pickingTime = !viewing && (!edit || edit.mode === "details");
  function finish() {
    setEdit(null);
    setError("");
    requestAnimationFrame(() => _optionalChain([heading, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.focus, 'call', _8 => _8()]));
  }
  const { run, pendingArgs } = _chunkX6GX3U3Xcjs.useLatestCall.call(void 0, async (form) => {
    if (busy.current) return;
    const data = new FormData(form);
    const value = (name) => String(_nullishCoalesce(data.get(name), () => ( ""))).trim();
    busy.current = true;
    setError("");
    try {
      if (edit && !onUpdate) throw new Error("You can no longer edit this appointment.");
      if (_optionalChain([edit, 'optionalAccess', _9 => _9.mode]) === "feedback") {
        if (!value("feedback")) throw new Error("Enter feedback before completing the interview.");
        await onUpdate(edit.original, { status: "COMPLETED", feedback: value("feedback") });
      } else if (_optionalChain([edit, 'optionalAccess', _10 => _10.mode]) === "cancel") {
        await onUpdate(edit.original, { status: "CANCELLED" });
      } else {
        const date2 = instant(value("date") + "T" + value("time") + "Z");
        if (!value("label") || !date2) throw new Error("Enter an interview name, date and time.");
        const next = {
          label: value("label"),
          scheduledAt: date2.toISOString(),
          interviewer: value("interviewer") || null,
          location: value("location") || null
        };
        if (original) await onUpdate(original, next);
        else await onSchedule(next);
      }
      finish();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn\u2019t save the interview. Try again.");
    } finally {
      busy.current = false;
    }
  });
  function begin(mode) {
    if (appointment) {
      setError("");
      setEdit({ mode, original: appointment });
    }
  }
  function submit(event) {
    event.preventDefault();
    if (!busy.current) run(event.currentTarget);
  }
  const date = instant(_optionalChain([appointment, 'optionalAccess', _11 => _11.scheduledAt]));
  const title = viewing ? appointment.label : _optionalChain([edit, 'optionalAccess', _12 => _12.mode]) === "feedback" ? "Interview feedback" : _optionalChain([edit, 'optionalAccess', _13 => _13.mode]) === "cancel" ? "Cancel this interview?" : edit ? "Edit interview" : "Schedule an interview";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _resourcecard.ResourceCard, { "data-slot": "interview-scheduler", children: [
    candidateMedia && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, WorkflowCandidateHeader, { name: candidate, role, media: candidateMedia }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { border: candidateMedia ? "top" : "none", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", justify: "between", align: "start", wrap: true, gap: "sm", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 3, ref: heading, tabIndex: -1, children: title }),
        !candidateMedia && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "sm", tone: "muted", children: [
          candidate,
          " \xB7 ",
          role
        ] })
      ] }),
      appointment && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: "outline", children: statusLabels[appointment.status] })
    ] }) }),
    viewing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { border: "top", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "md", children: [
        date && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
          timeZone !== "UTC" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: timeZoneLabel }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { weight: "semibold", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "time", { dateTime: appointment.scheduledAt, children: formatTime(date, locale, timeZone) }) }),
          timeZone !== "UTC" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: formatTime(date, locale, "UTC") })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _definitionlist.DefinitionList, { variant: "divided", children: [
          appointment.interviewer && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Interviewer", children: appointment.interviewer }),
          appointment.location && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Location", children: appointment.location }),
          appointment.feedback && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Feedback", children: appointment.feedback })
        ] })
      ] }) }),
      onUpdate && appointment.status === "SCHEDULED" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _resourcecard.ResourceCardFooter, { align: "start", wrap: true, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", onClick: () => begin("feedback"), children: "Record feedback" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "secondary", onClick: () => begin("details"), children: "Edit interview" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", variant: "ghost", onClick: () => begin("cancel"), children: "Cancel interview" })
      ] })
    ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "form", { onSubmit: submit, "aria-busy": !!pendingArgs, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "fieldset", { disabled: !!pendingArgs, className: "min-w-0", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _panelsection.PanelSection, { border: "top", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: [
        pickingTime ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "lg", children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldLabel, { htmlFor: id + "-label", children: "Interview name" }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { id: id + "-label", name: "label", required: true, defaultValue: _optionalChain([details, 'optionalAccess', _14 => _14.label]), autoFocus: !!edit })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, InterviewTimeFields, { id, stamp, locale, timeZone, timeZoneLabel }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.FieldGrid, { columns: 2, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldLabel, { htmlFor: id + "-who", children: "Interviewer" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { id: id + "-who", name: "interviewer", defaultValue: _nullishCoalesce(_optionalChain([details, 'optionalAccess', _15 => _15.interviewer]), () => ( "")) })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _field.FieldLabel, { htmlFor: id + "-where", children: "Location or meeting link" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _input.Input, { id: id + "-where", name: "location", defaultValue: _nullishCoalesce(_optionalChain([details, 'optionalAccess', _16 => _16.location]), () => ( "")) })
            ] })
          ] })
        ] }) : _optionalChain([edit, 'optionalAccess', _17 => _17.mode]) === "feedback" ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.Field, { children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _field.FieldLabel, { htmlFor: id + "-feedback", children: [
            "Feedback from ",
            _optionalChain([original, 'optionalAccess', _18 => _18.interviewer]) || "the interviewer"
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _textarea.Textarea, { id: id + "-feedback", name: "feedback", required: true, autoFocus: true, defaultValue: _nullishCoalesce(_optionalChain([original, 'optionalAccess', _19 => _19.feedback]), () => ( "")) })
        ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { children: [
          "Mark this appointment as cancelled on ",
          candidate,
          "\u2019s application."
        ] }),
        error && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.Alert, { variant: "destructive", marginTop: "md", children: error })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { border: "top", paddingX: "lg", paddingTop: "md", paddingBottom: "md", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", justify: "end", wrap: true, gap: "sm", children: [
        edit && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "button", size: "sm", variant: "secondary", autoFocus: edit.mode === "cancel", onClick: finish, children: "Go back" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { type: "submit", size: "sm", disabled: !!pendingArgs, children: pendingArgs ? "Saving\u2026" : !edit ? "Schedule interview" : edit.mode === "feedback" ? "Complete interview" : edit.mode === "cancel" ? "Confirm cancellation" : "Save changes" })
      ] }) })
    ] }) }, _nullishCoalesce(_optionalChain([edit, 'optionalAccess', _20 => _20.mode]), () => ( "create")))
  ] });
}

// src/recruit/placement-summary-blocks.tsx











function JobStatusBlock({ title, client, statusLabel, contact, contactPhotoUrl, onClose }) {
  const { run, pendingArgs, failure } = _chunkX6GX3U3Xcjs.useLatestCall.call(void 0, onClose);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _resourcecard.ResourceCard, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", align: "start", justify: "between", wrap: true, gap: "sm", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "sm", tone: "muted", children: client }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 3, children: title })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _badge.Badge, { variant: "outline", children: statusLabel })
    ] }) }),
    contact && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { border: "top", paddingX: "lg", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionList, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Hiring contact", children: contactPhotoUrl ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", align: "center", gap: "sm", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _personavatar.PersonAvatar, { name: contact, photoUrl: contactPhotoUrl, size: 28, decorative: true }),
      contact
    ] }) : contact }) }) }),
    failure && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.Alert, { variant: "destructive", children: "Couldn\u2019t close the job. Try again." }),
    onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _resourcecard.ResourceCardFooter, { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _button.Button, { size: "sm", disabled: !!pendingArgs, onClick: () => run(), children: pendingArgs ? "Closing\u2026" : "Close job" }) })
  ] });
}
function PlacementTermsBlock({ candidate, candidateMedia, role, salary, fee, startDate }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _resourcecard.ResourceCard, { children: [
    candidateMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, WorkflowCandidateHeader, { name: candidate, role, media: candidateMedia, eyebrow: "Offer terms" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { gap: "xs", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _heading.Heading, { level: 3, children: "Offer terms" }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "sm", tone: "muted", children: [
        candidate,
        " \xB7 ",
        role
      ] })
    ] }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _panelsection.PanelSection, { border: "top", paddingX: "lg", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _definitionlist.DefinitionList, { variant: "divided", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Annual salary", children: salary }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Agency fee", children: fee }),
      startDate && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _definitionlist.DefinitionItem, { label: "Start date", children: startDate })
    ] }) })
  ] });
}

// src/recruit/application-pipeline-block.tsx


function ApplicationPipelineBlock({
  profile,
  ...list
}) {
  if (!profile) return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkJ4LAJRRHcjs.CandidatePipelineList, { ...list });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _resourcecard.ResourceCard, { className: "@container/application", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, WorkflowCandidateHeader, { name: profile.name, media: profile }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkJ4LAJRRHcjs.CandidatePipelineList, { ...list })
  ] });
}





exports.ApplicationPipelineBlock = ApplicationPipelineBlock; exports.InterviewScheduler = InterviewScheduler; exports.JobStatusBlock = JobStatusBlock; exports.PlacementTermsBlock = PlacementTermsBlock;
