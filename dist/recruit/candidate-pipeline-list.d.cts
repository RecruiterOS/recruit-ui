import * as react from 'react';
import { ReactNode, HTMLAttributes, Key } from 'react';
import { Sentiment } from '@epicbagel/saas-kit/primitives/sentiment-dot';
import { CandidateStageOption } from './candidate-stage-select.cjs';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';
import '@epicbagel/saas-kit/primitives/select';

/** A row's stage control. */
interface CandidatePipelineRowStage<TStage extends string = string> {
    value: TStage;
    /** The stages, in pipeline order. */
    options: readonly CandidateStageOption<TStage>[];
    /** Called with the stage a person picks; the host saves the move. */
    onChange: (value: TStage) => void;
}
/** One role a person is in the pipeline for. */
interface CandidatePipelineRow<TStage extends string = string> {
    id: Key;
    /** The role's title. */
    title: ReactNode;
    /** After the title, such as a grade badge. */
    grade?: ReactNode;
    /** Under the title, such as the hiring company. */
    subtitle?: ReactNode;
    /** Opens the role. */
    onOpen?: () => void;
    stage: CandidatePipelineRowStage<TStage>;
    /** Under the row, such as CandidateJobEvidence and CandidateSummaryBullets for that role. */
    children?: ReactNode;
}
interface CandidatePipelineListLabels {
    /** The tooltip on each row's title. */
    open: string;
}
interface CandidatePipelineListProps<TStage extends string = string> extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The section heading. The count follows it once loaded. */
    title?: ReactNode;
    rows: readonly CandidatePipelineRow<TStage>[];
    /** A skeleton control in place of the rows, and no count yet. */
    loading?: boolean;
    /** At the end of the header, such as an add-to-role control. */
    action?: ReactNode;
    /** The blank slate's wording. Defaults to "No roles yet". */
    empty?: CandidateEmptyCopy;
    labels?: Partial<CandidatePipelineListLabels>;
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * The roles a person is in the pipeline for, as a counted section of muted
 * rows: the role's title (which opens it), a grade, the company, and a
 * compact CandidateStageSelect, with the host's evidence for that role
 * underneath. Loading shows a skeleton control; no roles renders the kit's
 * empty state.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-pipeline-list"`.
 */
declare function CandidatePipelineList<TStage extends string = string>({ title, rows, loading, action, empty, labels, border, ...props }: CandidatePipelineListProps<TStage>): react.JSX.Element;
/** One line of a summary, with its sentiment dot. */
interface CandidateSummaryBullet {
    text: ReactNode;
    sentiment: Sentiment;
    /**
     * The word a screen reader says for this line's dot, in place of the one
     * `labels.sentiment` gives its sentiment, such as the host's "Risk".
     */
    sentimentLabel?: string;
}
/** The word a screen reader says for each sentiment's dot. */
type CandidateSentimentLabels = Record<Sentiment, string>;
interface CandidateSummaryBulletsLabels {
    generate: string;
    /** In place of generate once a summary exists. */
    refresh: string;
    generating: string;
    /**
     * Read before each line, because the dot is decorative: without a word, a
     * screen reader announces a positive and a negative line alike, and only
     * the dot's colour tells them apart.
     */
    sentiment: CandidateSentimentLabels;
}
/** CandidateSummaryBullets' labels as a host gives them: any of them, and any sentiment's word. */
type CandidateSummaryBulletsLabelOverrides = Partial<Omit<CandidateSummaryBulletsLabels, "sentiment">> & {
    sentiment?: Partial<CandidateSentimentLabels>;
};
interface CandidateSummaryBulletsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /** The lines to show; the host may fall back to other evidence when there is no summary. */
    bullets: readonly CandidateSummaryBullet[];
    /** Adds a link-style button that asks the host for a summary. */
    onGenerate?: () => void;
    /** Shows a spinner on the button and disables it. */
    generating?: boolean;
    /** Says refresh instead of generate, once a summary exists. */
    generated?: boolean;
    /** Why the last request failed. */
    error?: ReactNode;
    labels?: CandidateSummaryBulletsLabelOverrides;
}
/**
 * A short summary of a person for one role, as a dense list of lines with
 * sentiment dots, and a link-style button to generate or refresh it.
 *
 * The dot is decorative, so each line also carries its sentiment as a word
 * for screen readers ("Positive", "Caution", …, from `labels.sentiment` or
 * the bullet's own `sentimentLabel`), visually hidden before the text.
 *
 * The root is marked `data-slot="candidate-summary-bullets"`.
 */
declare function CandidateSummaryBullets({ bullets, onGenerate, generating, generated, error, labels, ...props }: CandidateSummaryBulletsProps): react.JSX.Element;

export { CandidatePipelineList, type CandidatePipelineListLabels, type CandidatePipelineListProps, type CandidatePipelineRow, type CandidatePipelineRowStage, type CandidateSentimentLabels, type CandidateSummaryBullet, CandidateSummaryBullets, type CandidateSummaryBulletsLabelOverrides, type CandidateSummaryBulletsLabels, type CandidateSummaryBulletsProps };
