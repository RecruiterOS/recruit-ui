"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Loader2, MessageSquare, Mic, Sparkles, StickyNote, Trash2 } from "lucide-react";
import { useState, type HTMLAttributes, type ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

export interface CandidateNoteListProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** How many notes there are. Zero shows the empty state instead of `children`. */
  count: number;
  /** A skeleton row in place of the list, and no count yet. */
  loading?: boolean;
  /** The section heading. */
  title?: ReactNode;
  /** The blank slate's wording. Defaults to "No notes yet". */
  empty?: CandidateEmptyCopy;
  /** Below the notes, usually a CandidateNoteComposer. */
  composer?: ReactNode;
  /** The notes, usually CandidateNoteCards, newest or pinned first. */
  children?: ReactNode;
  /** The kit PanelSection's divider. */
  border?: "none" | "top" | "bottom";
}

/**
 * The notes on one person, as a counted section: a skeleton row while they
 * load, then the host's note cards, or the kit's empty state when there are
 * none, with the composer underneath so a new note lands below the last.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-note-list"`.
 */
export function CandidateNoteList({
  count,
  loading = false,
  title = "Notes",
  empty = { title: "No notes yet" },
  composer,
  children,
  border = "bottom",
  ...props
}: CandidateNoteListProps) {
  return (
    <PanelSection data-slot="candidate-note-list" border={border} {...props}>
      <SectionHeader label={title} count={loading ? undefined : count} />
      {loading ? (
        <Stack direction="vertical" gap="sm" marginTop="md">
          <Skeleton preset="row" radius="xl" />
        </Stack>
      ) : count > 0 ? (
        <Stack direction="vertical" gap="sm" marginTop="md">
          {children}
        </Stack>
      ) : (
        <EmptyState
          variant="empty"
          size="inline"
          icon={StickyNote}
          title={empty.title}
          description={empty.description}
        />
      )}
      {composer}
    </PanelSection>
  );
}

/** How a note was left, which picks its glyph: dictated, written by an assistant, or typed. */
export type CandidateNoteKind = "voice" | "agent" | "note";

/** Marks a note that stays at the top of the list and is edited elsewhere. */
export interface CandidateNotePinned {
  /** The badge text, such as "Client note · pinned". */
  label: ReactNode;
  /** The badge tooltip, such as where to edit it. */
  title?: string;
}

/** Which role, if any, the note belongs to. */
export interface CandidateNoteScope {
  /** The badge text, such as the role's title or "General". */
  label: ReactNode;
  /** The badge tooltip. */
  title?: string;
  /** An info-toned badge, for a note tied to a role, instead of the neutral one. */
  highlighted?: boolean;
}

export interface CandidateNoteCardLabels {
  /** After the author on a dictated note. Pass `null` to leave it out. */
  voice: ReactNode;
  /** The delete button's tooltip and accessible name. */
  delete: string;
}

const NOTE_CARD_LABELS: CandidateNoteCardLabels = {
  voice: "· voice",
  delete: "Delete note",
};

const NOTE_ICON = { voice: Mic, agent: Sparkles, note: MessageSquare } as const;

export interface CandidateNoteCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Who left it, already resolved to a display name. */
  author: ReactNode;
  kind?: CandidateNoteKind;
  /** Pins the note: it sits on the card surface, not the muted one, with this badge. */
  pinned?: CandidateNotePinned;
  scope?: CandidateNoteScope;
  /** When it was left, already formatted. */
  date?: ReactNode;
  /** The note, kept as written: line breaks are preserved. */
  text?: ReactNode;
  /** Adds a delete button. Confirm in the host before deleting anything. */
  onDelete?: () => void;
  /** Whether the delete button is always shown or appears on hover. Use `always` on touch screens. */
  revealDelete?: "always" | "hover";
  labels?: Partial<CandidateNoteCardLabels>;
}

/**
 * One note on a person: who left it and how, an optional pinned badge, the
 * role it belongs to, when, and the text, with a delete button that appears
 * on hover or always. The host resolves authors and roles and confirms
 * deletes.
 *
 * The root is the kit Card and keeps the kit's own `data-slot="card"`, which
 * theme stylesheets select on.
 */
export function CandidateNoteCard({
  author,
  kind = "note",
  pinned,
  scope,
  date,
  text,
  onDelete,
  revealDelete = "hover",
  labels,
  ...props
}: CandidateNoteCardProps) {
  const voiceLabel = labels?.voice !== undefined ? labels.voice : NOTE_CARD_LABELS.voice;
  const deleteLabel = labels?.delete ?? NOTE_CARD_LABELS.delete;

  return (
    <Card interaction="group" surface={pinned ? "card" : "muted"} padding="row" {...props}>
      <Stack direction="horizontal" gap="none" align="center" justify="between" marginBottom="md">
        <Stack direction="horizontal" gap="sm" align="center" textSize="xs" tone="muted" wrap>
          <Text variant="inherit" as="span" display="inline-flex" weight="medium" tone="soft">
            <Icon icon={NOTE_ICON[kind]} size="xs" />
            {author}
          </Text>
          {pinned && (
            <Badge as="span" variant="info" size="micro" weight="semibold" title={pinned.title}>
              {pinned.label}
            </Badge>
          )}
          {kind === "voice" && present(voiceLabel) && (
            <Text variant="inherit" as="span" tone="subtle">{voiceLabel}</Text>
          )}
          {scope && (
            <Badge
              as="span"
              variant={scope.highlighted ? "info" : "default"}
              size="micro"
              weight="semibold"
              title={scope.title}
            >
              {scope.label}
            </Badge>
          )}
        </Stack>
        <Stack direction="horizontal" gap="xs" align="center">
          {date}
          {onDelete && (
            <Button
              type="button"
              size="icon-sm"
              reveal={revealDelete === "always" ? "always" : "parent-hover-responsive"}
              variant="ghost-destructive"
              onClick={() => onDelete()}
              title={deleteLabel}
            >
              <Icon icon={Trash2} size="sm" />
            </Button>
          )}
        </Stack>
      </Stack>
      {present(text) && <Text size="sm" whitespace="pre-wrap">{text}</Text>}
    </Card>
  );
}

export interface CandidateNoteComposerLabels {
  /** Under the microphone, and its accessible name. */
  voice: string;
  /** The link that switches to typing. */
  type: string;
  placeholder: string;
  cancel: string;
  submit: string;
}

const COMPOSER_LABELS: CandidateNoteComposerLabels = {
  voice: "Tap to speak",
  type: "or type instead",
  placeholder: "Type your note…",
  cancel: "Cancel",
  submit: "Add note",
};

export interface CandidateNoteComposerProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "onSubmit"> {
  /** Starts dictation. The host records the note and saves it. Without it the microphone does nothing. */
  onVoice?: () => void;
  /**
   * Saves a typed note or a picked suggestion, trimmed. Resolve once saved:
   * the composer then clears and closes. Reject and the typed text stays.
   */
  onSubmit: (text: string) => Promise<void>;
  /** One-tap notes under the microphone, each saved as written. */
  suggestions?: readonly string[];
  labels?: Partial<CandidateNoteComposerLabels>;
}

/**
 * Leaves a note on a person, voice first: a large microphone, a link to type
 * instead, and one-tap suggestions. Typing opens a text area with Cancel and
 * Add note; Add note stays disabled until there is text and shows a spinner
 * while the host saves.
 *
 * The root is marked `data-slot="candidate-note-composer"`.
 */
export function CandidateNoteComposer({
  onVoice,
  onSubmit,
  suggestions = [],
  labels,
  ...props
}: CandidateNoteComposerProps) {
  const copy = { ...COMPOSER_LABELS, ...labels };
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (note: string) => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onSubmit(trimmed);
      setText("");
      setTyping(false);
    } catch {
      // The host reports the failure; keep what was typed.
    } finally {
      setSaving(false);
    }
  };

  if (typing) {
    return (
      <Stack data-slot="candidate-note-composer" direction="vertical" gap="sm" marginTop="md" {...props}>
        <Textarea
          resize="none"
          placeholder={copy.placeholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
          autoFocus
        />
        <Stack direction="horizontal" gap="sm" align="center">
          <Button size="sm" variant="ghost" onClick={() => { setTyping(false); setText(""); }}>
            {copy.cancel}
          </Button>
          <Button size="sm" onClick={() => void submit(text)} disabled={!text.trim() || saving}>
            {saving ? <Icon icon={Loader2} size="sm" spin /> : copy.submit}
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack data-slot="candidate-note-composer" direction="vertical" gap="sm" marginTop="md" {...props}>
      <Stack direction="vertical" gap="sm" align="center" paddingY="md">
        <Button type="button" variant="outline" size="voice" aria-label={copy.voice} onClick={() => onVoice?.()}>
          <Icon icon={Mic} size={28} tone="muted" />
        </Button>
        <Text variant="inherit" as="span" size="sm" weight="medium">{copy.voice}</Text>
        <Button type="button" variant="quiet" size="bare" onClick={() => setTyping(true)}>
          {copy.type}
        </Button>
      </Stack>

      {suggestions.length > 0 && (
        <Stack direction="horizontal" gap="xs" justify="center" wrap>
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline-muted"
              size="suggestion"
              onClick={() => void submit(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
