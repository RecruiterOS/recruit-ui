import { cn } from "@epicbagel/saas-kit/lib/utils";
import { ContactHeader } from "@epicbagel/saas-kit/primitives/contact-header";
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
}

/** Structural profile composition. Data loading and record policy stay outside. */
export function CandidateProfile({
  header,
  children,
  footer,
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
      className={className}
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
   * `lg` (the default) pads the header like a card's; `none` sits it flush in
   * a container the host already pads, such as a drawer body.
   */
  padding?: Extract<CandidateCoverHeaderPadding, "lg" | "none">;
}

export function CandidateProfileHeader({
  name,
  avatar,
  cover,
  eyebrow,
  status,
  meta,
  summary,
  actions,
  padding = "lg",
  className,
  ...props
}: CandidateProfileHeaderProps) {
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
        <ContactHeader
          avatar={avatar}
          name={name}
          status={status}
          meta={meta}
          actions={actions}
          spacing="none"
        />
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
}

export function CandidateProfileFooter({
  children,
  ...props
}: CandidateProfileFooterProps) {
  return (
    <PanelSection
      as="footer"
      data-slot="candidate-profile-footer"
      border="top"
      layout="row"
      gap="sm"
      {...props}
    >
      {children}
    </PanelSection>
  );
}
