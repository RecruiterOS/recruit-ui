import * as react from 'react';
import { ReactNode, ElementType, HTMLAttributes } from 'react';

/** One chip: a value the list can be narrowed to. */
interface CandidateFilterChipOption<TValue extends string = string> {
    value: TValue;
    label: ReactNode;
    /** An icon component (not an element) drawn before the label. */
    icon?: ElementType;
}
interface CandidateFilterChipsProps<TValue extends string = string> extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "children"> {
    /** The chosen option, or null for the unfiltered chip. */
    value: TValue | null;
    /** Called with an option's value, or null from the unfiltered chip. */
    onChange: (value: TValue | null) => void;
    /** The first chip, which clears the filter, such as "Everyone". */
    allLabel: ReactNode;
    options: readonly CandidateFilterChipOption<TValue>[];
    /** Content before the chips, such as a badge naming where the list came from. */
    context?: ReactNode;
    /** Content pushed to the end of the row, such as a related control. */
    action?: ReactNode;
}
/**
 * A single row of pressed-state chips that narrows a list of people to one
 * kind, such as everyone with a recent job move. The row scrolls sideways
 * rather than wrapping, and sits on a bottom border so it reads as part of
 * the toolbar above the list. Each chip is a toggle button with
 * `aria-pressed`; the pressed one has a primary border and tint and a
 * full-strength label, the others a muted label. Every chip keeps a 44px
 * touch target on a coarse pointer (a touchscreen); a mouse keeps the 28px
 * chip. The host owns the options, their
 * wording and what each one filters. The root is marked
 * `data-slot="candidate-filter-chips"`.
 */
declare function CandidateFilterChips<TValue extends string = string>({ value, onChange, allLabel, options, context, action, ...props }: CandidateFilterChipsProps<TValue>): react.JSX.Element;

export { type CandidateFilterChipOption, CandidateFilterChips, type CandidateFilterChipsProps };
