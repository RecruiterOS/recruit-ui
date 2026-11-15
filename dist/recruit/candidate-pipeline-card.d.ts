import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { CandidateCoverSeed } from './candidate-cover-header.js';

interface CandidatePipelineCardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "onSelect" | "title" | "children"> {
    /** The candidate's name, on one truncated line. */
    name: ReactNode;
    /** The line under the name, usually the current title. */
    headline?: ReactNode;
    /** The current-company line, rendered as given (it brings its own text). */
    company?: ReactNode;
    /**
     * The person's own cover, as media the host owns. Left out, the kit's
     * stock banner (`CoverBanner`) is drawn in its place, in the theme's
     * colours, so everyone's card is the same height; `null` draws no cover.
     */
    cover?: ReactNode | null;
    /**
     * Deals the stock banner its design, the same one every time: the
     * person's id, say. Left out, the name is the seed where it is plain text.
     */
    coverSeed?: CandidateCoverSeed;
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
declare function CandidatePipelineCard({ name, headline, company, cover, coverSeed, badges, actions, onSelect, ...props }: CandidatePipelineCardProps): react.JSX.Element;

export { CandidatePipelineCard, type CandidatePipelineCardProps };
