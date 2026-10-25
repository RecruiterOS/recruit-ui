import * as react from 'react';
import { ReactNode } from 'react';

/** One way of reaching a candidate, such as email or phone. */
interface CandidateContactChannelOption {
    id: string;
    label: ReactNode;
}
/** Host-owned wording for the trigger and the remove items. */
interface CandidateContactChannelsMenuLabels {
    trigger: ReactNode;
    /** The trigger's text when `compact`. */
    compactTrigger: ReactNode;
    /** Tooltip on the trigger. */
    triggerTitle: string;
    /** The item that clears a channel recorded by mistake. */
    remove: (option: CandidateContactChannelOption) => ReactNode;
}
interface CandidateContactChannelsMenuProps {
    /** The channels, in menu order. */
    options: readonly CandidateContactChannelOption[];
    /**
     * The channels already used, by option id, each with what to show beside it
     * (usually how recently). An id that is absent, null, undefined or false
     * has not been used.
     */
    touched: Readonly<Record<string, ReactNode>>;
    /** Called when a channel is picked; picking a used channel again refreshes it. */
    onTouch: (id: string) => void;
    /** Called from the remove items. */
    onRemove: (id: string) => void;
    /** A shorter trigger for tight action rows. */
    compact?: boolean;
    labels?: Partial<CandidateContactChannelsMenuLabels>;
}
/**
 * Records how a candidate was contacted. Each pick records or refreshes a
 * channel and the menu stays open, so ticking two is one visit; used channels
 * show the host's recency text and can be removed.
 *
 * Every click stops propagating, because the menu often sits inside a
 * clickable candidate card and React events bubble through portals along the
 * component tree. The host owns the channels, timestamps, recency wording and
 * anything a first contact should change.
 */
declare function CandidateContactChannelsMenu({ options, touched, onTouch, onRemove, compact, labels, }: CandidateContactChannelsMenuProps): react.JSX.Element;

export { type CandidateContactChannelOption, CandidateContactChannelsMenu, type CandidateContactChannelsMenuLabels, type CandidateContactChannelsMenuProps };
