"use client";

import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Timeline, TimelineRow } from "@epicbagel/saas-kit/primitives/timeline";
import { Check, Circle, CircleDot } from "lucide-react";
import type { HTMLAttributes, Key, ReactNode } from "react";

/** Where a step of a search stands. */
export type JobSearchStepState = "done" | "current" | "upcoming";

/** One step of a search, as the person waiting on it reads it. */
export interface JobSearchStep {
  id: Key;
  /** The step's name, such as "Shortlist". */
  title: ReactNode;
  state: JobSearchStepState;
  /** What happens in this step, or what happened. */
  description?: ReactNode;
  /** At the row's end, such as a date or how long the step takes. */
  meta?: ReactNode;
  /**
   * Under the description, such as a link to book a call. Usually given
   * only on the current step: it is what the reader does next.
   */
  action?: ReactNode;
}

/** Host-owned wording for each state, read out beside the step's name. */
export interface JobSearchProgressLabels {
  done: string;
  current: string;
  upcoming: string;
}

const DEFAULT_LABELS: JobSearchProgressLabels = {
  done: "Done",
  current: "In progress",
  upcoming: "Not started",
};

const GLYPHS = { done: Check, current: CircleDot, upcoming: Circle } as const;

export interface JobSearchProgressProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The steps, in the order they happen. */
  steps: readonly JobSearchStep[];
  labels?: Partial<JobSearchProgressLabels>;
}

/**
 * Where a search stands, for the person it is run for: its steps in order,
 * each done, in progress or still to come, with the current step's next
 * action under it. A client's view of a search, or a recruiter's summary of
 * one.
 *
 * The host decides the steps, their wording and which is current: the
 * component holds no workflow. A step's state is a glyph and a visually
 * hidden word (`labels`), never colour alone, and the current step carries
 * `aria-current="step"`. Upcoming steps are muted. The root is marked
 * `data-slot="job-search-progress"`; each step is a kit timeline row inside
 * a list item marked `data-slot="job-search-step"` with its state in
 * `data-state`.
 */
export function JobSearchProgress({ steps, labels, ...props }: JobSearchProgressProps) {
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <Stack as="section" data-slot="job-search-progress" gap="none" {...props}>
      <Timeline spacing="tight">
        <ol className="m-0 list-none space-y-2 p-0">
          {steps.map((step) => (
            <li
              key={step.id}
              data-slot="job-search-step"
              data-state={step.state}
              aria-current={step.state === "current" ? "step" : undefined}
            >
              <TimelineRow
                surface={step.state === "current" ? "muted" : "transparent"}
                icon={
                  <Text
                    as="span"
                    variant="inherit"
                    tone={step.state === "upcoming" ? "muted" : undefined}
                  >
                    <Icon icon={GLYPHS[step.state]} size="sm" />
                    <span className="sr-only">{text[step.state]}: </span>
                  </Text>
                }
                title={
                  <Text
                    as="span"
                    variant="inherit"
                    weight={step.state === "current" ? "semibold" : undefined}
                    tone={step.state === "upcoming" ? "muted" : undefined}
                  >
                    {step.title}
                  </Text>
                }
                timestamp={step.meta}
              >
                {/* Under the title rather than as the row's subtitle, which the kit keeps to one line. */}
                {step.description != null && step.description !== false && step.description !== "" ? (
                  <Text size="sm" tone="muted">
                    {step.description}
                  </Text>
                ) : null}
                {step.action != null && step.action !== false ? (
                  <Stack direction="horizontal" gap="sm" wrap marginTop="sm">
                    {step.action}
                  </Stack>
                ) : null}
              </TimelineRow>
            </li>
          ))}
        </ol>
      </Timeline>
    </Stack>
  );
}
