import * as react from 'react';
import { ElementType, HTMLAttributes } from 'react';

/** One way to reach a person, with the link the host built for it. */
interface CandidateChannel {
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
interface CandidateChannelActionsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
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
declare function CandidateChannelActions({ channels, presentation, size, label, ...props }: CandidateChannelActionsProps): react.JSX.Element | null;

export { type CandidateChannel, CandidateChannelActions, type CandidateChannelActionsProps };
