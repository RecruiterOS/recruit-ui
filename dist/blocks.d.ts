import * as react from 'react';
import { CandidatePipelineListProps } from './recruit/candidate-pipeline-list.js';
import '@epicbagel/saas-kit/primitives/sentiment-dot';
import './recruit/candidate-stage-select.js';
import '@epicbagel/saas-kit/primitives/select';
import './candidate-empty-copy-CZmg2ZoX.js';

/** Profile media returned with a candidate. Missing images use the kit fallbacks. */
interface WorkflowCandidateMedia {
    photoUrl?: string | null;
    bannerUrl?: string | null;
}

interface InterviewDetails {
    label: string;
    /** ISO instant, including an offset. */
    scheduledAt: string;
    interviewer: string | null;
    location: string | null;
}
interface ScheduledInterview extends InterviewDetails {
    id: string;
    version: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    feedback?: string | null;
}
type InterviewEdit = InterviewDetails | {
    status: "COMPLETED";
    feedback: string;
} | {
    status: "CANCELLED";
};
interface InterviewSchedulerProps {
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
/** One appointment on a candidate's application. The host owns persistence and invitations. */
declare function InterviewScheduler({ candidate, candidateMedia, role, appointment, defaults, timeZone, timeZoneLabel, locale, onSchedule, onUpdate }: InterviewSchedulerProps): react.JSX.Element;

interface JobStatusBlockProps {
    title: string;
    client: string;
    statusLabel: string;
    contact?: string;
    contactPhotoUrl?: string | null;
    /** Supply only while closing is available. The host supplies the saved status. */
    onClose?: () => void | Promise<void>;
}
declare function JobStatusBlock({ title, client, statusLabel, contact, contactPhotoUrl, onClose }: JobStatusBlockProps): react.JSX.Element;
interface PlacementTermsBlockProps {
    candidate: string;
    candidateMedia?: WorkflowCandidateMedia;
    role: string;
    /** Amounts already formatted in the offer currency. */
    salary: string;
    fee: string;
    startDate?: string;
}
declare function PlacementTermsBlock({ candidate, candidateMedia, role, salary, fee, startDate }: PlacementTermsBlockProps): react.JSX.Element;

declare function ApplicationPipelineBlock<TStage extends string = string>({ profile, ...list }: CandidatePipelineListProps<TStage> & {
    profile?: WorkflowCandidateMedia & {
        name: string;
    };
}): react.JSX.Element;

export { ApplicationPipelineBlock, type InterviewDetails, InterviewScheduler, type InterviewSchedulerProps, JobStatusBlock, type JobStatusBlockProps, PlacementTermsBlock, type PlacementTermsBlockProps, type ScheduledInterview, type WorkflowCandidateMedia };
