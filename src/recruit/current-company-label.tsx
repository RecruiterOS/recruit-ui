import { Text } from "@/components/recruit-ui/core/primitives/text";
import type { HTMLAttributes, ReactNode } from "react";

export interface CurrentCompanyLabelProps
  extends HTMLAttributes<HTMLSpanElement> {
  company: ReactNode;
  tenure?: ReactNode;
  suffix?: ReactNode;
  size?: "xs" | "sm" | "base";
  tone?: "inherit" | "muted" | "subtle";
}

/** A display-only current-company line; the host supplies tenure wording. */
export function CurrentCompanyLabel({
  company,
  tenure,
  suffix,
  size = "sm",
  tone = "muted",
  ...props
}: CurrentCompanyLabelProps) {
  return (
    <Text
      as="span"
      data-slot="current-company-label"
      variant="inherit"
      size={size}
      tone={tone}
      {...props}
    >
      {company}
      {tenure != null ? (
        <>
          <span aria-hidden> · </span>
          {tenure}
        </>
      ) : null}
      {suffix}
    </Text>
  );
}
