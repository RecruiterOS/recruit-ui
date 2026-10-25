"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState, type BlockquoteHTMLAttributes, type MouseEvent, type ReactNode } from "react";

/** Clamps a long excerpt behind a show-more toggle on the attribution line. */
export interface CandidateQuoteCollapsible {
  /** Lines shown while collapsed. */
  lines: 1 | 2 | 3;
  /**
   * Offer the toggle only when the excerpt is longer than this many
   * characters. It applies to a plain-string excerpt; any other excerpt
   * always gets the toggle.
   */
  threshold?: number;
  moreLabel: ReactNode;
  lessLabel: ReactNode;
}

export interface CandidateQuoteProps
  extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children: ReactNode;
  attribution?: ReactNode;
  action?: ReactNode;
  /** Clamp the excerpt to this many lines. `collapsible` replaces it. */
  lineClamp?: 1 | 2 | 3;
  collapsible?: CandidateQuoteCollapsible;
}

/** A quiet excerpt whose hierarchy comes from whitespace, never a nested card. */
export function CandidateQuote({
  children,
  attribution,
  action,
  lineClamp,
  collapsible,
  ...props
}: CandidateQuoteProps) {
  const [expanded, setExpanded] = useState(false);
  const canExpand =
    collapsible?.threshold == null ||
    typeof children !== "string" ||
    children.length > collapsible.threshold;
  const clamp = collapsible ? (expanded ? undefined : collapsible.lines) : lineClamp;
  const toggle = collapsible != null && canExpand ? (
    <Button
      type="button"
      variant="link"
      size="bare"
      shrink
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        // The quote often sits inside a clickable candidate card.
        event.stopPropagation();
        setExpanded((value) => !value);
      }}
    >
      {expanded ? collapsible.lessLabel : collapsible.moreLabel}
    </Button>
  ) : null;
  const actions = action != null && toggle != null ? <>{action}{toggle}</> : action ?? toggle;

  return (
    <PanelSection
      as="blockquote"
      data-slot="candidate-quote"
      padding="default"
      {...props}
    >
      <Text as="div" variant="muted" size="sm" italic lineClamp={clamp}>
        <span aria-hidden>&ldquo;</span>
        {children}
        <span aria-hidden>&rdquo;</span>
      </Text>
      {attribution != null || actions != null ? (
        <Stack direction="horizontal" gap="compact" align="center" marginTop="sm">
          <FlexItem grow minWidth="zero">
            {attribution != null ? (
              <Text as="span" variant="caption" size="xs" tone="subtle">
                <span aria-hidden>— </span>
                {attribution}
              </Text>
            ) : null}
          </FlexItem>
          {actions}
        </Stack>
      ) : null}
    </PanelSection>
  );
}
