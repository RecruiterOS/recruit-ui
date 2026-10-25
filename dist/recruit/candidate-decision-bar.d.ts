import * as react from 'react';
import { ReactNode } from 'react';
import { DecisionActionOption } from '@epicbagel/saas-kit/primitives/decision-actions';

type CandidateDecisionOption<TValue extends string = string> = DecisionActionOption<TValue>;
interface CandidateDecisionBarProps<TValue extends string = string> {
    options: readonly CandidateDecisionOption<TValue>[];
    value?: TValue;
    onChange: (value: TValue) => void;
    disabled?: boolean;
    ariaLabel?: string;
    trailing?: ReactNode;
    layout?: "inline" | "fill";
}
/** Decision controls only, so the containing card or dialog owns its surface. */
declare function CandidateDecisionBar<TValue extends string>({ options, value, onChange, disabled, ariaLabel, trailing, layout, }: CandidateDecisionBarProps<TValue>): react.JSX.Element;

export { CandidateDecisionBar, type CandidateDecisionBarProps, type CandidateDecisionOption };
