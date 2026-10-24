import * as react from 'react';
import { ElementType, ReactNode, HTMLAttributeAnchorTarget } from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';

declare const badgeVariants: (props?: ({
    variant?: "default" | "error" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "neutral" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    weight?: "normal" | "semibold" | "bold";
    gap?: "none" | "xs";
    size?: "default" | "compact" | "micro" | "micro-compact" | "tiny" | "counter" | "tile" | "rule";
    padding?: "default" | "roomy";
    shrink?: boolean;
    interactive?: boolean;
    marginStart?: "none" | "md";
    transform?: "none" | "uppercase";
    shape?: "pill" | "rounded";
    marginTop?: "none" | "tight";
    as?: ElementType;
    font?: "sans" | "mono";
    titleCase?: "preserve" | "capitalize";
}
type BadgeVariant = NonNullable<BadgeProps["variant"]>;

type ConnectionStatusBarState = "disconnected" | "syncing" | "connected" | "error";
interface ConnectionStatusBarAction {
    label: ReactNode;
    ariaLabel?: string;
    onClick?: () => void;
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    external?: boolean;
    iconOnly?: boolean;
    disabled?: boolean;
}
interface ConnectionStatusBarFact {
    label: ReactNode;
    variant?: BadgeVariant;
}

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
