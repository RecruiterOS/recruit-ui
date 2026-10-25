"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CountBadge } from "@epicbagel/saas-kit/primitives/count-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@epicbagel/saas-kit/primitives/dropdown-menu";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon, type IconProps } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Tabs, TabsList, TabsTrigger } from "@epicbagel/saas-kit/primitives/tabs";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Loader2, MoreHorizontal, ShieldCheck, X } from "lucide-react";
import type { ElementType, HTMLAttributes, Key, MouseEvent, ReactNode } from "react";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

export interface CandidateDetailLayoutProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The fixed header, usually a CandidateDetailHeader. */
  header: ReactNode;
  /** A message between the header and the tabs, such as a failed refresh. */
  alert?: ReactNode;
  /** The fixed tab strip, usually CandidateDetailTabs. */
  tabs: ReactNode;
  /** The active tab's sections. This is the only part that scrolls. */
  children?: ReactNode;
  /** A fixed bar under the body, such as the action bar for the role in focus. */
  footer?: ReactNode;
}

/**
 * The frame of a person's detail pane: a fixed header, an optional alert, a
 * fixed tab strip, a body that grows and scrolls on its own, and an optional
 * fixed footer. It fills its container's height and clips it, so put it in a
 * dialog, drawer or side panel with a definite height.
 *
 * The root is marked `data-slot="candidate-detail-layout"`.
 */
export function CandidateDetailLayout({
  header,
  alert,
  tabs,
  children,
  footer,
  ...props
}: CandidateDetailLayoutProps) {
  return (
    <Stack
      data-slot="candidate-detail-layout"
      direction="vertical"
      gap="none"
      height="full"
      overflow="hidden"
      {...props}
    >
      {header}
      {alert}
      {tabs}
      <FlexItem grow overflow="y-auto">
        {children}
      </FlexItem>
      {footer}
    </Stack>
  );
}

/** A verified badge beside the person's name. */
export interface CandidateDetailVerified {
  /** The badge text, such as "verified". */
  label: ReactNode;
  /** The badge tooltip, such as what was verified and by whom. */
  title?: string;
}

export interface CandidateDetailHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The avatar at the start, such as the kit's PersonAvatar at 56px. */
  avatar: ReactNode;
  /** The person's name, the pane's level-3 heading. */
  name: ReactNode;
  /** Shows a success badge with a shield after the name. */
  verified?: CandidateDetailVerified;
  /** When it was verified, already formatted. Shown only with `verified`. */
  verifiedAt?: ReactNode;
  /** The line under the name, such as the current title and company. */
  headline?: ReactNode;
  /** A quieter line under that, such as where the person came from. */
  provenance?: ReactNode;
  /** Controls before the close button, such as a favourite toggle and a CandidateActionMenu. */
  actions?: ReactNode;
  /** Closes the pane. */
  onClose: () => void;
  /** The close button's accessible name. */
  closeLabel?: string;
}

/**
 * The header of a person's detail pane: avatar, name with an optional
 * verified badge, a headline and a provenance line, then the host's actions
 * and a close button. The name and both lines truncate rather than wrap.
 *
 * The root is marked `data-slot="candidate-detail-header"`.
 */
export function CandidateDetailHeader({
  avatar,
  name,
  verified,
  verifiedAt,
  headline,
  provenance,
  actions,
  onClose,
  closeLabel = "Close",
  ...props
}: CandidateDetailHeaderProps) {
  return (
    <Stack
      data-slot="candidate-detail-header"
      direction="horizontal"
      gap="md"
      align="start"
      padding="lg"
      border="bottom"
      {...props}
    >
      {avatar}
      <FlexItem grow minWidth="zero">
        <Stack direction="horizontal" gap="xs" align="center" wrap>
          <Heading level={3} truncate>{name}</Heading>
          {verified && (
            <Badge
              as="span"
              variant="success"
              size="micro-compact"
              gap="xs"
              weight="semibold"
              title={verified.title}
            >
              <Icon icon={ShieldCheck} size="xs" />
              {verified.label}
            </Badge>
          )}
          {verified && present(verifiedAt) && (
            <Text variant="inherit" as="span" size="xs" tone="subtle">
              {verifiedAt}
            </Text>
          )}
        </Stack>
        {present(headline) && (
          <Text as="div" size="sm" tone="muted" truncate marginTop="tight">
            {headline}
          </Text>
        )}
        {present(provenance) && (
          <Text size="xs" tone="subtle" truncate marginTop="xs">
            {provenance}
          </Text>
        )}
      </FlexItem>
      <Stack direction="horizontal" gap="xs" align="center" shrink={false}>
        {actions}
        <Button variant="ghost" size="icon-sm" aria-label={closeLabel} onClick={() => onClose()}>
          <Icon icon={X} size="md" />
        </Button>
      </Stack>
    </Stack>
  );
}

/** One item in a CandidateActionMenu. */
export interface CandidateActionMenuItem<TId extends Key = Key> {
  /** Identifies the item, and is what the menu's `onSelect` receives. */
  id: TId;
  label: ReactNode;
  /** The glyph, as a component reference such as a lucide icon. Leave it out for a text-only item. */
  icon?: ElementType;
  /** Called when the item is chosen, by pointer or keyboard, before the menu's `onSelect`. */
  onSelect?: () => void;
  disabled?: boolean;
  /** The icon's colour, for example `warning` while an item undoes a state. */
  tone?: IconProps["tone"];
}

export interface CandidateActionMenuProps<TId extends Key = Key> {
  /** The items, in order. The host decides which apply. */
  items: readonly CandidateActionMenuItem<TId>[];
  /** Called with the chosen item's `id`, after the item's own `onSelect`. */
  onSelect?: (id: TId) => void;
  /** Shows a spinner in place of the trigger's glyph while an action runs. */
  busy?: boolean;
  /** Disables the trigger, for example while an earlier choice saves. */
  disabled?: boolean;
  /** The trigger's tooltip and accessible name. */
  label?: string;
  /**
   * The trigger's button variant: `ghost` (default) in a header, `quiet`
   * beside a card's other quiet actions.
   */
  variant?: "ghost" | "quiet";
  /** The trigger's glyph size: `md` (default), or `sm` on a compact card row. */
  triggerIconSize?: "sm" | "md";
  /** The items' glyph size: `md` (default), or `sm` to match small buttons. */
  itemIconSize?: "sm" | "md";
  /**
   * Stops a click on the trigger or in the menu from reaching a surrounding
   * clickable card. The menu renders in a portal, but React still bubbles
   * its clicks through the card.
   */
  isolateClicks?: boolean;
}

/**
 * The "…" menu: secondary actions for a person or one of their signals, so
 * a detail header or a card's row stays uncluttered on narrow screens. The
 * host owns the items and what each one does: give an item its own
 * `onSelect`, or handle every item in the menu's `onSelect(id)`.
 * `CandidateSignalMenu` is this menu with a signal's defaults. The menu
 * surface is marked `data-slot="candidate-action-menu"`.
 */
export function CandidateActionMenu<TId extends Key = Key>({
  items,
  onSelect,
  busy = false,
  disabled,
  label = "More actions",
  variant = "ghost",
  triggerIconSize = "md",
  itemIconSize = "md",
  isolateClicks = false,
}: CandidateActionMenuProps<TId>) {
  const isolate = isolateClicks
    ? (event: MouseEvent<HTMLElement>) => event.stopPropagation()
    : undefined;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon-sm" disabled={disabled} title={label} onClick={isolate}>
          {busy ? (
            <Icon icon={Loader2} size={triggerIconSize} spin />
          ) : (
            <Icon icon={MoreHorizontal} size={triggerIconSize} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-slot="candidate-action-menu" onClick={isolate}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              item.onSelect?.();
              onSelect?.(item.id);
            }}
            disabled={item.disabled}
          >
            {item.icon && <Icon icon={item.icon} size={itemIconSize} tone={item.tone} />}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** One tab in a CandidateDetailTabs strip. */
export interface CandidateDetailTabItem<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
  /** Something waiting on the tab, shown as a count badge when above zero. */
  count?: number;
}

export interface CandidateDetailTabsProps<TValue extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "defaultValue" | "dir"> {
  /** The tabs, in order. */
  tabs: readonly CandidateDetailTabItem<TValue>[];
  /** The active tab. */
  value: TValue;
  /** Called with the tab a person picks. */
  onChange: (value: TValue) => void;
}

/**
 * The tab strip of a person's detail pane, full width and scrolling sideways
 * on a phone. A tab's count shows in the kit's count badge, which is
 * destructive-toned because it marks something to act on, and only when
 * above zero. The host renders the active tab's content.
 *
 * The root is marked `data-slot="candidate-detail-tabs"`.
 */
export function CandidateDetailTabs<TValue extends string = string>({
  tabs,
  value,
  onChange,
  ...props
}: CandidateDetailTabsProps<TValue>) {
  return (
    <Tabs
      data-slot="candidate-detail-tabs"
      value={value}
      onValueChange={(next) => onChange(next as TValue)}
      {...props}
    >
      <TabsList width="full" scrollable marginBottom="none">
        {tabs.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
            {item.count != null && item.count > 0 && <CountBadge value={item.count} />}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
