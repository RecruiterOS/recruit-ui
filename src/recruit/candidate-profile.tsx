import { cn } from "@epicbagel/saas-kit/lib/utils";
import { ContactHeader } from "@epicbagel/saas-kit/primitives/contact-header";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

import { CandidateCoverHeader, type CandidateCoverHeaderPadding } from "./candidate-cover-header";

export interface CandidateProfileProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * `default` prints the card as it looks on screen. `flat` prints it without
   * its border (or a shadow a host gave it), so a printed profile reads as a
   * page rather than a card on one.
   */
  printMode?: CandidateProfilePrintMode;
}

/** How a CandidateProfile prints. */
export type CandidateProfilePrintMode = "default" | "flat";

/** Structural profile composition. Data loading and record policy stay outside. */
export function CandidateProfile({
  header,
  children,
  footer,
  printMode = "default",
  className,
  ...props
}: CandidateProfileProps) {
  return (
    <Stack
      as="article"
      data-slot="candidate-profile"
      gap="none"
      surface="card"
      radius="xl"
      overflow="hidden"
      className={cn(printMode === "flat" && "print:border-0 print:shadow-none", className)}
      {...props}
    >
      {header}
      {children}
      {footer}
    </Stack>
  );
}

export interface CandidateProfileHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  name: ReactNode;
  avatar?: ReactNode;
  cover?: ReactNode;
  eyebrow?: ReactNode;
  status?: ReactNode;
  meta?: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  /**
   * Where `actions` sit. `name` (the default) puts them on the name line, at
   * its end, with the meta running under them. `aside` gives them a column
   * of their own beside the whole identity, top-aligned, so a control taller
   * than the name's line doesn't push the meta away from the name.
   */
  actionsPlacement?: CandidateProfileHeaderActionsPlacement;
  /**
   * `lg` (the default) pads the header like a card's. `dialog` pads it like
   * the kit's dialog header, so as a CandidateProfileDialog's `header` the
   * name starts at the body's left edge, in line with what the body holds.
   * `none` sits it flush in a container the host already pads, such as a
   * drawer body.
   */
  padding?: Extract<CandidateCoverHeaderPadding, "lg" | "dialog" | "none">;
}

/** Where a CandidateProfileHeader puts its actions. */
export type CandidateProfileHeaderActionsPlacement = "name" | "aside";

export function CandidateProfileHeader({
  name,
  avatar,
  cover,
  eyebrow,
  status,
  meta,
  summary,
  actions,
  actionsPlacement = "name",
  padding = "lg",
  className,
  ...props
}: CandidateProfileHeaderProps) {
  const aside = actionsPlacement === "aside" && actions != null;
  const identity = (
    <ContactHeader
      avatar={avatar}
      name={name}
      status={status}
      meta={meta}
      actions={aside ? undefined : actions}
      spacing="none"
    />
  );

  return (
    <CandidateCoverHeader
      cover={cover}
      padding={padding}
      data-slot="candidate-profile-header"
      className={className}
      {...props}
    >
      <Stack gap="sm">
        {eyebrow != null ? (
          <Text variant="eyebrow">{eyebrow}</Text>
        ) : null}
        {aside ? (
          <Stack direction="horizontal" gap="sm" align="start">
            <FlexItem grow minWidth="zero">
              {identity}
            </FlexItem>
            {/* An action cluster like the kit ContactHeader's, beside the
                identity: a row that keeps its width, at the kit's nearest gap. */}
            <Stack
              data-slot="candidate-profile-header-actions"
              direction="horizontal"
              gap="xs"
              align="center"
              shrink={false}
            >
              {actions}
            </Stack>
          </Stack>
        ) : (
          identity
        )}
        {summary != null ? (
          <Text variant="muted" size="sm">
            {summary}
          </Text>
        ) : null}
      </Stack>
    </CandidateCoverHeader>
  );
}

export interface CandidateProfileBodyProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  divided?: boolean;
}

export function CandidateProfileBody({
  children,
  divided = false,
  className,
  ...props
}: CandidateProfileBodyProps) {
  return (
    <PanelSection
      as="div"
      data-slot="candidate-profile-body"
      border="top"
      className={cn(divided && "divide-y", className)}
      {...props}
    >
      {children}
    </PanelSection>
  );
}

export interface CandidateProfileFooterProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Where the row's content sits along it. `start` by default. */
  justify?: CandidateProfileFooterJustify;
  /**
   * The kit PanelSection's padding: `default` (26px) for a row of actions,
   * `compact` for a single line such as a credit.
   */
  padding?: CandidateProfileFooterPadding;
  /** `hidden` leaves the footer off a printed profile. */
  printVisibility?: CandidateProfileFooterPrintVisibility;
}

/** Where a CandidateProfileFooter puts its content along the row. */
export type CandidateProfileFooterJustify = "start" | "center" | "end" | "between";
/** The space inside a CandidateProfileFooter. */
export type CandidateProfileFooterPadding = "default" | "compact";
/** Whether a CandidateProfileFooter prints. */
export type CandidateProfileFooterPrintVisibility = "visible" | "hidden";

// `start` is a flex row's own default, so it adds nothing.
const FOOTER_JUSTIFY: Record<CandidateProfileFooterJustify, string> = {
  start: "",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export function CandidateProfileFooter({
  children,
  justify = "start",
  padding = "default",
  printVisibility = "visible",
  className,
  ...props
}: CandidateProfileFooterProps) {
  return (
    <PanelSection
      as="footer"
      data-slot="candidate-profile-footer"
      border="top"
      layout="row"
      gap="sm"
      padding={padding}
      className={cn(
        FOOTER_JUSTIFY[justify],
        printVisibility === "hidden" && "print:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </PanelSection>
  );
}
