"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/candidate-add-to-job-popover.tsx
var _button = require('@epicbagel/saas-kit/primitives/button');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _icon = require('@epicbagel/saas-kit/primitives/icon');




var _popover = require('@epicbagel/saas-kit/primitives/popover');






var _select = require('@epicbagel/saas-kit/primitives/select');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _togglegroup = require('@epicbagel/saas-kit/primitives/toggle-group');
var _lucidereact = require('lucide-react');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var LABELS = {
  trigger: "Add to job",
  title: (count) => count > 1 ? `Add ${count} candidates to a job` : "Add to job",
  job: "Job",
  jobPlaceholder: "Pick a job\u2026",
  stage: "Stage",
  stageOption: (label) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    "at ",
    label
  ] }),
  assessor: "Assessor",
  assessorPlaceholder: "Pick an assessor\u2026",
  mode: "How to add candidates",
  setStage: "Set stage",
  assess: "Assess",
  confirm: "Confirm",
  adding: "Adding\u2026",
  assessing: "Assessing\u2026"
};
function listed(options, value) {
  return value !== void 0 && options.some((option) => option.value === value) ? value : "";
}
function CandidateAddToJobPopover({
  jobs,
  stages,
  defaultStage,
  defaultJob,
  count = 1,
  onConfirm,
  assessors = [],
  onAssess,
  assessIcon = _lucidereact.ClipboardCheck,
  trigger,
  align = "start",
  empty = { title: "No open jobs", description: "Create a job first, then add people to it." },
  labels
}) {
  const copy = { ...LABELS, ...labels };
  const initialStage = () => listed(stages, defaultStage) || (_nullishCoalesce(_optionalChain([stages, 'access', _ => _[0], 'optionalAccess', _2 => _2.value]), () => ( "")));
  const [open, setOpen] = _react.useState.call(void 0, false);
  const [pickedJob, setJob] = _react.useState.call(void 0, () => listed(jobs, defaultJob));
  const [pickedStage, setStage] = _react.useState.call(void 0, initialStage);
  const [pickedAssessor, setAssessor] = _react.useState.call(void 0, "");
  const [mode, setMode] = _react.useState.call(void 0, "stage");
  const [busy, setBusy] = _react.useState.call(void 0, false);
  const job = listed(jobs, pickedJob);
  const stage = listed(stages, pickedStage);
  const assessor = listed(assessors, pickedAssessor);
  const canAssess = assessors.length > 0 && !!onAssess;
  const assessing = canAssess && mode === "assess";
  const onOpenChange = (next) => {
    if (next) {
      setJob(listed(jobs, defaultJob));
      setStage(initialStage());
      setAssessor("");
      setMode("stage");
    }
    setOpen(next);
  };
  const submit = async () => {
    if (!job || (assessing ? !assessor : !stage)) return;
    setBusy(true);
    try {
      if (assessing) await onAssess(job, assessor);
      else await onConfirm(job, stage);
      setOpen(false);
    } catch (e) {
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _popover.Popover, { open, onOpenChange, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _popover.PopoverTrigger, { asChild: true, children: _nullishCoalesce(trigger, () => ( /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _button.Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Briefcase, size: "sm" }),
      copy.trigger
    ] }))) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _popover.PopoverContent,
      {
        "data-slot": "candidate-add-to-job-popover",
        align,
        padding: "compact",
        spacing: "compact",
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { as: "div", variant: "eyebrow", children: copy.title(count) }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _select.Select, { value: job, onValueChange: setJob, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectTrigger, { "aria-label": copy.job, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectValue, { placeholder: copy.jobPlaceholder }) }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _select.SelectContent, { children: [
              jobs.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _emptystate.EmptyState,
                {
                  variant: "empty",
                  size: "inline",
                  icon: _lucidereact.Briefcase,
                  title: empty.title,
                  description: _nullishCoalesce(empty.description, () => ( ""))
                }
              ),
              jobs.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectItem, { value: option.value, children: option.label }, option.value))
            ] })
          ] }),
          canAssess && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            _togglegroup.ToggleGroup,
            {
              type: "single",
              value: mode,
              onValueChange: (value) => {
                if (value === "stage" || value === "assess") setMode(value);
              },
              variant: "outline",
              size: "sm",
              "aria-label": copy.mode,
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _togglegroup.ToggleGroupItem, { value: "stage", grow: true, textSize: "xs", children: copy.setStage }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _togglegroup.ToggleGroupItem, { value: "assess", grow: true, textSize: "xs", children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: assessIcon, size: "xs" }),
                  copy.assess
                ] })
              ]
            }
          ),
          assessing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _select.Select, { value: assessor, onValueChange: setAssessor, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectTrigger, { "aria-label": copy.assessor, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectValue, { placeholder: copy.assessorPlaceholder }) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectContent, { children: assessors.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectItem, { value: option.value, children: option.label }, option.value)) })
          ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _select.Select, { value: stage, onValueChange: setStage, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectTrigger, { "aria-label": copy.stage, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectValue, {}) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectContent, { children: stages.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectItem, { value: option.value, children: copy.stageOption(option.label) }, option.value)) })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            _button.Button,
            {
              type: "button",
              onClick: () => void submit(),
              disabled: !job || (assessing ? !assessor : !stage) || busy,
              width: "full",
              size: "sm",
              children: [
                busy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "md", spin: true }) : assessing ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: assessIcon, size: "md" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Check, size: "md" }),
                busy ? assessing ? copy.assessing : copy.adding : assessing ? copy.assess : copy.confirm
              ]
            }
          )
        ]
      }
    )
  ] });
}



exports.CandidateAddToJobPopover = CandidateAddToJobPopover;
