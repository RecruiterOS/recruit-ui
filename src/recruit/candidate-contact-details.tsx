import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { BadgeCheck, ExternalLink, Link2, Mail, MapPin, Phone, Send } from "lucide-react";
import type { HTMLAttributes, Key, ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

export interface CandidateContactDetailsLabels {
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

const CONTACT_LABELS: CandidateContactDetailsLabels = {
  title: "Contact",
  email: "Email",
  emailVerified: "Email verified",
  phone: "Phone",
  profile: "Profile",
  profileLink: "Profile",
  location: "Location",
};

export interface CandidateContactDetailsProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
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
export function CandidateContactDetails({
  email,
  emailVerified = false,
  phone,
  profileUrl,
  location,
  labels,
  border = "bottom",
  ...props
}: CandidateContactDetailsProps) {
  const wording = { ...CONTACT_LABELS, ...labels };

  return (
    <PanelSection data-slot="candidate-contact-details" border={border} {...props}>
      <SectionHeader label={wording.title} />
      <DefinitionList variant="divided">
        {email && (
          <DefinitionItem label={wording.email}>
            <Text variant="inherit" as="span" display="inline-flex">
              <Anchor href={`mailto:${email}`} variant="text" display="inline-flex">
                <Icon icon={Mail} size="xs" />
                {email}
              </Anchor>
              {emailVerified && (
                <Icon icon={BadgeCheck} size="sm" tone="success" aria-label={wording.emailVerified} />
              )}
            </Text>
          </DefinitionItem>
        )}
        {present(phone) && (
          <DefinitionItem label={wording.phone}>
            <Text variant="inherit" as="span" display="inline-flex">
              <Icon icon={Phone} size="xs" tone="muted" />
              {phone}
            </Text>
          </DefinitionItem>
        )}
        {profileUrl && (
          <DefinitionItem label={wording.profile}>
            <Anchor
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              display="inline-flex"
            >
              <Icon icon={Link2} size="xs" />
              {wording.profileLink}
              <Icon icon={ExternalLink} size="xs" />
            </Anchor>
          </DefinitionItem>
        )}
        {present(location) && (
          <DefinitionItem label={wording.location}>
            <Text variant="inherit" as="span" display="inline-flex">
              <Icon icon={MapPin} size="xs" tone="muted" />
              {location}
            </Text>
          </DefinitionItem>
        )}
      </DefinitionList>
    </PanelSection>
  );
}

/** One channel a person was contacted on. */
export interface CandidateChannelLogEntry {
  id?: Key;
  /** The channel's name. */
  label: ReactNode;
  /** When it was last used, already formatted. */
  when: ReactNode;
}

export interface CandidateChannelLogProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
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
export function CandidateChannelLog({
  title,
  entries,
  empty = { title: "No outreach logged yet" },
  control,
  border = "bottom",
  ...props
}: CandidateChannelLogProps) {
  return (
    <PanelSection data-slot="candidate-channel-log" border={border} {...props}>
      <SectionHeader label={title} />
      {entries.length > 0 ? (
        <DefinitionList variant="divided">
          {entries.map((entry, index) => (
            <DefinitionItem key={entry.id ?? index} label={entry.label}>
              {entry.when}
            </DefinitionItem>
          ))}
        </DefinitionList>
      ) : (
        <EmptyState
          variant="empty"
          size="inline"
          icon={Send}
          title={empty.title}
          description={empty.description}
        />
      )}
      {present(control) && (
        <Text as="div" variant="inherit" marginTop="md">
          {control}
        </Text>
      )}
    </PanelSection>
  );
}

/** One labelled value in a CandidateDefinitionSection. */
export interface CandidateDefinitionItem {
  id?: Key;
  label: ReactNode;
  /** An empty value leaves the row out. */
  value: ReactNode;
}

export interface CandidateDefinitionSectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
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
export function CandidateDefinitionSection({
  title,
  items,
  border = "bottom",
  ...props
}: CandidateDefinitionSectionProps) {
  const shown = items.filter((item) => present(item.value));
  if (shown.length === 0) return null;

  return (
    <PanelSection data-slot="candidate-definition-section" border={border} {...props}>
      <SectionHeader label={title} />
      <DefinitionList variant="divided">
        {shown.map((item, index) => (
          <DefinitionItem key={item.id ?? index} label={item.label}>
            {item.value}
          </DefinitionItem>
        ))}
      </DefinitionList>
    </PanelSection>
  );
}
