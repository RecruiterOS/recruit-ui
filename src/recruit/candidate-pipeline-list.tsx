"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { SentimentDot, type Sentiment } from "@epicbagel/saas-kit/primitives/sentiment-dot";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Briefcase, ChevronRight, Loader2, Sparkles } from "lucide-react";
import type { HTMLAttributes, Key, ReactNode } from "react";

import { CandidateStageSelect, type CandidateStageOption } from "./candidate-stage-select";
import type { CandidateEmptyCopy } from "./candidate-empty-copy";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

/** A row's stage control. */
export interface CandidatePipelineRowStage<TStage extends string = string> {
  value: TStage;
  /** The stages, in pipeline order. */
  options: readonly CandidateStageOption<TStage>[];
  /** Called with the stage a person picks; the host saves the move. */
  onChange: (value: TStage) => void;
}

/** One role a person is in the pipeline for. */
export interface CandidatePipelineRow<TStage extends string = string> {
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

export interface CandidatePipelineListLabels {
  /** The tooltip on each row's title. */
  open: string;
}

export interface CandidatePipelineListProps<TStage extends string = string>
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
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
export function CandidatePipelineList<TStage extends string = string>({
  title = "Pipeline",
  rows,
  loading = false,
  action,
  empty = { title: "No roles yet" },
  labels,
  border = "bottom",
  ...props
}: CandidatePipelineListProps<TStage>) {
  const openLabel = labels?.open ?? "Open pipeline";

  return (
    <PanelSection data-slot="candidate-pipeline-list" border={border} {...props}>
      <SectionHeader label={title} count={loading ? undefined : rows.length} action={action} />
      {loading ? (
        <Stack direction="vertical" gap="sm">
          <Skeleton preset="control" />
        </Stack>
      ) : rows.length === 0 ? (
        <EmptyState
          variant="empty"
          size="inline"
          icon={Briefcase}
          title={empty.title}
          description={empty.description}
        />
      ) : (
        <Stack direction="vertical" gap="sm">
          {rows.map((row) => (
            <Stack
              direction="vertical"
              gap="xs"
              key={row.id}
              radius="md"
              surface="muted"
              padding="sm"
              interaction="group-hover-accent"
            >
              <Stack direction="horizontal" gap="sm" align="center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => row.onOpen?.()}
                  size="bare"
                  minWidth="zero"
                  grow
                  align="start"
                  textAlign="start"
                  title={openLabel}
                >
                  <Stack gap="none" width="full">
                    <Text size="sm" weight="medium" truncate display="inline-flex">
                      {row.title}
                      {row.grade}
                      <Icon icon={ChevronRight} size="xs" tone="muted" visibility="parent-hover" />
                    </Text>
                    {present(row.subtitle) && (
                      <Text size="xs" tone="muted" truncate>
                        {row.subtitle}
                      </Text>
                    )}
                  </Stack>
                </Button>
                <CandidateStageSelect
                  value={row.stage.value}
                  options={row.stage.options}
                  onChange={row.stage.onChange}
                  controlSize="compact"
                  width="compact"
                  textSize="xs"
                  shrink={false}
                />
              </Stack>
              {row.children}
            </Stack>
          ))}
        </Stack>
      )}
    </PanelSection>
  );
}

/** One line of a summary, with its sentiment dot. */
export interface CandidateSummaryBullet {
  text: ReactNode;
  sentiment: Sentiment;
  /**
   * The word a screen reader says for this line's dot, in place of the one
   * `labels.sentiment` gives its sentiment, such as the host's "Risk".
   */
  sentimentLabel?: string;
}

/** The word a screen reader says for each sentiment's dot. */
export type CandidateSentimentLabels = Record<Sentiment, string>;

export interface CandidateSummaryBulletsLabels {
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

const BULLET_LABELS: CandidateSummaryBulletsLabels = {
  generate: "Generate summary",
  refresh: "Refresh summary",
  generating: "Generating…",
  sentiment: {
    positive: "Positive",
    neutral: "Neutral",
    warning: "Caution",
    negative: "Negative",
  },
};

/** CandidateSummaryBullets' labels as a host gives them: any of them, and any sentiment's word. */
export type CandidateSummaryBulletsLabelOverrides = Partial<Omit<CandidateSummaryBulletsLabels, "sentiment">> & {
  sentiment?: Partial<CandidateSentimentLabels>;
};

export interface CandidateSummaryBulletsProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The lines to show; the host may fall back to other evidence when there is no summary. */
  bullets: readonly CandidateSummaryBullet[];
  /** Compact pipeline text by default; body uses the small body scale and inherits its surrounding text tone. */
  presentation?: "compact" | "body";
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
export function CandidateSummaryBullets({
  bullets,
  presentation = "compact",
  onGenerate,
  generating = false,
  generated = false,
  error,
  labels,
  ...props
}: CandidateSummaryBulletsProps) {
  const wording = {
    ...BULLET_LABELS,
    ...labels,
    sentiment: { ...BULLET_LABELS.sentiment, ...labels?.sentiment },
  };

  return (
    <Stack data-slot="candidate-summary-bullets" gap="none" {...props}>
      {bullets.length > 0 ? (
        <List spacing="normal" inset="xs">
          {bullets.map((bullet, index) => (
            <ListItem
              key={index}
              layout="row"
              textSize={presentation === "body" ? "sm" : "xs"}
              tone={presentation === "body" ? "inherit" : "soft"}
            >
              <SentimentDot sentiment={bullet.sentiment} />
              {/* Out of the row's flow, so the dot and text keep their layout. */}
              <span className="sr-only" data-slot="candidate-summary-bullet-sentiment">
                {`${bullet.sentimentLabel ?? wording.sentiment[bullet.sentiment]}: `}
              </span>
              <Text variant="inherit" as="span" grow>{bullet.text}</Text>
            </ListItem>
          ))}
        </List>
      ) : null}

      {onGenerate && (
        <Button
          type="button"
          variant="link-muted"
          size="bare"
          marginTop="xs"
          gap="xs"
          onClick={() => onGenerate()}
          disabled={generating}
        >
          {generating ? (
            <Icon icon={Loader2} size="xs" spin />
          ) : (
            <Icon icon={Sparkles} size="xs" />
          )}
          {generating ? wording.generating : generated ? wording.refresh : wording.generate}
        </Button>
      )}
      {present(error) && <Text variant="micro" tone="destructive" marginTop="tight">{error}</Text>}
    </Stack>
  );
}
