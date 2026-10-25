import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

interface JobClientBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    /** The organisation the job is for, as the host names it. */
    name: ReactNode;
    /**
     * Tooltip. Defaults to the name when the name is plain text; pass your own
     * wording, such as "Client: …".
     */
    title?: string;
}
/**
 * The organisation a job is for: a quiet secondary badge with the name on one
 * line. It names an organisation, not a contact person. The root is the kit
 * Badge and keeps the kit's own `data-slot="badge"`, which theme stylesheets
 * select on.
 */
declare function JobClientBadge({ name, title, ...props }: JobClientBadgeProps): react.JSX.Element;

export { JobClientBadge, type JobClientBadgeProps };
