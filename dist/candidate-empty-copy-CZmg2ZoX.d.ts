/**
 * Host wording for a blank slate: what is missing, and optionally what to do
 * about it. Every Recruit UI list or panel with an empty state takes one as
 * `empty`, and has a plain default for a host that passes none.
 */
interface CandidateEmptyCopy {
    /** "No <things> yet". */
    title: string;
    description?: string;
}

export type { CandidateEmptyCopy as C };
