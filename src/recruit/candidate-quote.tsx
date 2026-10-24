import { FlexItem } from "@/components/recruit-ui/core/primitives/flex-item";
import { PanelSection } from "@/components/recruit-ui/core/primitives/panel-section";
import { Stack } from "@/components/recruit-ui/core/primitives/stack";
import { Text } from "@/components/recruit-ui/core/primitives/text";
import type { BlockquoteHTMLAttributes, ReactNode } from "react";

export interface CandidateQuoteProps
  extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children: ReactNode;
  attribution?: ReactNode;
  action?: ReactNode;
  lineClamp?: 1 | 2 | 3;
}

/** A quiet excerpt whose hierarchy comes from whitespace, never a nested card. */
export function CandidateQuote({
  children,
  attribution,
  action,
  lineClamp,
  ...props
}: CandidateQuoteProps) {
  return (
    <PanelSection
      as="blockquote"
      data-slot="candidate-quote"
      padding="default"
      {...props}
    >
      <Text as="div" variant="muted" size="sm" italic lineClamp={lineClamp}>
        <span aria-hidden>&ldquo;</span>
        {children}
        <span aria-hidden>&rdquo;</span>
      </Text>
      {attribution != null || action != null ? (
        <Stack direction="horizontal" gap="compact" align="center" marginTop="sm">
          <FlexItem grow minWidth="zero">
            {attribution != null ? (
              <Text as="span" variant="caption" size="xs" tone="subtle">
                <span aria-hidden>— </span>
                {attribution}
              </Text>
            ) : null}
          </FlexItem>
          {action}
        </Stack>
      ) : null}
    </PanelSection>
  );
}
