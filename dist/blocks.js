"use client";
import {
  CandidateProfileHeader
} from "./chunk-BQ4XXGLP.js";
import {
  useLatestCall
} from "./chunk-WMD6M2IP.js";
import "./chunk-WJ22QD5G.js";
import {
  CandidatePipelineList
} from "./chunk-ERWPC67G.js";
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
import { Text as Text2 } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { useId, useRef, useState as useState2 } from "react";

// src/recruit/workflow-candidate-header.tsx
import { Image } from "@epicbagel/saas-kit/primitives/image";
import { PersonAvatar } from "@epicbagel/saas-kit/primitives/person-avatar";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState } from "react";
import { jsx } from "react/jsx-runtime";
function WorkflowCandidateHeader({ name, media, role, eyebrow }) {
  const [failedBanner, setFailedBanner] = useState();
  const banner = media.bannerUrl;
  const cover = banner && banner !== failedBanner ? /* @__PURE__ */ jsx(Image, { src: banner, alt: "", fit: "cover", onError: () => setFailedBanner(banner) }) : void 0;
  return /* @__PURE__ */ jsx(
    CandidateProfileHeader,
    {
      name,
      avatar: /* @__PURE__ */ jsx(PersonAvatar, { name, photoUrl: media.photoUrl, size: 48, decorative: true }),
      cover,
      coverSize: "compact",
      titleLevel: 3,
      eyebrow,
      meta: role && /* @__PURE__ */ jsx(Text, { size: "sm", tone: "muted", children: role })
    }
  );
}

// src/recruit/interview-scheduler.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
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
  const [day, setDay] = useState2(stamp.slice(0, 10));
  const [time, setTime] = useState2(stamp.slice(11, stamp.endsWith(":00.000Z") ? 16 : -1));
  const local = instant(day + "T" + time + "Z");
  return /* @__PURE__ */ jsxs(Stack, { gap: "sm", children: [
    /* @__PURE__ */ jsxs(FieldGrid, { columns: 2, children: [
      /* @__PURE__ */ jsxs(Field, { children: [
        /* @__PURE__ */ jsx2(FieldLabel, { htmlFor: id + "-date", children: "Date (UTC)" }),
        /* @__PURE__ */ jsx2(Input, { id: id + "-date", name: "date", type: "date", required: true, value: day, onChange: (event) => setDay(event.target.value) })
      ] }),
      /* @__PURE__ */ jsxs(Field, { children: [
        /* @__PURE__ */ jsx2(FieldLabel, { htmlFor: id + "-time", children: "Time (UTC)" }),
        /* @__PURE__ */ jsx2(
          Input,
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
    local && timeZone !== "UTC" && /* @__PURE__ */ jsxs(Text2, { size: "sm", tone: "muted", "aria-live": "polite", children: [
      timeZoneLabel,
      " \xB7 ",
      formatTime(local, locale, timeZone)
    ] })
  ] });
}
var statusLabels = { SCHEDULED: "Scheduled", COMPLETED: "Completed", CANCELLED: "Cancelled" };
function InterviewScheduler({ candidate, candidateMedia, role, appointment, defaults, timeZone = "UTC", timeZoneLabel = timeZone.replaceAll("_", " "), locale = "en-GB", onSchedule, onUpdate }) {
  const id = useId();
  const heading = useRef(null);
  const [edit, setEdit] = useState2(null);
  const [error, setError] = useState2("");
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
    candidateMedia && /* @__PURE__ */ jsx2(WorkflowCandidateHeader, { name: candidate, role, media: candidateMedia }),
    /* @__PURE__ */ jsx2(PanelSection, { border: candidateMedia ? "top" : "none", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", justify: "between", align: "start", wrap: true, gap: "sm", children: [
      /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
        /* @__PURE__ */ jsx2(Heading, { level: 3, ref: heading, tabIndex: -1, children: title }),
        !candidateMedia && /* @__PURE__ */ jsxs(Text2, { size: "sm", tone: "muted", children: [
          candidate,
          " \xB7 ",
          role
        ] })
      ] }),
      appointment && /* @__PURE__ */ jsx2(Badge, { variant: "outline", children: statusLabels[appointment.status] })
    ] }) }),
    viewing ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx2(PanelSection, { border: "top", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs(Stack, { gap: "md", children: [
        date && /* @__PURE__ */ jsxs(Stack, { gap: "xs", children: [
          timeZone !== "UTC" && /* @__PURE__ */ jsx2(Text2, { size: "sm", tone: "muted", children: timeZoneLabel }),
          /* @__PURE__ */ jsx2(Text2, { weight: "semibold", children: /* @__PURE__ */ jsx2("time", { dateTime: appointment.scheduledAt, children: formatTime(date, locale, timeZone) }) }),
          timeZone !== "UTC" && /* @__PURE__ */ jsx2(Text2, { size: "sm", tone: "muted", children: formatTime(date, locale, "UTC") })
        ] }),
        /* @__PURE__ */ jsxs(DefinitionList, { variant: "divided", children: [
          appointment.interviewer && /* @__PURE__ */ jsx2(DefinitionItem, { label: "Interviewer", children: appointment.interviewer }),
          appointment.location && /* @__PURE__ */ jsx2(DefinitionItem, { label: "Location", children: appointment.location }),
          appointment.feedback && /* @__PURE__ */ jsx2(DefinitionItem, { label: "Feedback", children: appointment.feedback })
        ] })
      ] }) }),
      onUpdate && appointment.status === "SCHEDULED" && /* @__PURE__ */ jsxs(ResourceCardFooter, { align: "start", wrap: true, children: [
        /* @__PURE__ */ jsx2(Button, { size: "sm", onClick: () => begin("feedback"), children: "Record feedback" }),
        /* @__PURE__ */ jsx2(Button, { size: "sm", variant: "secondary", onClick: () => begin("details"), children: "Edit interview" }),
        /* @__PURE__ */ jsx2(Button, { size: "sm", variant: "ghost", onClick: () => begin("cancel"), children: "Cancel interview" })
      ] })
    ] }) : /* @__PURE__ */ jsx2("form", { onSubmit: submit, "aria-busy": !!pendingArgs, children: /* @__PURE__ */ jsxs("fieldset", { disabled: !!pendingArgs, className: "min-w-0", children: [
      /* @__PURE__ */ jsxs(PanelSection, { border: "top", paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: [
        pickingTime ? /* @__PURE__ */ jsxs(Stack, { gap: "lg", children: [
          /* @__PURE__ */ jsxs(Field, { children: [
            /* @__PURE__ */ jsx2(FieldLabel, { htmlFor: id + "-label", children: "Interview name" }),
            /* @__PURE__ */ jsx2(Input, { id: id + "-label", name: "label", required: true, defaultValue: details?.label, autoFocus: !!edit })
          ] }),
          /* @__PURE__ */ jsx2(InterviewTimeFields, { id, stamp, locale, timeZone, timeZoneLabel }),
          /* @__PURE__ */ jsxs(FieldGrid, { columns: 2, children: [
            /* @__PURE__ */ jsxs(Field, { children: [
              /* @__PURE__ */ jsx2(FieldLabel, { htmlFor: id + "-who", children: "Interviewer" }),
              /* @__PURE__ */ jsx2(Input, { id: id + "-who", name: "interviewer", defaultValue: details?.interviewer ?? "" })
            ] }),
            /* @__PURE__ */ jsxs(Field, { children: [
              /* @__PURE__ */ jsx2(FieldLabel, { htmlFor: id + "-where", children: "Location or meeting link" }),
              /* @__PURE__ */ jsx2(Input, { id: id + "-where", name: "location", defaultValue: details?.location ?? "" })
            ] })
          ] })
        ] }) : edit?.mode === "feedback" ? /* @__PURE__ */ jsxs(Field, { children: [
          /* @__PURE__ */ jsxs(FieldLabel, { htmlFor: id + "-feedback", children: [
            "Feedback from ",
            original?.interviewer || "the interviewer"
          ] }),
          /* @__PURE__ */ jsx2(Textarea, { id: id + "-feedback", name: "feedback", required: true, autoFocus: true, defaultValue: original?.feedback ?? "" })
        ] }) : /* @__PURE__ */ jsxs(Text2, { children: [
          "Mark this appointment as cancelled on ",
          candidate,
          "\u2019s application."
        ] }),
        error && /* @__PURE__ */ jsx2(Alert, { variant: "destructive", marginTop: "md", children: error })
      ] }),
      /* @__PURE__ */ jsx2(PanelSection, { border: "top", paddingX: "lg", paddingTop: "md", paddingBottom: "md", children: /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", justify: "end", wrap: true, gap: "sm", children: [
        edit && /* @__PURE__ */ jsx2(Button, { type: "button", size: "sm", variant: "secondary", autoFocus: edit.mode === "cancel", onClick: finish, children: "Go back" }),
        /* @__PURE__ */ jsx2(Button, { type: "submit", size: "sm", disabled: !!pendingArgs, children: pendingArgs ? "Saving\u2026" : !edit ? "Schedule interview" : edit.mode === "feedback" ? "Complete interview" : edit.mode === "cancel" ? "Confirm cancellation" : "Save changes" })
      ] }) })
    ] }) }, edit?.mode ?? "create")
  ] });
}

// src/recruit/placement-summary-blocks.tsx
import { Alert as Alert2 } from "@epicbagel/saas-kit/primitives/alert";
import { Badge as Badge2 } from "@epicbagel/saas-kit/primitives/badge";
import { Button as Button2 } from "@epicbagel/saas-kit/primitives/button";
import { DefinitionItem as DefinitionItem2, DefinitionList as DefinitionList2 } from "@epicbagel/saas-kit/primitives/definition-list";
import { Heading as Heading2 } from "@epicbagel/saas-kit/primitives/heading";
import { PersonAvatar as PersonAvatar2 } from "@epicbagel/saas-kit/primitives/person-avatar";
import { PanelSection as PanelSection2 } from "@epicbagel/saas-kit/primitives/panel-section";
import { ResourceCard as ResourceCard2, ResourceCardFooter as ResourceCardFooter2 } from "@epicbagel/saas-kit/primitives/resource-card";
import { Stack as Stack2 } from "@epicbagel/saas-kit/primitives/stack";
import { Text as Text3 } from "@epicbagel/saas-kit/primitives/text";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function JobStatusBlock({ title, client, statusLabel, contact, contactPhotoUrl, onClose }) {
  const { run, pendingArgs, failure } = useLatestCall(onClose);
  return /* @__PURE__ */ jsxs2(ResourceCard2, { children: [
    /* @__PURE__ */ jsx3(PanelSection2, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs2(Stack2, { direction: "horizontal", align: "start", justify: "between", wrap: true, gap: "sm", children: [
      /* @__PURE__ */ jsxs2(Stack2, { gap: "xs", children: [
        /* @__PURE__ */ jsx3(Text3, { size: "sm", tone: "muted", children: client }),
        /* @__PURE__ */ jsx3(Heading2, { level: 3, children: title })
      ] }),
      /* @__PURE__ */ jsx3(Badge2, { variant: "outline", children: statusLabel })
    ] }) }),
    contact && /* @__PURE__ */ jsx3(PanelSection2, { border: "top", paddingX: "lg", children: /* @__PURE__ */ jsx3(DefinitionList2, { children: /* @__PURE__ */ jsx3(DefinitionItem2, { label: "Hiring contact", children: contactPhotoUrl ? /* @__PURE__ */ jsxs2(Stack2, { direction: "horizontal", align: "center", gap: "sm", children: [
      /* @__PURE__ */ jsx3(PersonAvatar2, { name: contact, photoUrl: contactPhotoUrl, size: 28, decorative: true }),
      contact
    ] }) : contact }) }) }),
    failure && /* @__PURE__ */ jsx3(Alert2, { variant: "destructive", children: "Couldn\u2019t close the job. Try again." }),
    onClose && /* @__PURE__ */ jsx3(ResourceCardFooter2, { children: /* @__PURE__ */ jsx3(Button2, { size: "sm", disabled: !!pendingArgs, onClick: () => run(), children: pendingArgs ? "Closing\u2026" : "Close job" }) })
  ] });
}
function PlacementTermsBlock({ candidate, candidateMedia, role, salary, fee, startDate }) {
  return /* @__PURE__ */ jsxs2(ResourceCard2, { children: [
    candidateMedia ? /* @__PURE__ */ jsx3(WorkflowCandidateHeader, { name: candidate, role, media: candidateMedia, eyebrow: "Offer terms" }) : /* @__PURE__ */ jsx3(PanelSection2, { paddingX: "lg", paddingTop: "lg", paddingBottom: "lg", children: /* @__PURE__ */ jsxs2(Stack2, { gap: "xs", children: [
      /* @__PURE__ */ jsx3(Heading2, { level: 3, children: "Offer terms" }),
      /* @__PURE__ */ jsxs2(Text3, { size: "sm", tone: "muted", children: [
        candidate,
        " \xB7 ",
        role
      ] })
    ] }) }),
    /* @__PURE__ */ jsx3(PanelSection2, { border: "top", paddingX: "lg", children: /* @__PURE__ */ jsxs2(DefinitionList2, { variant: "divided", children: [
      /* @__PURE__ */ jsx3(DefinitionItem2, { label: "Annual salary", children: salary }),
      /* @__PURE__ */ jsx3(DefinitionItem2, { label: "Agency fee", children: fee }),
      startDate && /* @__PURE__ */ jsx3(DefinitionItem2, { label: "Start date", children: startDate })
    ] }) })
  ] });
}

// src/recruit/application-pipeline-block.tsx
import { ResourceCard as ResourceCard3 } from "@epicbagel/saas-kit/primitives/resource-card";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function ApplicationPipelineBlock({
  profile,
  ...list
}) {
  if (!profile) return /* @__PURE__ */ jsx4(CandidatePipelineList, { ...list });
  return /* @__PURE__ */ jsxs3(ResourceCard3, { className: "@container/application", children: [
    /* @__PURE__ */ jsx4(WorkflowCandidateHeader, { name: profile.name, media: profile }),
    /* @__PURE__ */ jsx4(CandidatePipelineList, { ...list })
  ] });
}
export {
  ApplicationPipelineBlock,
  InterviewScheduler,
  JobStatusBlock,
  PlacementTermsBlock
};
