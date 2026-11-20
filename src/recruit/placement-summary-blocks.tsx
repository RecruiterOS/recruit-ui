"use client";

import { Alert } from "@epicbagel/saas-kit/primitives/alert";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { PersonAvatar } from "@epicbagel/saas-kit/primitives/person-avatar";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { ResourceCard, ResourceCardFooter } from "@epicbagel/saas-kit/primitives/resource-card";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useLatestCall } from "./pending-action";

import { WorkflowCandidateHeader, type WorkflowCandidateMedia } from "./workflow-candidate-header";

export interface JobStatusBlockProps {
  title: string;
  client: string;
  statusLabel: string;
  contact?: string;
  contactPhotoUrl?: string | null;
  /** Supply only while closing is available. The host supplies the saved status. */
  onClose?: () => void | Promise<void>;
}

export function JobStatusBlock({ title, client, statusLabel, contact, contactPhotoUrl, onClose }: JobStatusBlockProps) {
  const { run, pendingArgs, failure } = useLatestCall(onClose);
  return (
    <ResourceCard>
      <PanelSection paddingX="lg" paddingTop="lg" paddingBottom="lg">
        <Stack direction="horizontal" align="start" justify="between" wrap gap="sm">
          <Stack gap="xs">
            <Text size="sm" tone="muted">{client}</Text>
            <Heading level={3}>{title}</Heading>
          </Stack>
          <Badge variant="outline">{statusLabel}</Badge>
        </Stack>
      </PanelSection>
      {contact && <PanelSection border="top" paddingX="lg">
        <DefinitionList>
          <DefinitionItem label="Hiring contact">
            {contactPhotoUrl ? <Stack direction="horizontal" align="center" gap="sm">
              <PersonAvatar name={contact} photoUrl={contactPhotoUrl} size={28} decorative />
              {contact}
            </Stack> : contact}
          </DefinitionItem>
        </DefinitionList>
      </PanelSection>}
      {failure && <Alert variant="destructive">Couldn’t close the job. Try again.</Alert>}
      {onClose && <ResourceCardFooter><Button size="sm" disabled={!!pendingArgs} onClick={() => run()}>
        {pendingArgs ? "Closing…" : "Close job"}
      </Button></ResourceCardFooter>}
    </ResourceCard>
  );
}

export interface PlacementTermsBlockProps {
  candidate: string;
  candidateMedia?: WorkflowCandidateMedia;
  role: string;
  /** Amounts already formatted in the offer currency. */
  salary: string;
  fee: string;
  startDate?: string;
}

export function PlacementTermsBlock({ candidate, candidateMedia, role, salary, fee, startDate }: PlacementTermsBlockProps) {
  return (
    <ResourceCard>
      {candidateMedia ? <WorkflowCandidateHeader name={candidate} role={role} media={candidateMedia} eyebrow="Offer terms" /> : (
        <PanelSection paddingX="lg" paddingTop="lg" paddingBottom="lg">
          <Stack gap="xs">
            <Heading level={3}>Offer terms</Heading>
            <Text size="sm" tone="muted">{candidate} · {role}</Text>
          </Stack>
        </PanelSection>
      )}
      <PanelSection border="top" paddingX="lg">
        <DefinitionList variant="divided">
          <DefinitionItem label="Annual salary">{salary}</DefinitionItem>
          <DefinitionItem label="Agency fee">{fee}</DefinitionItem>
          {startDate && <DefinitionItem label="Start date">{startDate}</DefinitionItem>}
        </DefinitionList>
      </PanelSection>
    </ResourceCard>
  );
}
