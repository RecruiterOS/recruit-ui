// src/recruit/candidate-add-to-job-popover.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@epicbagel/saas-kit/primitives/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@epicbagel/saas-kit/primitives/select";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ToggleGroup, ToggleGroupItem } from "@epicbagel/saas-kit/primitives/toggle-group";
import { Briefcase, Check, ClipboardCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LABELS = {
  trigger: "Add to job",
  title: (count) => count > 1 ? `Add ${count} candidates to a job` : "Add to job",
  job: "Job",
  jobPlaceholder: "Pick a job\u2026",
  stage: "Stage",
  stageOption: (label) => /* @__PURE__ */ jsxs(Fragment, { children: [
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
  assessIcon = ClipboardCheck,
  trigger,
  align = "start",
  empty = { title: "No open jobs", description: "Create a job first, then add people to it." },
  labels
}) {
  const copy = { ...LABELS, ...labels };
  const initialStage = () => listed(stages, defaultStage) || (stages[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const [pickedJob, setJob] = useState(() => listed(jobs, defaultJob));
  const [pickedStage, setStage] = useState(initialStage);
  const [pickedAssessor, setAssessor] = useState("");
  const [mode, setMode] = useState("stage");
  const [busy, setBusy] = useState(false);
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
    } catch {
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsx(Icon, { icon: Briefcase, size: "sm" }),
      copy.trigger
    ] }) }),
    /* @__PURE__ */ jsxs(
      PopoverContent,
      {
        "data-slot": "candidate-add-to-job-popover",
        align,
        padding: "compact",
        spacing: "compact",
        children: [
          /* @__PURE__ */ jsx(Text, { as: "div", variant: "eyebrow", children: copy.title(count) }),
          /* @__PURE__ */ jsxs(Select, { value: job, onValueChange: setJob, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { "aria-label": copy.job, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: copy.jobPlaceholder }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              jobs.length === 0 && /* @__PURE__ */ jsx(
                EmptyState,
                {
                  variant: "empty",
                  size: "inline",
                  icon: Briefcase,
                  title: empty.title,
                  description: empty.description ?? ""
                }
              ),
              jobs.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value))
            ] })
          ] }),
          canAssess && /* @__PURE__ */ jsxs(
            ToggleGroup,
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
                /* @__PURE__ */ jsx(ToggleGroupItem, { value: "stage", grow: true, textSize: "xs", children: copy.setStage }),
                /* @__PURE__ */ jsxs(ToggleGroupItem, { value: "assess", grow: true, textSize: "xs", children: [
                  /* @__PURE__ */ jsx(Icon, { icon: assessIcon, size: "xs" }),
                  copy.assess
                ] })
              ]
            }
          ),
          assessing ? /* @__PURE__ */ jsxs(Select, { value: assessor, onValueChange: setAssessor, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { "aria-label": copy.assessor, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: copy.assessorPlaceholder }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: assessors.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
          ] }) : /* @__PURE__ */ jsxs(Select, { value: stage, onValueChange: setStage, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { "aria-label": copy.stage, children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: stages.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: copy.stageOption(option.label) }, option.value)) })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              onClick: () => void submit(),
              disabled: !job || (assessing ? !assessor : !stage) || busy,
              width: "full",
              size: "sm",
              children: [
                busy ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "md", spin: true }) : assessing ? /* @__PURE__ */ jsx(Icon, { icon: assessIcon, size: "md" }) : /* @__PURE__ */ jsx(Icon, { icon: Check, size: "md" }),
                busy ? assessing ? copy.assessing : copy.adding : assessing ? copy.assess : copy.confirm
              ]
            }
          )
        ]
      }
    )
  ] });
}

export {
  CandidateAddToJobPopover
};
