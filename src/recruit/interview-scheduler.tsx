"use client";

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
import { useId, useRef, useState, type FormEvent } from "react";
import { useLatestCall } from "./pending-action";

import { WorkflowCandidateHeader, type WorkflowCandidateMedia } from "./workflow-candidate-header";

export interface InterviewDetails {
  label: string;
  /** ISO instant, including an offset. */
  scheduledAt: string;
  interviewer: string | null;
  location: string | null;
}

export interface ScheduledInterview extends InterviewDetails {
  id: string;
  version: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  feedback?: string | null;
}

type InterviewEdit = InterviewDetails | { status: "COMPLETED"; feedback: string } | { status: "CANCELLED" };

export interface InterviewSchedulerProps {
  candidate: string;
  candidateMedia?: WorkflowCandidateMedia;
  role: string;
  appointment: ScheduledInterview | null;
  defaults?: Partial<InterviewDetails>;
  /** Optional second clock for the candidate or interviewer, e.g. America/New_York. */
  timeZone?: string;
  /** Whose local time this is, for example “Sam in New York”. */
  timeZoneLabel?: string;
  locale?: string;
  onSchedule: (details: InterviewDetails) => void | Promise<void>;
  /** Receives the record as it stood when the edit began, including its version. */
  onUpdate?: (original: ScheduledInterview, edit: InterviewEdit) => void | Promise<void>;
}

type Editing = { mode: "details" | "feedback" | "cancel"; original: ScheduledInterview };

function instant(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : undefined;
}

function formatTime(date: Date, locale: string, timeZone: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone, timeZoneName: "short",
  }).format(date);
}

function InterviewTimeFields({ id, stamp, locale, timeZone, timeZoneLabel }: {
  id: string; stamp: string; locale: string; timeZone: string; timeZoneLabel: string;
}) {
  const [day, setDay] = useState(stamp.slice(0, 10));
  const [time, setTime] = useState(stamp.slice(11, stamp.endsWith(":00.000Z") ? 16 : -1));
  const local = instant(day + "T" + time + "Z");
  return (
    <Stack gap="sm">
      <FieldGrid columns={2}>
        <Field>
          <FieldLabel htmlFor={id + "-date"}>Date (UTC)</FieldLabel>
          <Input id={id + "-date"} name="date" type="date" required value={day} onChange={event => setDay(event.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor={id + "-time"}>Time (UTC)</FieldLabel>
          <Input id={id + "-time"} name="time" type="time" step={time.length > 5 ? "any" : 60}
            required value={time} onChange={event => setTime(event.target.value)} />
        </Field>
      </FieldGrid>
      {local && timeZone !== "UTC" && <Text size="sm" tone="muted" aria-live="polite">
        {timeZoneLabel} · {formatTime(local, locale, timeZone)}
      </Text>}
    </Stack>
  );
}

const statusLabels = { SCHEDULED: "Scheduled", COMPLETED: "Completed", CANCELLED: "Cancelled" };

/** One appointment on a candidate's application. The host owns persistence and invitations. */
export function InterviewScheduler({ candidate, candidateMedia, role, appointment, defaults, timeZone = "UTC", timeZoneLabel = timeZone.replaceAll("_", " "), locale = "en-GB", onSchedule, onUpdate }: InterviewSchedulerProps) {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const [edit, setEdit] = useState<Editing | null>(null);
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

  const { run, pendingArgs } = useLatestCall(async (form: HTMLFormElement) => {
    if (busy.current) return;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    busy.current = true;
    setError("");
    try {
      if (edit && !onUpdate) throw new Error("You can no longer edit this appointment.");
      if (edit?.mode === "feedback") {
        if (!value("feedback")) throw new Error("Enter feedback before completing the interview.");
        await onUpdate!(edit.original, { status: "COMPLETED", feedback: value("feedback") });
      } else if (edit?.mode === "cancel") {
        await onUpdate!(edit.original, { status: "CANCELLED" });
      } else {
        const date = instant(value("date") + "T" + value("time") + "Z");
        if (!value("label") || !date) throw new Error("Enter an interview name, date and time.");
        const next = {
          label: value("label"), scheduledAt: date.toISOString(),
          interviewer: value("interviewer") || null, location: value("location") || null,
        };
        if (original) await onUpdate!(original, next);
        else await onSchedule(next);
      }
      finish();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Couldn’t save the interview. Try again.");
    } finally {
      busy.current = false;
    }
  });

  function begin(mode: Editing["mode"]) {
    if (appointment) {
      setError("");
      setEdit({ mode, original: appointment });
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!busy.current) run(event.currentTarget);
  }

  const date = instant(appointment?.scheduledAt);
  const title = viewing ? appointment.label : edit?.mode === "feedback" ? "Interview feedback"
    : edit?.mode === "cancel" ? "Cancel this interview?" : edit ? "Edit interview" : "Schedule an interview";

  return (
    <ResourceCard data-slot="interview-scheduler">
      {candidateMedia && <WorkflowCandidateHeader name={candidate} role={role} media={candidateMedia} />}
      <PanelSection border={candidateMedia ? "top" : "none"} paddingX="lg" paddingTop="lg" paddingBottom="lg">
        <Stack direction="horizontal" justify="between" align="start" wrap gap="sm">
          <Stack gap="xs">
            <Heading level={3} ref={heading} tabIndex={-1}>{title}</Heading>
            {!candidateMedia && <Text size="sm" tone="muted">{candidate} · {role}</Text>}
          </Stack>
          {appointment && <Badge variant="outline">{statusLabels[appointment.status]}</Badge>}
        </Stack>
      </PanelSection>
      {viewing ? <>
        <PanelSection border="top" paddingX="lg" paddingTop="lg" paddingBottom="lg">
          <Stack gap="md">
            {date && <Stack gap="xs">
              {timeZone !== "UTC" && <Text size="sm" tone="muted">{timeZoneLabel}</Text>}
              <Text weight="semibold"><time dateTime={appointment.scheduledAt}>{formatTime(date, locale, timeZone)}</time></Text>
              {timeZone !== "UTC" && <Text size="sm" tone="muted">{formatTime(date, locale, "UTC")}</Text>}
            </Stack>}
            <DefinitionList variant="divided">
              {appointment.interviewer && <DefinitionItem label="Interviewer">{appointment.interviewer}</DefinitionItem>}
              {appointment.location && <DefinitionItem label="Location">{appointment.location}</DefinitionItem>}
              {appointment.feedback && <DefinitionItem label="Feedback">{appointment.feedback}</DefinitionItem>}
            </DefinitionList>
          </Stack>
        </PanelSection>
        {onUpdate && appointment.status === "SCHEDULED" && <ResourceCardFooter align="start" wrap>
          <Button size="sm" onClick={() => begin("feedback")}>Record feedback</Button>
          <Button size="sm" variant="secondary" onClick={() => begin("details")}>Edit interview</Button>
          <Button size="sm" variant="ghost" onClick={() => begin("cancel")}>Cancel interview</Button>
        </ResourceCardFooter>}
      </> : <form onSubmit={submit} key={edit?.mode ?? "create"} aria-busy={!!pendingArgs}>
        <fieldset disabled={!!pendingArgs} className="min-w-0">
          <PanelSection border="top" paddingX="lg" paddingTop="lg" paddingBottom="lg">
            {pickingTime ? <Stack gap="lg">
              <Field>
                <FieldLabel htmlFor={id + "-label"}>Interview name</FieldLabel>
                <Input id={id + "-label"} name="label" required defaultValue={details?.label} autoFocus={!!edit} />
              </Field>
              <InterviewTimeFields id={id} stamp={stamp} locale={locale} timeZone={timeZone} timeZoneLabel={timeZoneLabel} />
              <FieldGrid columns={2}>
                <Field><FieldLabel htmlFor={id + "-who"}>Interviewer</FieldLabel>
                  <Input id={id + "-who"} name="interviewer" defaultValue={details?.interviewer ?? ""} /></Field>
                <Field><FieldLabel htmlFor={id + "-where"}>Location or meeting link</FieldLabel>
                  <Input id={id + "-where"} name="location" defaultValue={details?.location ?? ""} /></Field>
              </FieldGrid>
            </Stack> : edit?.mode === "feedback" ? <Field>
              <FieldLabel htmlFor={id + "-feedback"}>Feedback from {original?.interviewer || "the interviewer"}</FieldLabel>
              <Textarea id={id + "-feedback"} name="feedback" required autoFocus defaultValue={original?.feedback ?? ""} />
            </Field> : <Text>Mark this appointment as cancelled on {candidate}’s application.</Text>}
            {error && <Alert variant="destructive" marginTop="md">{error}</Alert>}
          </PanelSection>
          <PanelSection border="top" paddingX="lg" paddingTop="md" paddingBottom="md">
            <Stack direction="horizontal" justify="end" wrap gap="sm">
              {edit && <Button type="button" size="sm" variant="secondary" autoFocus={edit.mode === "cancel"} onClick={finish}>Go back</Button>}
              <Button type="submit" size="sm" disabled={!!pendingArgs}>
                {pendingArgs ? "Saving…" : !edit ? "Schedule interview" : edit.mode === "feedback" ? "Complete interview"
                  : edit.mode === "cancel" ? "Confirm cancellation" : "Save changes"}
              </Button>
            </Stack>
          </PanelSection>
        </fieldset>
      </form>}
    </ResourceCard>
  );
}
