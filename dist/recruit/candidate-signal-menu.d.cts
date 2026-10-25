import * as react from 'react';
import { CandidateActionMenuItem } from './candidate-detail-layout.cjs';
import '@epicbagel/saas-kit/primitives/icon';

interface CandidateSignalMenuProps<TValue extends string = string> {
    /**
     * The menu items, in order, as for CandidateActionMenu (`{ id, label }`,
     * optionally an icon). The host decides which apply to this signal.
     */
    items: readonly CandidateActionMenuItem<TValue>[];
    /** Called with the chosen item's `id`. */
    onSelect?: (id: TValue) => void;
    /** Disables the trigger, for example while an earlier choice saves. */
    disabled?: boolean;
    /** The trigger's tooltip and accessible name. */
    label?: string;
}
/**
 * The "…" menu for a signal about a candidate: acting on it, snoozing it,
 * dismissing it, or whatever the host offers.
 *
 * It is `CandidateActionMenu` with a signal's defaults: the smaller glyph that
 * fits a card's eyebrow row, the "Signal actions" label, and clicks that
 * never reach the clickable card around it. The host owns the items, their
 * wording and what each one does. The menu surface is marked
 * `data-slot="candidate-action-menu"`.
 */
declare function CandidateSignalMenu<TValue extends string = string>({ items, onSelect, disabled, label, }: CandidateSignalMenuProps<TValue>): react.JSX.Element;

export { CandidateSignalMenu, type CandidateSignalMenuProps };
