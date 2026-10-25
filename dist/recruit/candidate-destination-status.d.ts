import * as react from 'react';
import { ReactNode } from 'react';
import { ConnectionStatusBarAction, ConnectionStatusBarFact, ConnectionStatusBarState } from '@epicbagel/saas-kit/primitives/connection-status-bar';

type CandidateDestinationActionBase = Omit<ConnectionStatusBarAction, "ariaLabel" | "iconOnly">;
/** Icon-only actions must always supply the accessible name hidden visually. */
type CandidateDestinationAction = (CandidateDestinationActionBase & {
    iconOnly: true;
    ariaLabel: string;
}) | (CandidateDestinationActionBase & {
    iconOnly?: false;
    ariaLabel?: string;
});
type CandidateDestinationFact = ConnectionStatusBarFact;
type CandidateDestinationState = ConnectionStatusBarState;
interface CandidateDestinationStatusProps {
    state: CandidateDestinationState;
    name: ReactNode;
    description?: ReactNode;
    facts?: readonly CandidateDestinationFact[];
    actions?: readonly CandidateDestinationAction[];
    progress?: number;
    progressLabel?: string;
    details?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}
/** Caller-mapped destination state using the canonical core status surface. */
declare function CandidateDestinationStatus({ state, name, description, facts, actions, progress, progressLabel, details, open, defaultOpen, onOpenChange, className, }: CandidateDestinationStatusProps): react.JSX.Element;

export { type CandidateDestinationAction, type CandidateDestinationFact, type CandidateDestinationState, CandidateDestinationStatus, type CandidateDestinationStatusProps };
