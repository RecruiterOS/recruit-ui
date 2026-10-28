"use client";

import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useId, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";

import { shouldActivateCandidateCard } from "./candidate-card-activation";
import { CandidateCoverHeader, type CandidateCoverImageSize } from "./candidate-cover-header";
import { COARSE_POINTER_TOUCH_TARGETS_WITHIN } from "./touch-targets";

export interface CandidateInlineCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick" | "title"> {
  name: ReactNode;
  avatar?: ReactNode;
  /** Optional host-owned media, in the shared 4:1 cover above the identity row. */
  cover?: ReactNode;
  /** `compact` caps the cover at 96px while retaining 4:1 on narrower cards. */
  coverSize?: CandidateCoverImageSize;
  headline?: ReactNode;
  /**
   * The caption line under the headline, such as a location. A leading glyph
   * (an `svg`, such as the kit's Icon, passed before the text) sits on the
   * text's line, centred on its capitals, with a small gap after it.
   */
  meta?: ReactNode;
  assessment?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  selected?: boolean;
  subdued?: boolean;
  onSelect?: () => void;
  selectLabel?: string;
  /**
   * `comfortable` (the default) gives the card room for an assessment;
   * `compact` is a single dense row (smaller padding, the name and lines
   * centred on the avatar, every line truncated) for fixed-height list rows
   * and board columns: give a card without a cover a height and its content
   * centres in it. A cover adds its natural height above the compact row.
   * On a coarse pointer (a touchscreen) every link and button in a compact
   * card's `actions` is at least 44px square, whatever size it asked for, so
   * a dense row keeps its touch targets on a phone.
   */
  density?: CandidateInlineCardDensity;
  /**
   * The name's size on a comfortable card. `default` suits a row among many;
   * `lg` sets it at the kit's section-title size, for a short list in which
   * each card stands on its own, such as the people shared with a client. A
   * compact card keeps its small name either way.
   */
  nameSize?: CandidateInlineCardNameSize;
  /**
   * On a comfortable card, `true` lets the headline wrap onto further lines
   * instead of ending in an ellipsis, so a long title and company still read
   * in full on a phone. A compact row always truncates, to keep its height.
   */
  headlineWrap?: boolean;
  /**
   * Where the `actions` sit across a comfortable card: `start` (the default)
   * level with the name, or `center`, centred on the card's height, for a
   * lone affordance such as a chevron. A compact row centres them already.
   */
  actionsAlign?: CandidateInlineCardActionsAlign;
}

/** How much room a CandidateInlineCard takes. */
export type CandidateInlineCardDensity = "comfortable" | "compact";

/** How large a CandidateInlineCard sets the name. */
export type CandidateInlineCardNameSize = "default" | "lg";

/** Where a CandidateInlineCard's actions sit across the card. */
export type CandidateInlineCardActionsAlign = "start" | "center";

/**
 * A glyph in the meta line stays on the text's line. The stylesheet reset
 * makes every `svg` a block, which would put it on a line of its own above
 * the text; inline, the line still wraps, and still truncates with an
 * ellipsis when compact, as plain text does. Centred on a capital for a
 * glyph as tall as the text; the gap matches the kit's icon-and-text rows.
 */
const META_LINE_GLYPHS =
  "[&>svg]:inline-block [&>svg]:align-[-0.125em] [&>svg]:me-1.5";

/**
 * A compact candidate trigger suitable for lists, messages, and previews.
 *
 * The root is the kit InteractiveCard as an `article`, marked
 * `data-slot="candidate-inline-card"` and `data-density`. The `actions` sit in
 * an element marked `data-slot="candidate-inline-card-actions"` that takes no
 * box of its own (`display: contents`), so they lay out as before. The
 * headline is marked `data-slot="candidate-inline-card-headline"` and the
 * meta line `data-slot="candidate-inline-card-meta"`.
 */
export function CandidateInlineCard({
  name,
  avatar,
  cover,
  coverSize = "default",
  headline,
  meta,
  assessment,
  status,
  actions,
  selected = false,
  subdued = false,
  onSelect,
  selectLabel = "Open candidate profile",
  density = "comfortable",
  nameSize = "default",
  headlineWrap = false,
  actionsAlign = "start",
  "aria-expanded": ariaExpanded,
  className,
  ...props
}: CandidateInlineCardProps) {
  const generatedId = useId();
  const nameId = `${generatedId}-name`;
  const actionId = `${generatedId}-action`;
  const compact = density === "compact";
  const centreActions = !compact && actionsAlign === "center";
  const hasCover = cover != null;
  const handleSelect = onSelect
    ? (event: MouseEvent<HTMLDivElement>) => {
        if (!event.defaultPrevented && shouldActivateCandidateCard(event)) onSelect();
      }
    : undefined;
  const content = (
    <div
      data-slot="candidate-inline-card-content"
      // Only a card without a cover fills a fixed-height row; a cover adds its own height.
      className={compact ? (hasCover ? "px-3 py-2" : "h-full px-3 py-2") : "px-5 py-4"}
      onClick={hasCover ? undefined : handleSelect}
    >
      <Stack
        direction="horizontal"
        gap={compact ? "sm" : "compact"}
        align={compact ? "center" : "start"}
        height={compact && !hasCover ? "full" : "auto"}
      >
        {avatar}
        <FlexItem grow minWidth="zero">
          <Stack direction="horizontal" gap="sm" align="center" wrap={!compact}>
            <Heading
              id={nameId}
              level={5}
              appearance={compact ? "compact" : nameSize === "lg" ? "section" : "default"}
              truncate
            >
              {name}
            </Heading>
            {status}
          </Stack>
          {headline != null ? (
            // A compact row is a fixed height: the caption's relaxed leading would push the lines apart.
            <Text
              data-slot="candidate-inline-card-headline"
              variant="caption"
              size={compact ? "xs" : "sm"}
              leading={compact ? "snug" : "normal"}
              truncate={compact || !headlineWrap}
              marginTop={compact ? "none" : "tight"}
            >
              {headline}
            </Text>
          ) : null}
          {meta != null ? (
            <Text
              data-slot="candidate-inline-card-meta"
              variant="caption"
              size="xs"
              leading={compact ? "snug" : "normal"}
              truncate={compact}
              marginTop={compact ? "none" : "xs"}
              className={META_LINE_GLYPHS}
            >
              {meta}
            </Text>
          ) : null}
          {assessment != null ? (
            <Stack gap="none" marginTop={compact ? "sm" : "md"}>{assessment}</Stack>
          ) : null}
        </FlexItem>
        {actions != null ? (
          // No box of its own, so the actions stay items of the row; it
          // only carries a compact row's touch targets, or the centring, to
          // its controls.
          <div
            data-slot="candidate-inline-card-actions"
            className={
              compact
                ? `contents ${COARSE_POINTER_TOUCH_TARGETS_WITHIN}`
                : centreActions ? "contents [&>*]:self-center" : "contents"
            }
          >
            {actions}
          </div>
        ) : null}
      </Stack>
    </div>
  );

  return (
    <InteractiveCard
      as="article"
      data-slot="candidate-inline-card"
      data-density={density}
      selected={selected}
      borderWidth="thin"
      padding="none"
      opacity={subdued ? "subdued" : "full"}
      className={className}
      {...props}
    >
      {onSelect ? (
        <button
          type="button"
          data-slot="candidate-inline-card-trigger"
          aria-label={selectLabel === "Open candidate profile" ? undefined : selectLabel}
          aria-labelledby={selectLabel === "Open candidate profile" ? `${actionId} ${nameId}` : undefined}
          aria-current={selected || undefined}
          aria-expanded={ariaExpanded}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onSelect}
        >
          {selectLabel === "Open candidate profile" ? (
            <span id={actionId} className="sr-only">{selectLabel}</span>
          ) : null}
        </button>
      ) : null}
      {hasCover ? (
        <CandidateCoverHeader
          cover={cover}
          coverSize={coverSize}
          padding="none"
          className="rounded-[inherit]"
          onClick={handleSelect}
        >
          {content}
        </CandidateCoverHeader>
      ) : content}
    </InteractiveCard>
  );
}
