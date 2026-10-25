"use client";

import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { ElementType, HTMLAttributes, MouseEvent } from "react";

import { COARSE_POINTER_TOUCH_TARGET } from "./touch-targets";

/** One way to reach a person, with the link the host built for it. */
export interface CandidateChannel {
  /** What the channel is, such as `email`, `phone` or `profile`. Marks the action `data-channel`; two channels may share one. */
  kind: string;
  /** Where the action goes: a `mailto:` or `tel:` link, or a web address. */
  href: string;
  /** The visible label in a bar; the tooltip and accessible name of an icon, such as "Email Mei Example". */
  label: string;
  /** The glyph, as a component reference such as a lucide icon. */
  icon: ElementType;
  /** Opens in a new tab. Defaults to true for an `http(s)` link and false otherwise. */
  external?: boolean;
}

export interface CandidateChannelActionsProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The channels, in order. Leave out any the host has no address for. */
  channels: readonly CandidateChannel[];
  /**
   * `icons`: a row of round icon links. `bar`: labelled links that share a
   * row equally, for an action bar; a link too narrow for its label (five
   * channels on a phone) shows the glyph alone, still named by the label.
   */
  presentation?: "icons" | "bar";
  /**
   * Icon size: `default` keeps the kit's 44px touch target, `compact` suits a
   * dense card row. On a coarse pointer (a touchscreen) every link is at
   * least 44px square at either size, so a phone keeps the touch target.
   */
  size?: "default" | "compact";
  /** The group's accessible name, such as "Contact Mei Example". */
  label?: string;
}

const isWebLink = (href: string) => /^https?:\/\//i.test(href);

// Shown from 4.5rem of room inside the link: the glyph, its gap and about six
// characters. Below that the link is the glyph alone.
const BAR_LABEL_VISIBILITY = "hidden @min-[4.5rem]:inline";

/**
 * The ways to reach a person (email, call, message, an external profile) as
 * plain links: round icon buttons, or a labelled bar whose links share the
 * row in equal parts. A bar link narrower than a short label (a container
 * query on the link) drops to its glyph, so a phone shows a row of icons
 * rather than one letter and an ellipsis each. The host builds each link,
 * so the package knows no address scheme or network; a web link opens in a
 * new tab.
 *
 * Every link is at least 44px square on a coarse pointer (a touchscreen): a
 * bar link at any width, an icon at either size, even where the kit scales
 * its rem sizes down on a narrow screen.
 *
 * Clicks never reach a surrounding clickable card. The root is marked
 * `data-slot="candidate-channel-actions"` and is a labelled group; each link
 * is the kit Button, keeping its own `data-slot="button"`, with
 * `data-channel` set to the channel's `kind`. With no channels it renders
 * nothing.
 */
export function CandidateChannelActions({
  channels,
  presentation = "icons",
  size = "default",
  label = "Contact",
  ...props
}: CandidateChannelActionsProps) {
  if (channels.length === 0) return null;
  const bar = presentation === "bar";

  return (
    <Stack
      data-slot="candidate-channel-actions"
      data-presentation={presentation}
      role="group"
      aria-label={label}
      direction="horizontal"
      gap={bar ? "sm" : "xs"}
      align="center"
      justify={bar ? "center" : "start"}
      width={bar ? "full" : "auto"}
      {...props}
    >
      {channels.map((channel, index) => {
        // Two channels can share a kind (two phone numbers), so the position keys them.
        const key = `${index}:${channel.kind}`;
        const external = channel.external ?? isWebLink(channel.href);
        const link = (
          <Anchor
            href={channel.href}
            data-channel={channel.kind}
            title={channel.label}
            // The name in both forms: a bar link can hide its text when narrow.
            aria-label={channel.label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
          >
            <Icon icon={channel.icon} size="md" />
            {bar ? (
              <Text
                variant="inherit"
                as="span"
                truncate
                minWidth="zero"
                className={BAR_LABEL_VISIBILITY}
              >
                {channel.label}
              </Text>
            ) : null}
          </Anchor>
        );
        return bar ? (
          // A size container, so its label can query the link's own width;
          // that also makes the links share the row equally.
          <Button
            key={key}
            asChild
            variant="outline"
            size="sm"
            grow
            minWidth="zero"
            className={`@container ${COARSE_POINTER_TOUCH_TARGET}`}
          >
            {link}
          </Button>
        ) : (
          <Button
            key={key}
            asChild
            variant="outline"
            shape="circle"
            size={size === "compact" ? "icon-compact" : "icon-sm"}
            shrink
            className={COARSE_POINTER_TOUCH_TARGET}
          >
            {link}
          </Button>
        );
      })}
    </Stack>
  );
}
