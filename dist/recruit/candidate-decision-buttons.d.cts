import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

/** The two calls a reviewer can make on a candidate. */
type CandidateDecisionChoice = "yes" | "no";
/** Host-owned wording for the two buttons. */
interface CandidateDecisionButtonsLabels {
    yes: ReactNode;
    no: ReactNode;
}
interface CandidateDecisionButtonsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /**
     * Called with the button a person pressed. Nothing is recorded yet: the
     * host usually opens its own sheet or dialog to ask why, then saves.
     */
    onChoose: (decision: CandidateDecisionChoice) => void;
    size?: "sm" | "default";
    /** Share the available width between the two buttons, as in an action bar. */
    stretch?: boolean;
    labels?: Partial<CandidateDecisionButtonsLabels>;
    /**
     * Rendered inside the group after the buttons, usually the host's reason
     * sheet. Events that bubble out of its portal then stop here with the
     * buttons' own, instead of reaching a clickable card.
     */
    children?: ReactNode;
}
/**
 * Yes and No as equal, neutral outline buttons with thumbs icons. Neither is
 * styled as the default answer.
 *
 * Unlike `CandidateDecisionBar`, which shows a recorded value as a pressed
 * option, these buttons hold no value: a press starts the host's decision
 * flow. Every click inside the group stops propagating, so the buttons work
 * inside a clickable candidate card. The root is marked
 * `data-slot="candidate-decision-buttons"`.
 */
declare function CandidateDecisionButtons({ onChoose, size, stretch, labels, children, onClick, ...props }: CandidateDecisionButtonsProps): react.JSX.Element;

export { CandidateDecisionButtons, type CandidateDecisionButtonsLabels, type CandidateDecisionButtonsProps, type CandidateDecisionChoice };
