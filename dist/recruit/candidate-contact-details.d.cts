import * as react from 'react';
import { HTMLAttributes, ReactNode, Key } from 'react';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

interface CandidateContactDetailsLabels {
    title: ReactNode;
    email: ReactNode;
    /** The verified mark's accessible name. */
    emailVerified: string;
    phone: ReactNode;
    /** The external profile row's label, such as the network's name. */
    profile: ReactNode;
    /** The external profile link's text. */
    profileLink: ReactNode;
    location: ReactNode;
}
interface CandidateContactDetailsProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** Linked with `mailto:`. */
    email?: string | null;
    /** Adds a success-toned check after the address. */
    emailVerified?: boolean;
    /** The number, already formatted or as a phone-number component. */
    phone?: ReactNode;
    /** An external profile, opened in a new tab. */
    profileUrl?: string | null;
    location?: ReactNode;
    labels?: Partial<CandidateContactDetailsLabels>;
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * How to reach a person, as a divided definition list: email (with a
 * verified mark), phone, an external profile and location. A row shows only
 * when its value is given.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-contact-details"`.
 */
declare function CandidateContactDetails({ email, emailVerified, phone, profileUrl, location, labels, border, ...props }: CandidateContactDetailsProps): react.JSX.Element;
/** One channel a person was contacted on. */
interface CandidateChannelLogEntry {
    id?: Key;
    /** The channel's name. */
    label: ReactNode;
    /** When it was last used, already formatted. */
    when: ReactNode;
}
interface CandidateChannelLogProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The section heading, such as which role the outreach is for. */
    title: ReactNode;
    /** The channels used, in the order to show them, usually most recent first. */
    entries: readonly CandidateChannelLogEntry[];
    /** The blank slate's wording. Defaults to "No outreach logged yet". */
    empty?: CandidateEmptyCopy;
    /** Under the log, the control that records a channel, such as a CandidateContactChannelsMenu. */
    control?: ReactNode;
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * Which channels a person has been contacted on, and when, as a divided
 * definition list, or the kit's empty state when none is recorded, with the
 * host's recording control underneath.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-channel-log"`.
 */
declare function CandidateChannelLog({ title, entries, empty, control, border, ...props }: CandidateChannelLogProps): react.JSX.Element;
/** One labelled value in a CandidateDefinitionSection. */
interface CandidateDefinitionItem {
    id?: Key;
    label: ReactNode;
    /** An empty value leaves the row out. */
    value: ReactNode;
}
interface CandidateDefinitionSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /** The section heading. */
    title: ReactNode;
    items: readonly CandidateDefinitionItem[];
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * A titled, divided list of labelled values about a person, such as their
 * experience, salary and documents. Rows without a value are left out, and
 * with none left it renders nothing.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-definition-section"`.
 */
declare function CandidateDefinitionSection({ title, items, border, ...props }: CandidateDefinitionSectionProps): react.JSX.Element | null;

export { CandidateChannelLog, type CandidateChannelLogEntry, type CandidateChannelLogProps, CandidateContactDetails, type CandidateContactDetailsLabels, type CandidateContactDetailsProps, type CandidateDefinitionItem, CandidateDefinitionSection, type CandidateDefinitionSectionProps };
