import * as react from 'react';
import { ReactNode } from 'react';
import { SelectTriggerProps } from '@epicbagel/saas-kit/primitives/select';

/** One stage a candidate can be moved to. */
interface CandidateStageOption<TValue extends string = string> {
    value: TValue;
    label: ReactNode;
}
interface CandidateStageSelectProps<TValue extends string = string> extends Omit<SelectTriggerProps, "children" | "value" | "defaultValue" | "onChange" | "dir"> {
    /** The candidate's current stage. */
    value: TValue;
    /** The stages, in pipeline order. */
    options: readonly CandidateStageOption<TValue>[];
    /** Called with the stage a person picks; the host saves the move. */
    onChange: (value: TValue) => void;
    /** Size of the menu items. Defaults to `textSize`. */
    itemSize?: "sm" | "xs";
    disabled?: boolean;
}
/**
 * A compact select for a candidate's pipeline stage, for an action bar or a
 * row in a person's pipeline list.
 *
 * Trigger props such as `controlSize`, `width`, `textSize`, `grow`, `shrink`
 * and `title` pass straight to the kit's select trigger, which is marked
 * `data-slot="candidate-stage-select"`. The host owns the stages, their
 * wording and the move itself.
 */
declare function CandidateStageSelect<TValue extends string = string>({ value, options, onChange, itemSize, disabled, textSize, ...trigger }: CandidateStageSelectProps<TValue>): react.JSX.Element;

export { type CandidateStageOption, CandidateStageSelect, type CandidateStageSelectProps };
