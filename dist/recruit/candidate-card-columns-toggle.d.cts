import * as react from 'react';

type CandidateCardColumns = 1 | 2;
interface CandidateCardColumnsState {
    columns: CandidateCardColumns;
    setColumns: (columns: CandidateCardColumns) => void;
}
/**
 * The cards-per-row choice for one list, kept by the kit's layout preference
 * under `viewId` for the rest of the browser session. Lists that share a
 * `viewId` share the choice, so keep an id stable once people rely on it.
 * One column until someone picks.
 */
declare function useCandidateCardColumns(viewId: string): CandidateCardColumnsState;
/** Host-owned wording for the toggle and its two options. */
interface CandidateCardColumnsToggleLabels {
    group: string;
    one: string;
    two: string;
}
interface CandidateCardColumnsToggleProps {
    columns: CandidateCardColumns;
    onChange: (columns: CandidateCardColumns) => void;
    /** Larger controls, to sit beside a roomy toolbar. */
    roomy?: boolean;
    labels?: Partial<CandidateCardColumnsToggleLabels>;
    className?: string;
}
/**
 * One or two candidate cards per row. Desktop only: on a phone the cards are
 * always one column, so the control renders nothing there.
 */
declare function CandidateCardColumnsToggle({ columns, onChange, roomy, labels, className, }: CandidateCardColumnsToggleProps): react.JSX.Element;

export { type CandidateCardColumns, type CandidateCardColumnsState, CandidateCardColumnsToggle, type CandidateCardColumnsToggleLabels, type CandidateCardColumnsToggleProps, useCandidateCardColumns };
