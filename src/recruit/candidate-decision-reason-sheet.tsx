"use client";

import { useDictation } from "@epicbagel/saas-kit/hooks/use-dictation";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Chat } from "@epicbagel/saas-kit/primitives/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@epicbagel/saas-kit/primitives/dialog";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { ArrowRight, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { CandidateDecisionChoice } from "./candidate-decision-buttons";

/** Host-owned wording for the sheet's fixed parts. */
export interface CandidateDecisionReasonSheetLabels {
  /** The close button's tooltip and accessible name. Closing decides nothing. */
  cancel: string;
  /** Under the mic. */
  speak: ReactNode;
  /** The switch from speaking to typing. */
  typeInstead: ReactNode;
  /** Over the one-tap reasons. */
  reasons: string;
  /** The typed reason's placeholder. */
  placeholder: string;
  /** In place of the composer while a promise from `onConfirm` is pending. */
  saving: string;
  /** Under the composer when a promise from `onConfirm` rejects. */
  failed: string;
}

const DEFAULT_LABELS: CandidateDecisionReasonSheetLabels = {
  cancel: "Cancel",
  speak: "Tap to speak",
  typeInstead: "or type instead",
  reasons: "or pick a reason",
  placeholder: "Type a reason…",
  saving: "Saving…",
  failed: "That didn't save. Try again.",
};

export interface CandidateDecisionReasonSheetProps {
  open: boolean;
  /** Called from the close button and Escape. Nothing is decided. */
  onClose: () => void;
  /**
   * The answer being explained. It only words the defaults ("Why no?",
   * "Skip — just mark No"): the sheet neither holds nor saves a decision, so
   * leave it out for any other question and pass the wording yourself.
   */
  decision?: CandidateDecisionChoice;
  /** The candidate's name, for the default wording only. */
  candidateName?: string;
  /** The question, as the sheet's heading and its accessible name. */
  title?: ReactNode;
  /** The line under the question, which also describes the sheet to a screen reader. */
  subtitle?: ReactNode;
  /** The dictation overlay's title, such as "Why no on Mei Tanaka?". */
  voiceTitle?: string;
  /** One-tap reasons, already worded. Picking one confirms with it. */
  reasons?: readonly string[];
  /**
   * Called with the reason a person spoke, typed or picked, trimmed, or with
   * none when they skipped. The host saves the decision and closes the sheet.
   * It may return a promise: while that is pending the sheet shows
   * `labels.saving` in place of the composer and Skip is disabled, though
   * the sheet can still be closed; if it rejects, the composer comes back
   * with a typed or spoken reason still in it and `labels.failed` under it.
   */
  onConfirm: (reason?: string) => unknown;
  /**
   * Takes Skip away, so the only ways out are a reason or the close button.
   * A reason is optional without it: encouraged, never demanded.
   */
  reasonRequired?: boolean;
  /** Skip's wording, such as "Skip — just reject Mei Tanaka". */
  skipLabel?: ReactNode;
  /**
   * Host content over the bottom row, such as a switch that changes what the
   * decision does. Its state stays the host's, read when `onConfirm` runs.
   */
  footer?: ReactNode;
  /** Host controls in the bottom row, before Skip, such as another way to decide. */
  actions?: ReactNode;
  /**
   * `false` leaves dictation out, and the sheet opens on the typed reason.
   * It also opens there wherever dictation can't run.
   */
  voice?: boolean;
  /** The language dictation listens for, as a BCP 47 tag. */
  voiceLang?: string;
  labels?: Partial<CandidateDecisionReasonSheetLabels>;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return value != null && typeof (value as PromiseLike<unknown>).then === "function";
}

function shown(node: ReactNode): boolean {
  return node != null && node !== false && node !== "";
}

function defaultTitle(decision: CandidateDecisionChoice | undefined): string {
  if (decision === "yes") return "Why yes?";
  if (decision === "no") return "Why no?";
  return "Why?";
}

function defaultSubtitle(candidateName: string | undefined, hasReasons: boolean): string {
  const whose = candidateName ? ` for ${candidateName}` : "";
  return hasReasons ? `Give your reason${whose}, or pick one.` : `Give your reason${whose}.`;
}

function defaultVoiceTitle(
  decision: CandidateDecisionChoice | undefined,
  candidateName: string | undefined,
  title: ReactNode,
): string {
  if (decision && candidateName) return `Why ${decision} on ${candidateName}?`;
  return typeof title === "string" ? title : defaultTitle(decision);
}

function defaultSkipLabel(decision: CandidateDecisionChoice | undefined): string {
  if (decision === "yes") return "Skip — just mark Yes";
  if (decision === "no") return "Skip — just mark No";
  return "Skip";
}

/**
 * Whether dictation can run here, as the kit's own mic decides it: the
 * host's transport from a `DictationProvider`, or else the browser's speech
 * recognition. `null` until the first effects have run, which is when the
 * kit finds out.
 */
function useDictationSupport(): boolean | null {
  const { supported } = useDictation();
  const [known, setKnown] = useState(false);
  // Declared after the kit's own effect, so both land in one render.
  useEffect(() => setKnown(true), []);
  return known ? supported : null;
}

/**
 * The voice-first "Why?" asked once a reviewer has decided: speaking the
 * reason is the default, a suggested reason is one tap, and typing is a tap
 * away. Each of them calls `onConfirm` with that reason; Skip calls it with
 * none; the close button and Escape call `onClose`, and nothing is decided.
 *
 * The mic, the reason chips and the composer are the kit's `Chat` in its
 * voice-first empty state, inside the kit's `Dialog`, so the sheet keeps its
 * focus when it opens from another dialog, such as a candidate's profile.
 * Dictation is wired as everywhere else in this library: the kit's mic uses
 * the transport of the host's `DictationProvider`
 * (`@epicbagel/saas-kit/primitives/dictation-provider`), or the browser's
 * speech recognition without one. Where neither can run, or with
 * `voice={false}`, the sheet opens on the typed reason instead.
 *
 * Clicks and key presses inside the sheet stop at it, so it can be rendered
 * inside a clickable candidate card, whose handlers they would otherwise
 * reach through the portal. Nothing of the sheet is mounted while it is
 * closed, so each opening starts afresh, and when it closes focus goes back
 * to the control it was opened from, if that is still there. The host owns
 * the decision, the suggested reasons and every word.
 *
 * The root is the kit's dialog content and keeps its
 * `data-slot="dialog-content"`; the sheet's own layout inside it is marked
 * `data-slot="candidate-decision-reason-sheet"`, with `data-decision` when a
 * `decision` is given, and its bottom bar
 * `data-slot="candidate-decision-reason-sheet-footer"`.
 */
export function CandidateDecisionReasonSheet({
  open,
  onClose,
  decision,
  candidateName,
  title,
  subtitle,
  reasons = [],
  ...body
}: CandidateDecisionReasonSheetProps) {
  // What had focus when the sheet opened, usually the Yes or No that asked.
  const opener = useRef<Element | null>(null);

  // A host clears its decision as it closes the sheet, and the wording goes
  // with it: closed, the sheet is gone at once rather than fade out reworded.
  if (!open) return null;

  // The same reason twice would be one chip drawn twice.
  const chips = [...new Set(reasons.map((reason) => reason.trim()).filter(Boolean))];
  const heading = shown(title) ? title : defaultTitle(decision);
  const description = subtitle === undefined ? defaultSubtitle(candidateName, chips.length > 0) : subtitle;
  const described = shown(description);

  return (
    <Dialog open onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent
        size="wide"
        height="viewport-lg"
        layout="column"
        padding="none"
        overflow="hidden"
        hideClose
        // With no description, tell Radix so rather than point at nothing.
        {...(described ? {} : { "aria-describedby": undefined })}
        onOpenAutoFocus={() => {
          opener.current = document.activeElement;
        }}
        // Radix hands focus back to a dialog's trigger, and a sheet opened by
        // the host's own state has none.
        onCloseAutoFocus={(event) => {
          const from = opener.current;
          if (!(from instanceof HTMLElement) || !from.isConnected) return;
          event.preventDefault();
          from.focus();
        }}
        // React events bubble out of a portal along the component tree, so
        // without these a click or a key press in the sheet reaches a
        // clickable card it was rendered in, and typing a space would open
        // the card. Stopping them here cancels neither typing nor sending.
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {/*
          The dialog's name and description, read when it opens. The words a
          person sees are the composer's own heading and line below, so these
          two are hidden from a screen reader's reading order: it would
          otherwise meet each of them twice.
        */}
        <DialogTitle visuallyHidden asChild>
          <span aria-hidden="true">{heading}</span>
        </DialogTitle>
        {described ? (
          <DialogDescription visuallyHidden asChild>
            <span aria-hidden="true">{description}</span>
          </DialogDescription>
        ) : null}
        <ReasonSheetBody
          {...body}
          onClose={onClose}
          decision={decision}
          candidateName={candidateName}
          heading={heading}
          description={described ? description : undefined}
          chips={chips}
        />
      </DialogContent>
    </Dialog>
  );
}

type ReasonSheetBodyProps = Omit<
  CandidateDecisionReasonSheetProps,
  "open" | "title" | "subtitle" | "reasons"
> & {
  heading: ReactNode;
  description: ReactNode;
  chips: readonly string[];
};

/**
 * What the sheet holds: mounted afresh each time it opens, so a draft, the
 * switch to typing and a failed save never carry over to the next person.
 */
function ReasonSheetBody({
  onClose,
  decision,
  candidateName,
  heading,
  description,
  voiceTitle,
  chips,
  onConfirm,
  reasonRequired = false,
  skipLabel,
  footer,
  actions,
  voice = true,
  voiceLang,
  labels,
}: ReasonSheetBodyProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const dictation = useDictationSupport();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  // A second tap before the first re-render must not confirm twice.
  const inFlight = useRef(false);

  const confirm = async (reason?: string) => {
    if (inFlight.current) return;
    setFailed(false);
    try {
      const result = onConfirm(reason);
      if (isPromiseLike(result)) {
        inFlight.current = true;
        setSaving(true);
        await result;
      }
    } catch (cause) {
      setFailed(true);
      // The composer puts a typed or spoken reason back when it sees this.
      throw cause;
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  const hasBottomRow = shown(actions) || !reasonRequired;

  return (
    <Stack
      data-slot="candidate-decision-reason-sheet"
      data-decision={decision}
      direction="vertical"
      gap="none"
      grow
      minHeight="zero"
    >
      <Stack
        direction="horizontal"
        gap="none"
        align="center"
        justify="end"
        paddingX="md"
        paddingTop="safe"
        paddingBottom="sm"
      >
        {/* Never disabled: a save that hangs must not hold a person in the sheet. */}
        <Button type="button" variant="ghost" size="icon-md" title={text.cancel} onClick={onClose}>
          <Icon icon={X} size="lg" />
        </Button>
      </Stack>

      <Stack direction="vertical" gap="none" justify="center" grow overflow="y-auto" paddingX="md">
        {/* A centred column: the composer would otherwise run edge to edge on a wide screen. */}
        <Stack gap="none" centered width="full" maxWidth="xl">
          {dictation === null ? null : (
            <Chat
              messages={[]}
              onSend={(reason) => confirm(reason.trim() || undefined)}
              // The failure shows under the composer; the host has the rejection itself.
              onSendError={() => undefined}
              pending={saving}
              emptyPendingContent={(
                // The composer is gone while this shows, so it is said aloud.
                <Stack role="status" gap="none" width="full">
                  <EmptyState
                    variant="empty"
                    size="md"
                    icon={Loader2}
                    iconMotion="spin"
                    surface="plain"
                    title={text.saving}
                    description=""
                  />
                </Stack>
              )}
              error={failed ? text.failed : null}
              defaultMode={voice && dictation ? "voice" : "text"}
              voice={voice}
              voiceLang={voiceLang}
              voiceTitle={voiceTitle ?? defaultVoiceTitle(decision, candidateName, heading)}
              voiceHeroLabel={text.speak}
              voiceHeroSwitchLabel={text.typeInstead}
              emptyTitle={heading}
              emptySubtitle={description}
              examplePrompts={chips}
              examplePromptsLabel={text.reasons}
              placeholder={text.placeholder}
            />
          )}
        </Stack>
      </Stack>

      {shown(footer) || hasBottomRow ? (
        <Stack
          data-slot="candidate-decision-reason-sheet-footer"
          direction="vertical"
          gap="sm"
          align="center"
          border="top"
          paddingX="lg"
          paddingY="md"
        >
          {footer}
          {hasBottomRow ? (
            <Stack direction="horizontal" gap="sm" align="center" justify="center" wrap>
              {actions}
              {reasonRequired ? null : (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={saving}
                  // A failed save shows as `labels.failed`; the host has the rejection itself.
                  onClick={() => void confirm().catch(() => undefined)}
                >
                  {shown(skipLabel) ? skipLabel : defaultSkipLabel(decision)}
                  <Icon icon={ArrowRight} size="md" marginStart="sm" />
                </Button>
              )}
            </Stack>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
