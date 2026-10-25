import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CandidatePipelineCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "onSelect" | "title" | "children"> {
    /** The candidate's name, on one truncated line. */
    name: ReactNode;
    /** The line under the name, usually the current title. */
    headline?: ReactNode;
    /** The current-company line, rendered as given (it brings its own text). */
    company?: ReactNode;
    /** Media for the 4:1 cover frame. Omit it and no frame is drawn. */
    cover?: ReactNode;
    /** Small badges in a row under the identity, such as a grade or a decision. */
    badges?: ReactNode;
    /** Controls at the top right, such as a preview link. */
    actions?: ReactNode;
    /** Called when the card is activated, but not from a nested control. */
    onSelect: () => void;
}
/**
 * A dense candidate card for a pipeline board column.
 *
 * The whole card is one button that selects the candidate; a click on a
 * nested link or button in a slot never also selects it. The card renders no
 * wrapper around itself, so a board can make it draggable directly. The root
 * is the kit InteractiveCard, marked `data-slot="candidate-pipeline-card"`.
 */
declare function CandidatePipelineCard({ name, headline, company, cover, badges, actions, onSelect, ...props }: CandidatePipelineCardProps): react.JSX.Element;

export { CandidatePipelineCard, type CandidatePipelineCardProps };
