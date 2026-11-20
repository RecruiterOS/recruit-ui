"use client";
import {
  useLatestCall
} from "./chunk-WMD6M2IP.js";
import {
  CandidatePipelineList
} from "./chunk-TFPDLQYX.js";
import "./chunk-VOKP2HLR.js";

// src/recruit/interview-scheduler.tsx
import { Alert } from "@epicbagel/saas-kit/primitives/alert";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { Field, FieldGrid, FieldLabel } from "@epicbagel/saas-kit/primitives/field";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { ResourceCard, ResourceCardFooter } from "@epicbagel/saas-kit/primitives/resource-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
var statusLabels = { SCHEDULED: "Scheduled", COMPLETED: "Completed", CANCELLED: "Cancelled" };
function InterviewScheduler({ candidate, role, appointment, defaults, timeZone = "UTC", locale = "en-GB", onSchedule, onUpdate }) {
  const id = useId();
  const heading = useRef(null);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const original = edit?.original;
  const details = original ?? defaults;
  const stamp = instant(details?.scheduledAt)?.toISOString() ?? "";
  const viewing = !!appointment && !edit;
  const pickingTime = !viewing && (!edit || edit.mode === "details");
  function finish() {
    setEdit(null);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  const { run, pendingArgs } = useLatestCall(async (form) => {
    if (busy.current) return;
    const data = new FormData(form);
    const value = (name) => String(data.get(name) ?? "").trim();
    busy.current = true;
    setError("");
    try {
      if (edit && !onUpdate) throw new Error("You can no longer edit this appointment.");
      if (edit?.mode === "feedback") {
        if (!value("feedback")) throw new Error("Enter feedback before completing the interview.");
        await onUpdate(edit.original, { status: "COMPLETED", feedback: value("feedback") });
      } else if (edit?.mode === "cancel") {
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
  const date = instant(appointment?.scheduledAt);
  const title = viewing ? appointment.label : edit?.mode === "feedback" ? "Interview feedback" : edit?.mode === "cancel" ? "Cancel this interview?" : edit ? "Edit interview" : "Schedule an interview";
  return /* @__PURE__ */ jsxs(ResourceCard, { "data-slot": "interview-scheduler", children: [
    /* @__PURE__ */ jsx(PanelSection, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", justify: "between", align: "start", wrap: true, gap: "sm", children: [
      /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
        /* @__PURE__ */ jsx(Heading, { level: 3, ref: heading, tabIndex: -1, children: title }),
        /* @__PURE__ */ jsxs(Text, { size: "sm", tone: "muted", children: [
          candidate,
          " \xB7 ",
          role
        ] })
      ] }),
      appointment && /* @__PURE__ */ jsx(Badge, { variant: "outline", children: statusLabels[appointment.status] })
    ] }) }),
    viewing ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PanelSection, { border: "top", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
        date && /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          /* @__PURE__ */ jsx(Text, { weight: "semibold", children: /* @__PURE__ */ jsx("time", { dateTime: appointment.scheduledAt, children: formatTime(date, locale, timeZone) }) }),
          timeZone !== "UTC" && /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: formatTime(date, locale, "UTC") })
        ] }),
        /* @__PURE__ */ jsxs(DefinitionList, { variant: "divided", children: [
          appointment.interviewer && /* @__PURE__ */ jsx(DefinitionItem, { label: "Interviewer", children: appointment.interviewer }),
          appointment.location && /* @__PURE__ */ jsx(DefinitionItem, { label: "Location", children: appointment.location }),
          appointment.feedback && /* @__PURE__ */ jsx(DefinitionItem, { label: "Feedback", children: appointment.feedback })
        ] })
      ] }) }),
      onUpdate && appointment.status === "SCHEDULED" && /* @__PURE__ */ jsxs(ResourceCardFooter, { align: "start", wrap: true, children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => begin("feedback"), children: "Record feedback" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: () => begin("details"), children: "Edit interview" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => begin("cancel"), children: "Cancel interview" })
      ] })
    ] }) : /* @__PURE__ */ jsx("form", { onSubmit: submit, "aria-busy": !!pendingArgs, children: /* @__PURE__ */ jsxs("fieldset", { disabled: !!pendingArgs, className: "min-w-0", children: [
      /* @__PURE__ */ jsxs(PanelSection, { border: "top", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: [
        pickingTime ? /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
          /* @__PURE__ */ jsxs(Field, { children: [
            /* @__PURE__ */ jsx(FieldLabel, { htmlFor: id + "-label", children: "Interview name" }),
            /* @__PURE__ */ jsx(Input, { id: id + "-label", name: "label", required: true, defaultValue: details?.label, autoFocus: !!edit })
          ] }),
          /* @__PURE__ */ jsxs(FieldGrid, { columns: 2, children: [
            /* @__PURE__ */ jsxs(Field, { children: [
              /* @__PURE__ */ jsx(FieldLabel, { htmlFor: id + "-date", children: "Date (UTC)" }),
              /* @__PURE__ */ jsx(Input, { id: id + "-date", name: "date", type: "date", required: true, defaultValue: stamp.slice(0, 10) })
            ] }),
            /* @__PURE__ */ jsxs(Field, { children: [
              /* @__PURE__ */ jsx(FieldLabel, { htmlFor: id + "-time", children: "Time (UTC)" }),
              /* @__PURE__ */ jsx(Input, { id: id + "-time", name: "time", type: "time", step: "any", required: true, defaultValue: stamp.slice(11, stamp.endsWith(":00.000Z") ? 16 : -1) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(FieldGrid, { columns: 2, children: [
            /* @__PURE__ */ jsxs(Field, { children: [
              /* @__PURE__ */ jsx(FieldLabel, { htmlFor: id + "-who", children: "Interviewer" }),
              /* @__PURE__ */ jsx(Input, { id: id + "-who", name: "interviewer", defaultValue: details?.interviewer ?? "" })
            ] }),
            /* @__PURE__ */ jsxs(Field, { children: [
              /* @__PURE__ */ jsx(FieldLabel, { htmlFor: id + "-where", children: "Location or meeting link" }),
              /* @__PURE__ */ jsx(Input, { id: id + "-where", name: "location", defaultValue: details?.location ?? "" })
            ] })
          ] })
        ] }) : edit?.mode === "feedback" ? /* @__PURE__ */ jsxs(Field, { children: [
          /* @__PURE__ */ jsxs(FieldLabel, { htmlFor: id + "-feedback", children: [
            "Feedback from ",
            original?.interviewer || "the interviewer"
          ] }),
          /* @__PURE__ */ jsx(Textarea, { id: id + "-feedback", name: "feedback", required: true, autoFocus: true, defaultValue: original?.feedback ?? "" })
        ] }) : /* @__PURE__ */ jsxs(Text, { children: [
          "Mark this appointment as cancelled on ",
          candidate,
          "\u2019s application."
        ] }),
        error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", marginTop: "md", children: error })
      ] }),
      /* @__PURE__ */ jsxs(ResourceCardFooter, { wrap: true, children: [
        edit && /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "secondary", autoFocus: edit.mode === "cancel", onClick: finish, children: "Go back" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", disabled: !!pendingArgs, children: pendingArgs ? "Saving\u2026" : !edit ? "Schedule interview" : edit.mode === "feedback" ? "Complete interview" : edit.mode === "cancel" ? "Confirm cancellation" : "Save changes" })
      ] })
    ] }) }, edit?.mode ?? "create")
  ] });
}

// src/recruit/placement-summary-blocks.tsx
import { Alert as Alert2 } from "@epicbagel/saas-kit/primitives/alert";
import { Badge as Badge2 } from "@epicbagel/saas-kit/primitives/badge";
import { Button as Button2 } from "@epicbagel/saas-kit/primitives/button";
import { DefinitionItem as DefinitionItem2, DefinitionList as DefinitionList2 } from "@epicbagel/saas-kit/primitives/definition-list";
import { Heading as Heading2 } from "@epicbagel/saas-kit/primitives/heading";
import { PanelSection as PanelSection2 } from "@epicbagel/saas-kit/primitives/panel-section";
import { ResourceCard as ResourceCard2, ResourceCardFooter as ResourceCardFooter2 } from "@epicbagel/saas-kit/primitives/resource-card";
import { Stack as Stack2 } from "@epicbagel/saas-kit/primitives/stack";
import { Text as Text2 } from "@epicbagel/saas-kit/primitives/text";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function JobStatusBlock({ title, client, statusLabel, contact, onClose }) {
  const { run, pendingArgs, failure } = useLatestCall(onClose);
  return /* @__PURE__ */ jsxs2(ResourceCard2, { children: [
    /* @__PURE__ */ jsx2(PanelSection2, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs2(Stack2, { direction: "horizontal", align: "start", justify: "between", wrap: true, gap: "sm", children: [
      /* @__PURE__ */ jsxs2(Stack2, { gap: "xs", children: [
        /* @__PURE__ */ jsx2(Text2, { size: "sm", tone: "muted", children: client }),
        /* @__PURE__ */ jsx2(Heading2, { level: 3, children: title })
      ] }),
      /* @__PURE__ */ jsx2(Badge2, { variant: "outline", children: statusLabel })
    ] }) }),
    contact && /* @__PURE__ */ jsx2(PanelSection2, { border: "top", paddingX: "lg", children: /* @__PURE__ */ jsx2(DefinitionList2, { children: /* @__PURE__ */ jsx2(DefinitionItem2, { label: "Hiring contact", children: contact }) }) }),
    failure && /* @__PURE__ */ jsx2(Alert2, { variant: "destructive", children: "Couldn\u2019t close the job. Try again." }),
    onClose && /* @__PURE__ */ jsx2(ResourceCardFooter2, { children: /* @__PURE__ */ jsx2(Button2, { size: "sm", disabled: !!pendingArgs, onClick: () => run(), children: pendingArgs ? "Closing\u2026" : "Close job" }) })
  ] });
}
function PlacementTermsBlock({ candidate, role, salary, fee, startDate }) {
  return /* @__PURE__ */ jsxs2(ResourceCard2, { children: [
    /* @__PURE__ */ jsx2(PanelSection2, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs2(Stack2, { gap: "xs", children: [
      /* @__PURE__ */ jsx2(Heading2, { level: 3, children: "Offer terms" }),
      /* @__PURE__ */ jsxs2(Text2, { size: "sm", tone: "muted", children: [
        candidate,
        " \xB7 ",
        role
      ] })
    ] }) }),
    /* @__PURE__ */ jsx2(PanelSection2, { border: "top", paddingX: "lg", children: /* @__PURE__ */ jsxs2(DefinitionList2, { variant: "divided", children: [
      /* @__PURE__ */ jsx2(DefinitionItem2, { label: "Annual salary", children: salary }),
      /* @__PURE__ */ jsx2(DefinitionItem2, { label: "Agency fee", children: fee }),
      startDate && /* @__PURE__ */ jsx2(DefinitionItem2, { label: "Start date", children: startDate })
    ] }) })
  ] });
}
export {
  CandidatePipelineList as ApplicationPipelineBlock,
  InterviewScheduler,
  JobStatusBlock,
  PlacementTermsBlock
};
