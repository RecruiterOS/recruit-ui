import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface CurrentCompanyLabelProps extends HTMLAttributes<HTMLSpanElement> {
    company: ReactNode;
    tenure?: ReactNode;
    suffix?: ReactNode;
    size?: "xs" | "sm" | "base";
    tone?: "inherit" | "muted" | "subtle";
}
/** A display-only current-company line; the host supplies tenure wording. */
declare function CurrentCompanyLabel({ company, tenure, suffix, size, tone, ...props }: CurrentCompanyLabelProps): react.JSX.Element;

export { CurrentCompanyLabel, type CurrentCompanyLabelProps };
