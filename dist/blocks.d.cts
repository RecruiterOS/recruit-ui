import * as react from 'react';
export { CandidatePipelineList as ApplicationPipelineBlock } from './recruit/candidate-pipeline-list.cjs';
import '@epicbagel/saas-kit/primitives/sentiment-dot';
import './recruit/candidate-stage-select.cjs';
import '@epicbagel/saas-kit/primitives/select';
import './candidate-empty-copy-CZmg2ZoX.cjs';

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
    role: string;
    appointment: ScheduledInterview | null;
    defaults?: Partial<InterviewDetails>;
    /** Optional second clock for the candidate or interviewer, e.g. America/New_York. */
    timeZone?: string;
    locale?: string;
    onSchedule: (details: InterviewDetails) => void | Promise<void>;
    /** Receives the record as it stood when the edit began, including its version. */
    onUpdate?: (original: ScheduledInterview, edit: InterviewEdit) => void | Promise<void>;
}
/** One appointment on a candidate's application. The host owns persistence and invitations. */
declare function InterviewScheduler({ candidate, role, appointment, defaults, timeZone, locale, onSchedule, onUpdate }: InterviewSchedulerProps): react.JSX.Element;

interface JobStatusBlockProps {
    title: string;
    client: string;
    statusLabel: string;
    contact?: string;
    /** Supply only while closing is available. The host supplies the saved status. */
    onClose?: () => void | Promise<void>;
}
declare function JobStatusBlock({ title, client, statusLabel, contact, onClose }: JobStatusBlockProps): react.JSX.Element;
interface PlacementTermsBlockProps {
    candidate: string;
    role: string;
    /** Amounts already formatted in the offer currency. */
    salary: string;
    fee: string;
    startDate?: string;
}
declare function PlacementTermsBlock({ candidate, role, salary, fee, startDate }: PlacementTermsBlockProps): react.JSX.Element;

export { type InterviewDetails, InterviewScheduler, type InterviewSchedulerProps, JobStatusBlock, type JobStatusBlockProps, PlacementTermsBlock, type PlacementTermsBlockProps, type ScheduledInterview };
