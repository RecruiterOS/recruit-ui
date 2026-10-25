"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { CheckCircle } from "lucide-react";
import type { HTMLAttributes, Key, ReactNode } from "react";

import { CandidateCardRoot, candidateCardSelectProps } from "./candidate-card-activation";
import { CandidateCoverHeader } from "./candidate-cover-header";

/** One labelled fact in the card's three-column row. */
export interface CandidateRelationshipFact {
  /** Keys the fact; defaults to its position. */
  id?: Key;
  label: ReactNode;
  value: ReactNode;
  /** A muted line under the value. */
  detail?: ReactNode;
}

/** The newest signal about the person, already worded by the host. */
export interface CandidateRelationshipSignal {
  /** The section's eyebrow, such as "Signal". */
  label: ReactNode;
  /** What changed, in one line. */
  summary: ReactNode;
  /** A muted line counting the others, such as "+2 more signals". */
  more?: ReactNode;
  /** Controls on the eyebrow row, such as a CandidateSignalMenu. */
  actions?: ReactNode;
}

/** The roles suggested for the person, as one row that opens them. */
export interface CandidateRelationshipSuggestion {
  /** The row's eyebrow, such as "Suggested roles". */
  label: ReactNode;
  /** The first role, shown in a badge. */
  primary: ReactNode;
  /** The badge's tooltip. Defaults to `primary` when that is plain text. */
  primaryTitle?: string;
  /** The first role's grade, usually a CandidateGradeBadge. */
  grade?: ReactNode;
  /** A count badge for the other roles, such as { value: "+2", title: "2 more roles" }. */
  more?: { value: number | string; title?: string };
  /** Called when the row is activated. It never also selects the card. */
  onOpen: () => void;
}

/** The latest note about the person, at the foot of the card. */
export interface CandidateRelationshipNote {
  /** Who left it, or a generic heading such as "Recruiter note". */
  heading: ReactNode;
  /** When it was left, already formatted. */
  date?: ReactNode;
  /** The note itself, clamped to three lines. */
  text: ReactNode;
}

export interface CandidateRelationshipCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "onSelect" | "title" | "children"> {
  /** The person's name, a level-3 heading on one truncated line. */
  name: ReactNode;
  /** Avatar at the start of the header. */
  avatar?: ReactNode;
  /** Media for the 4:1 cover frame, softened until the card is hovered. Omit it and no frame is drawn. */
  cover?: ReactNode;
  /** Marks a verified contact with a check after the name. */
  verified?: boolean;
  /** The line under the name, usually the current title. */
  headline?: ReactNode;
  /** The current company, usually a CurrentCompanyPopover or CurrentCompanyLabel. */
  company?: ReactNode;
  /** Where they are, after the company. */
  location?: ReactNode;
  /** Controls at the end of the header, such as a favourite button and a profile link. */
  actions?: ReactNode;
  signal?: CandidateRelationshipSignal;
  /** Up to three facts, in a row that stacks on narrow screens. */
  facts: readonly CandidateRelationshipFact[];
  suggestion?: CandidateRelationshipSuggestion;
  note?: CandidateRelationshipNote;
  /** Selected treatment, and aria-current. */
  selected?: boolean;
  /** Called when the card is activated, but not from a click on a nested control. */
  onSelect: () => void;
}

function shown(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

function Fact({ label, value, detail }: CandidateRelationshipFact) {
  return (
    <Stack gap="xs" minWidth="zero">
      <Text size="xs" tone="muted" weight="medium" transform="uppercase">{label}</Text>
      <Text size="sm" weight="medium" lineClamp={2}>{value}</Text>
      {shown(detail) && <Text size="xs" tone="muted" lineClamp={2}>{detail}</Text>}
    </Stack>
  );
}

/**
 * A person in a relationship network: who they are and where they work, the
 * newest signal about them, three facts, the roles suggested for them and
 * the latest note, each section shown only when the host supplies it.
 *
 * The whole card is one kit InteractiveCard with button semantics that
 * selects the person, by click or with Enter or Space while the card has
 * focus. A click on a nested link or button never also selects it, Enter and
 * Space on a focused nested control activate that control alone, and the
 * suggestion row opens its roles instead. The host owns every value, its wording and its dates. The
 * root is marked `data-slot="candidate-relationship-card"`.
 */
export function CandidateRelationshipCard({
  name,
  avatar,
  cover,
  verified = false,
  headline,
  company,
  location,
  actions,
  signal,
  facts,
  suggestion,
  note,
  selected = false,
  onSelect,
  onKeyDown,
  ...props
}: CandidateRelationshipCardProps) {
  const primaryTitle = suggestion
    ? suggestion.primaryTitle ?? (typeof suggestion.primary === "string" ? suggestion.primary : undefined)
    : undefined;

  return (
    <InteractiveCard
      as={CandidateCardRoot}
      height="full"
      gap="none"
      selected={selected}
      clip
      data-slot="candidate-relationship-card"
      {...props}
      {...candidateCardSelectProps(onSelect, { onKeyDown })}
    >
      <CandidateCoverHeader cover={cover} padding="lg" softenCoverUntilHover>
        <Stack direction="horizontal" gap="md" align="start">
          {avatar}
          <FlexItem grow minWidth="zero">
            <Stack direction="horizontal" gap="xs" align="center">
              <Heading level={3} truncate>{name}</Heading>
              {verified && <Icon icon={CheckCircle} size="sm" tone="success" />}
            </Stack>
            {shown(headline) && (
              <Text size="sm" tone="muted" truncate>
                {headline}
              </Text>
            )}
            {(shown(company) || shown(location)) && (
              <Stack direction="horizontal" gap="xs" align="center" minWidth="zero">
                {company}
                {shown(location) && (
                  <Text variant="inherit" as="span" size="sm" tone="muted" truncate>
                    {shown(company) && "· "}{location}
                  </Text>
                )}
              </Stack>
            )}
          </FlexItem>
          {actions}
        </Stack>
      </CandidateCoverHeader>

      {signal && (
        <Stack border="top" gap="xs" paddingX="lg" paddingY="md" surface="muted">
          <Stack direction="horizontal" gap="sm" align="center" justify="between">
            <Text size="xs" tone="muted" weight="medium" transform="uppercase">{signal.label}</Text>
            {signal.actions}
          </Stack>
          <Text size="sm" weight="medium">{signal.summary}</Text>
          {shown(signal.more) && (
            <Text size="xs" tone="muted">{signal.more}</Text>
          )}
        </Stack>
      )}

      <Stack border="top" padding="lg">
        <Grid columns={3} gap="lg" responsive>
          {facts.map((fact, index) => (
            <Fact key={fact.id ?? index} label={fact.label} value={fact.value} detail={fact.detail} />
          ))}
        </Grid>
      </Stack>

      {suggestion && (
        <Button
          variant="ghost"
          size="bare"
          width="full"
          align="start"
          onClick={(event) => {
            event.stopPropagation();
            suggestion.onOpen();
          }}
        >
          <Stack border="top" direction="horizontal" gap="sm" align="center" padding="lg" wrap width="full">
            <Text size="xs" tone="muted" weight="medium" transform="uppercase">{suggestion.label}</Text>
            <Badge variant="secondary" size="compact" title={primaryTitle}>
              {suggestion.primary}
            </Badge>
            {suggestion.grade}
            {suggestion.more && (
              <CountBadge value={suggestion.more.value} variant="outline" title={suggestion.more.title} />
            )}
          </Stack>
        </Button>
      )}

      {note && (
        <Stack border="top" gap="sm" padding="lg" surface="muted">
          <Stack direction="horizontal" gap="sm" align="center" justify="between">
            <Text size="xs" tone="muted" weight="medium">{note.heading}</Text>
            {note.date}
          </Stack>
          <Text size="sm" whitespace="pre-wrap" lineClamp={3}>{note.text}</Text>
        </Stack>
      )}
    </InteractiveCard>
  );
}
