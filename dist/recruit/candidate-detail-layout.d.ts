import * as react from 'react';
import { Key, ReactNode, ElementType, HTMLAttributes } from 'react';
import { IconProps } from '@epicbagel/saas-kit/primitives/icon';

interface CandidateDetailLayoutProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
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
declare function CandidateDetailLayout({ header, alert, tabs, children, footer, ...props }: CandidateDetailLayoutProps): react.JSX.Element;
/** A verified badge beside the person's name. */
interface CandidateDetailVerified {
    /** The badge text, such as "verified". */
    label: ReactNode;
    /** The badge tooltip, such as what was verified and by whom. */
    title?: string;
}
interface CandidateDetailHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
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
declare function CandidateDetailHeader({ avatar, name, verified, verifiedAt, headline, provenance, actions, onClose, closeLabel, ...props }: CandidateDetailHeaderProps): react.JSX.Element;
/** One item in a CandidateActionMenu. */
interface CandidateActionMenuItem<TId extends Key = Key> {
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
interface CandidateActionMenuProps<TId extends Key = Key> {
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
declare function CandidateActionMenu<TId extends Key = Key>({ items, onSelect, busy, disabled, label, variant, triggerIconSize, itemIconSize, isolateClicks, }: CandidateActionMenuProps<TId>): react.JSX.Element;
/** One tab in a CandidateDetailTabs strip. */
interface CandidateDetailTabItem<TValue extends string = string> {
    value: TValue;
    label: ReactNode;
    /** Something waiting on the tab, shown as a count badge when above zero. */
    count?: number;
}
interface CandidateDetailTabsProps<TValue extends string = string> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "defaultValue" | "dir"> {
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
declare function CandidateDetailTabs<TValue extends string = string>({ tabs, value, onChange, ...props }: CandidateDetailTabsProps<TValue>): react.JSX.Element;

export { CandidateActionMenu, type CandidateActionMenuItem, type CandidateActionMenuProps, CandidateDetailHeader, type CandidateDetailHeaderProps, CandidateDetailLayout, type CandidateDetailLayoutProps, type CandidateDetailTabItem, CandidateDetailTabs, type CandidateDetailTabsProps, type CandidateDetailVerified };
