"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Check, Copy, Loader2, MessageSquare, RefreshCw, Settings2 } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

/** A channel a message can be drafted for. */
export interface CandidateOutreachChannel<TValue extends string = string> {
  value: TValue;
  /** The channel's name, on its button and in the default wording. */
  label: string;
}

/**
 * The house style a draft follows on the current channel, which a person
 * can edit in place. The host keeps the edit's state and saves it.
 */
export interface CandidateOutreachGuidance {
  /** The guidance in force, shown on one truncated line. */
  text: ReactNode;
  /** Marks the guidance as changed from your default. */
  custom?: boolean;
  /** Shows the editor in place of the line. */
  editing: boolean;
  /** The editor's text. */
  value: string;
  /** Shows a spinner on Save and disables it. */
  saving?: boolean;
  /** Set false to disable Save, for example when there is nowhere to save to. */
  canSave?: boolean;
  /** Opens the editor; seed `value` with the guidance in force. */
  onEdit: () => void;
  onChange: (value: string) => void;
  /** Puts your default back in the editor. */
  onReset: () => void;
  onSave: () => void;
  onCancel: () => void;
}

/** A drafted message, which a person can edit before copying it. */
export interface CandidateOutreachDraft {
  /** Shown above the message, for channels that have one. */
  subject?: ReactNode;
  message: string;
  /** The tone the draft took, shown beside Redo and Copy. */
  tone?: ReactNode;
}

export interface CandidateOutreachComposerLabels {
  title: ReactNode;
  /** The editor's heading, from the channel's label. Shown in capitals. */
  guidanceHeading: (channel: string) => ReactNode;
  reset: string;
  cancel: string;
  save: string;
  /** The badge on custom guidance. */
  custom: string;
  /** The draft button, from the channel's label. */
  draft: (channel: string) => string;
  drafting: string;
  /** Before the subject. */
  subject: string;
  /** Before the tone. */
  tone: string;
  redo: string;
  copy: string;
  copied: string;
}

const LABELS: CandidateOutreachComposerLabels = {
  title: "Outreach",
  guidanceHeading: (channel) => `${channel} tone`,
  reset: "Reset default",
  cancel: "Cancel",
  save: "Save",
  custom: "custom",
  draft: (channel) => `Draft ${channel} message`,
  drafting: "Drafting...",
  subject: "Subject: ",
  tone: "Tone: ",
  redo: "Redo",
  copy: "Copy",
  copied: "Copied",
};

export interface CandidateOutreachComposerProps<TValue extends string = string>
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children" | "onCopy"> {
  /** The channels, in order, as buttons in the header. */
  channels: readonly CandidateOutreachChannel<TValue>[];
  channel: TValue;
  onChannelChange: (value: TValue) => void;
  guidance: CandidateOutreachGuidance;
  /** The draft for the current channel. Without one, the composer offers to write it. */
  draft?: CandidateOutreachDraft | null;
  /** Shows the draft's progress and disables Draft and Redo. */
  drafting?: boolean;
  /** Why the last draft failed. */
  error?: ReactNode;
  /** Shows Copied, with a check, in place of Copy. */
  copied?: boolean;
  /** Writes a draft, or a fresh one. */
  onDraft: () => void;
  /** Copies the draft; the host decides what goes on the clipboard. */
  onCopy: () => void;
  onEditDraft: (message: string) => void;
  labels?: Partial<CandidateOutreachComposerLabels>;
  /** The kit PanelSection's divider. */
  border?: "none" | "top" | "bottom";
}

/**
 * Drafts a first message to a person: a channel picker in the header, the
 * house style for that channel on one line (which opens an editor), a button
 * that drafts the message, then the editable draft with its tone, Redo and
 * Copy. The host writes the draft, keeps the guidance and owns the clipboard.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-outreach-composer"`.
 */
export function CandidateOutreachComposer<TValue extends string = string>({
  channels,
  channel,
  onChannelChange,
  guidance,
  draft,
  drafting = false,
  error,
  copied = false,
  onDraft,
  onCopy,
  onEditDraft,
  labels,
  border = "bottom",
  ...props
}: CandidateOutreachComposerProps<TValue>) {
  const wording = { ...LABELS, ...labels };
  const channelLabel = channels.find((option) => option.value === channel)?.label ?? channel;

  return (
    <PanelSection data-slot="candidate-outreach-composer" border={border} {...props}>
      <SectionHeader
        label={wording.title}
        action={(
          <Stack direction="horizontal" gap="xs" align="center">
            {channels.map((option) => (
              <Button
                key={option.value}
                variant={channel === option.value ? "default" : "outline"}
                size="compact"
                onClick={() => onChannelChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </Stack>
        )}
      />

      {guidance.editing ? (
        <Stack direction="vertical" gap="xs" marginBottom="md" radius="md" border="dashed" padding="sm">
          <Stack direction="horizontal" gap="none" align="center" justify="between">
            <Text variant="micro" as="span" weight="medium" tone="muted" transform="uppercase">
              {wording.guidanceHeading(channelLabel)}
            </Text>
            <Button type="button" variant="link-muted" size="bare" onClick={() => guidance.onReset()}>
              {wording.reset}
            </Button>
          </Stack>
          <Textarea
            value={guidance.value}
            onChange={(event) => guidance.onChange(event.target.value)}
            rows={2}
            textSize="xs"
            autoFocus
          />
          <Stack direction="horizontal" gap="xs" justify="end">
            <Button size="micro" variant="ghost" onClick={() => guidance.onCancel()}>{wording.cancel}</Button>
            <Button
              size="micro"
              onClick={() => guidance.onSave()}
              disabled={!!guidance.saving || guidance.canSave === false}
            >
              {guidance.saving ? <Icon icon={Loader2} size="xs" spin /> : wording.save}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button type="button" variant="quiet" size="tone" onClick={() => guidance.onEdit()}>
          <Icon icon={Settings2} size="xs" tone="muted" />
          <Text variant="micro" as="span" tone="muted" truncate grow align="start">{guidance.text}</Text>
          {guidance.custom && <Badge as="span" variant="info" size="tiny" weight="normal" shrink>{wording.custom}</Badge>}
        </Button>
      )}

      {!draft ? (
        <Button variant="outline" size="sm" width="full" onClick={() => onDraft()} disabled={drafting}>
          <Icon icon={drafting ? Loader2 : MessageSquare} size="sm" spin={drafting} />
          {drafting ? wording.drafting : wording.draft(channelLabel)}
        </Button>
      ) : (
        <Stack direction="vertical" gap="sm">
          {draft.subject != null && draft.subject !== false && (
            <Text as="div" variant="inherit" size="xs">
              <Text variant="inherit" as="span" tone="muted">{wording.subject}</Text>
              <Text variant="inherit" as="span" weight="medium">{draft.subject}</Text>
            </Text>
          )}
          <Textarea value={draft.message} onChange={(event) => onEditDraft(event.target.value)} rows={6} textSize="xs" />
          <Stack direction="horizontal" gap="none" align="center" justify="between">
            <Text variant="micro" as="span" tone="muted">
              {present(draft.tone) ? <>{wording.tone}{draft.tone}</> : null}
            </Text>
            <Stack direction="horizontal" gap="xs">
              <Button variant="outline" size="compact" onClick={() => onDraft()} disabled={drafting}>
                <Icon icon={drafting ? Loader2 : RefreshCw} size="xs" spin={drafting} marginEnd="md" />
                {wording.redo}
              </Button>
              <Button variant="default" size="compact" onClick={() => onCopy()}>
                <Icon icon={copied ? Check : Copy} size="xs" marginEnd="md" />
                {copied ? wording.copied : wording.copy}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      )}
      {present(error) && <Text size="xs" tone="destructive" marginTop="xs">{error}</Text>}
    </PanelSection>
  );
}
