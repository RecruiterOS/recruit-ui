import * as react from 'react';
import { Key, ReactNode, HTMLAttributes } from 'react';

/** One fact about a person, such as the languages they speak. */
interface CandidateFact {
    id: Key;
    /** What the fact is. Each word is capitalised, so a lower-case kind reads as a title. */
    label: ReactNode;
    /** The value, already formatted, for example with formatFactValue. */
    value: ReactNode;
}
interface CandidateFactListProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The section heading. The count follows it. */
    title?: ReactNode;
    facts: readonly CandidateFact[];
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * Collected facts about a person, as a counted definition list. Facts are
 * usually gathered over time and many people have none, so with no facts it
 * renders nothing rather than an empty panel.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-fact-list"`.
 */
declare function CandidateFactList({ title, facts, border, ...props }: CandidateFactListProps): react.JSX.Element | null;
/**
 * Formats a stored fact value for display. Text, numbers and booleans read as
 * written; a list of words joins with commas; a record joins its non-empty
 * values with middle dots (dropping `color` and `sentiment`, which are styling
 * hints); a list of records becomes a tight list. An empty value reads as an
 * em dash.
 */
declare function formatFactValue(value: unknown): ReactNode;

export { type CandidateFact, CandidateFactList, type CandidateFactListProps, formatFactValue };
