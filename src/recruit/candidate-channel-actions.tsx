"use client";

import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { ElementType, HTMLAttributes, MouseEvent } from "react";

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
  /** `icons`: a row of round icon links. `bar`: labelled links that share a row, for an action bar. */
  presentation?: "icons" | "bar";
  /** Icon size: `default` keeps the kit's 44px touch target, `compact` suits a dense card row. */
  size?: "default" | "compact";
  /** The group's accessible name, such as "Contact Mei Example". */
  label?: string;
}

const isWebLink = (href: string) => /^https?:\/\//i.test(href);

/**
 * The ways to reach a person (email, call, message, an external profile) as
 * plain links: round icon buttons, or a labelled bar whose links share the
 * row on a phone. The host builds each link, so the package knows no
 * address scheme or network; a web link opens in a new tab.
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
            aria-label={bar ? undefined : channel.label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}
          >
            <Icon icon={channel.icon} size="md" />
            {bar ? (
              <Text variant="inherit" as="span" truncate minWidth="zero">
                {channel.label}
              </Text>
            ) : null}
          </Anchor>
        );
        return bar ? (
          <Button key={key} asChild variant="outline" size="sm" grow minWidth="zero">
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
          >
            {link}
          </Button>
        );
      })}
    </Stack>
  );
}
