"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@epicbagel/saas-kit/primitives/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@epicbagel/saas-kit/primitives/select";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ToggleGroup, ToggleGroupItem } from "@epicbagel/saas-kit/primitives/toggle-group";
import { Briefcase, Check, ClipboardCheck, Loader2 } from "lucide-react";
import { useState, type ElementType, type ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

/** One choice in the popover's job, stage or assessor select. */
export interface CandidateAddToJobOption<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
}

/** How the popover adds people: straight to a stage, or through an assessment. */
export type CandidateAddToJobMode = "stage" | "assess";

export interface CandidateAddToJobPopoverLabels {
  /** The default trigger's text. */
  trigger: ReactNode;
  /** The popover's heading, for how many people it adds. */
  title: (count: number) => ReactNode;
  /** The job select's accessible name. */
  job: string;
  /** The job select's placeholder. */
  jobPlaceholder: ReactNode;
  /** The stage select's accessible name. */
  stage: string;
  /** Each stage in the stage select, from its label. */
  stageOption: (label: ReactNode) => ReactNode;
  /** The assessor select's accessible name. */
  assessor: string;
  /** The assessor select's placeholder. */
  assessorPlaceholder: ReactNode;
  /** The mode toggle's accessible name. */
  mode: string;
  /** The toggle that picks a stage. */
  setStage: ReactNode;
  /** The toggle that picks an assessor, and the submit button in that mode. */
  assess: ReactNode;
  /** The submit button in stage mode. */
  confirm: ReactNode;
  /** The submit button while a stage add is in flight. */
  adding: ReactNode;
  /** The submit button while an assessment is in flight. */
  assessing: ReactNode;
}

const LABELS: CandidateAddToJobPopoverLabels = {
  trigger: "Add to job",
  title: (count) => (count > 1 ? `Add ${count} candidates to a job` : "Add to job"),
  job: "Job",
  jobPlaceholder: "Pick a job…",
  stage: "Stage",
  stageOption: (label) => <>at {label}</>,
  assessor: "Assessor",
  assessorPlaceholder: "Pick an assessor…",
  mode: "How to add candidates",
  setStage: "Set stage",
  assess: "Assess",
  confirm: "Confirm",
  adding: "Adding…",
  assessing: "Assessing…",
};

export interface CandidateAddToJobPopoverProps<
  TJob extends string = string,
  TStage extends string = string,
  TAssessor extends string = string,
> {
  /** The jobs people can be added to, in order. */
  jobs: readonly CandidateAddToJobOption<TJob>[];
  /** The stages they can land at, in order. */
  stages: readonly CandidateAddToJobOption<TStage>[];
  /**
   * The stage picked each time the popover opens. Defaults to the first
   * stage, as does a value `stages` doesn't list.
   */
  defaultStage?: TStage;
  /**
   * The job picked each time the popover opens, such as a suggested match. A
   * value `jobs` doesn't list, such as a job the person was just added to and
   * the host has since left out, counts as no pick.
   */
  defaultJob?: TJob;
  /** How many people this adds; the default heading says so when it is more than one. */
  count?: number;
  /**
   * Adds the people to the picked job at the picked stage. The popover closes
   * once it settles; if it throws, it stays open with its choices, so report
   * the failure here.
   */
  onConfirm: (job: TJob, stage: TStage) => void | Promise<void>;
  /**
   * Who or what can assess people for the job instead of a stage being set,
   * such as a screening checklist. With `onAssess`, a toggle offers this
   * second mode.
   */
  assessors?: readonly CandidateAddToJobOption<TAssessor>[];
  /** Adds the people to the job and has the picked assessor assess them. */
  onAssess?: (job: TJob, assessor: TAssessor) => void | Promise<void>;
  /** The assess mode's glyph, on its toggle and submit button. */
  assessIcon?: ElementType;
  /** The element that opens the popover. Defaults to an outline "Add to job" button. */
  trigger?: ReactNode;
  /** Where the popover lines up with its trigger. Defaults to `start`. */
  align?: "start" | "center" | "end";
  /** The empty state inside the job select when there are no jobs. */
  empty?: CandidateEmptyCopy;
  labels?: Partial<CandidateAddToJobPopoverLabels>;
}

/** `value` when `options` lists it, otherwise "" (nothing picked). */
function listed(options: readonly CandidateAddToJobOption[], value: string | undefined): string {
  return value !== undefined && options.some((option) => option.value === value) ? value : "";
}

/**
 * Adds one or more people to a job: a select for the job, then one for the
 * stage they land at, and Confirm. With `assessors` and `onAssess`, a toggle
 * offers a second mode that has an assessor of your choosing assess them
 * instead. You add them and run the assessment; the popover closes once
 * your callback settles, and stays open with its choices if it throws.
 * Each time it opens it starts again from `defaultJob` and `defaultStage`,
 * so a job picked last time, which the host may since have left out of
 * `jobs`, is never submitted twice.
 *
 * The popover surface is marked `data-slot="candidate-add-to-job-popover"`.
 */
export function CandidateAddToJobPopover<
  TJob extends string = string,
  TStage extends string = string,
  TAssessor extends string = string,
>({
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
  labels,
}: CandidateAddToJobPopoverProps<TJob, TStage, TAssessor>) {
  const copy = { ...LABELS, ...labels };
  const initialStage = () => listed(stages, defaultStage) || (stages[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const [pickedJob, setJob] = useState<string>(() => listed(jobs, defaultJob));
  const [pickedStage, setStage] = useState<string>(initialStage);
  const [pickedAssessor, setAssessor] = useState<string>("");
  const [mode, setMode] = useState<CandidateAddToJobMode>("stage");
  const [busy, setBusy] = useState(false);

  // A pick the current options no longer list counts as no pick, so the
  // select shows its placeholder and Confirm stays disabled.
  const job = listed(jobs, pickedJob);
  const stage = listed(stages, pickedStage);
  const assessor = listed(assessors, pickedAssessor);

  const canAssess = assessors.length > 0 && !!onAssess;
  const assessing = canAssess && mode === "assess";

  const onOpenChange = (next: boolean) => {
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
      if (assessing) await onAssess!(job as TJob, assessor as TAssessor);
      else await onConfirm(job as TJob, stage as TStage);
      setOpen(false);
    } catch {
      // You report a failure in your own callback; the popover stays open
      // with its choices, so trying again is one tap.
    } finally {
      setBusy(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Icon icon={Briefcase} size="sm" />
            {copy.trigger}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        data-slot="candidate-add-to-job-popover"
        align={align}
        padding="compact"
        spacing="compact"
      >
        <Text as="div" variant="eyebrow">
          {copy.title(count)}
        </Text>

        <Select value={job} onValueChange={setJob}>
          <SelectTrigger aria-label={copy.job}>
            <SelectValue placeholder={copy.jobPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {jobs.length === 0 && (
              <EmptyState
                variant="empty"
                size="inline"
                icon={Briefcase}
                title={empty.title}
                description={empty.description ?? ""}
              />
            )}
            {jobs.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canAssess && (
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value === "stage" || value === "assess") setMode(value);
            }}
            variant="outline"
            size="sm"
            aria-label={copy.mode}
          >
            <ToggleGroupItem value="stage" grow textSize="xs">
              {copy.setStage}
            </ToggleGroupItem>
            <ToggleGroupItem value="assess" grow textSize="xs">
              <Icon icon={assessIcon} size="xs" />
              {copy.assess}
            </ToggleGroupItem>
          </ToggleGroup>
        )}

        {assessing ? (
          <Select value={assessor} onValueChange={setAssessor}>
            <SelectTrigger aria-label={copy.assessor}>
              <SelectValue placeholder={copy.assessorPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {assessors.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger aria-label={copy.stage}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {copy.stageOption(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          type="button"
          onClick={() => void submit()}
          disabled={!job || (assessing ? !assessor : !stage) || busy}
          width="full"
          size="sm"
        >
          {busy ? (
            <Icon icon={Loader2} size="md" spin />
          ) : assessing ? (
            <Icon icon={assessIcon} size="md" />
          ) : (
            <Icon icon={Check} size="md" />
          )}
          {busy
            ? assessing ? copy.assessing : copy.adding
            : assessing ? copy.assess : copy.confirm}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
