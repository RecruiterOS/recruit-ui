"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import type { CallParticipant } from "@epicbagel/saas-kit/primitives/call-card";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import type { ReactNode } from "react";

import type { CallReconcileCardLabels } from "./call-reconcile-card";

/** The create dialog: a new person to attach the call to. */
export interface CallReconcileCreateDialogState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  email: string;
  onEmailChange: (email: string) => void;
  /** Saves the trimmed name and email; the card closes the dialog first. */
  onSubmit: () => void;
}

/** The preview dialog: a picked person, before the call attaches. */
export interface CallReconcilePreviewDialogState {
  open: boolean;
  /** The host's preview of the picked person. */
  content: ReactNode;
  onClose: () => void;
  onAttach: () => void;
}

export interface CallReconcileDialogsProps {
  labels: CallReconcileCardLabels;
  participants: readonly CallParticipant[];
  create: CallReconcileCreateDialogState;
  preview: CallReconcilePreviewDialogState;
}

/**
 * CallReconcileCard's create and preview dialogs, for its search mode. A
 * module of its own that the card loads only in search mode, so a host that
 * picks the person itself (`onPickOther`) never downloads the dialogs or the
 * drawer the kit's ResponsiveDialog renders on a phone. Not exported: render
 * CallReconcileCard.
 */
export function CallReconcileDialogs({ labels: text, participants, create, preview }: CallReconcileDialogsProps) {
  return (
    <>
      <ResponsiveDialog open={create.open} onOpenChange={create.onOpenChange}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{text.createTitle}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <Stack gap="sm">
              {participants.length > 0 && (
                <Stack gap="xs">
                  <Text variant="small" tone="muted">{text.useParticipant}</Text>
                  <Stack direction="horizontal" gap="sm" wrap>
                    {participants.map((participant, index) => (
                      <Button
                        key={`${participant.email ?? participant.name}-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          create.onNameChange(participant.name ?? "");
                          create.onEmailChange(participant.email ?? "");
                        }}
                      >
                        {participant.name || participant.email}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              )}
              <Stack gap="xs">
                <Text variant="small" tone="muted">{text.name}</Text>
                <Input value={create.name} onChange={(event) => create.onNameChange(event.target.value)} placeholder={text.namePlaceholder} />
              </Stack>
              <Stack gap="xs">
                <Text variant="small" tone="muted">{text.email}</Text>
                <Input type="email" value={create.email} onChange={(event) => create.onEmailChange(event.target.value)} placeholder={text.emailPlaceholder} />
              </Stack>
              <Button size="sm" disabled={!create.name.trim()} onClick={() => create.onSubmit()}>
                {text.createSubmit}
              </Button>
            </Stack>
          </ResponsiveDialogBody>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog open={preview.open} onOpenChange={(open) => !open && preview.onClose()}>
        <ResponsiveDialogContent presentation="preview">
          <ResponsiveDialogHeader visibility="screen-reader">
            <ResponsiveDialogTitle>{text.previewTitle}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          {preview.open && (
            <Stack gap="none" minHeight="zero" grow>
              <FlexItem grow minHeight="zero" overflow="hidden">
                {preview.content}
              </FlexItem>
              <Stack direction="horizontal" gap="sm" align="center" justify="end" border="top" surface="background" padding="action-row">
                <Button variant="outline" size="sm" onClick={preview.onClose}>{text.cancel}</Button>
                <Button size="sm" onClick={() => preview.onAttach()}>
                  {text.attach}
                </Button>
              </Stack>
            </Stack>
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
}
