import * as react from 'react';
import { ReactNode, ElementType } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

/** One choice in the popover's job, stage or assessor select. */
interface CandidateAddToJobOption<TValue extends string = string> {
    value: TValue;
    label: ReactNode;
}
/** How the popover adds people: straight to a stage, or through an assessment. */
type CandidateAddToJobMode = "stage" | "assess";
interface CandidateAddToJobPopoverLabels {
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
interface CandidateAddToJobPopoverProps<TJob extends string = string, TStage extends string = string, TAssessor extends string = string> {
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
declare function CandidateAddToJobPopover<TJob extends string = string, TStage extends string = string, TAssessor extends string = string>({ jobs, stages, defaultStage, defaultJob, count, onConfirm, assessors, onAssess, assessIcon, trigger, align, empty, labels, }: CandidateAddToJobPopoverProps<TJob, TStage, TAssessor>): react.JSX.Element;

export { type CandidateAddToJobMode, type CandidateAddToJobOption, CandidateAddToJobPopover, type CandidateAddToJobPopoverLabels, type CandidateAddToJobPopoverProps };
