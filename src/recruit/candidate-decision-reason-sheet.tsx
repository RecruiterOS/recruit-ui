"use client";

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
import { Suggestion, Suggestions } from "@epicbagel/saas-kit/primitives/suggestion";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ToggleGroup, ToggleGroupItem } from "@epicbagel/saas-kit/primitives/toggle-group";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";

import type { CandidateDecisionChoice } from "./candidate-decision-buttons";
import { useDictationSupport } from "./dictation-support";

/**
 * How the one-tap reasons are picked: `single`, where a tap confirms with
 * that reason at once, or `multiple`, where each tap ticks or unticks a
 * reason and the bottom button confirms with those ticked.
 */
export type CandidateDecisionReasonSelection = "single" | "multiple";

/** What a person gave, handed to `onConfirm` after the one-line reason. */
export interface CandidateDecisionReasonAnswer {
  /**
   * Every reason given, each its own entry: the ones picked, in the order
   * they are shown, then what was spoken or typed. Empty for a skip.
   */
  reasons: readonly string[];
}

/** What joins several reasons into the one line `onConfirm` is given. */
const REASON_SEPARATOR = "; ";

// Where the choice of Single or Multiple is kept for the browser session.
const SELECTION_KEY = "recruit-ui:decision-reason-selection";

function rememberedSelection(): CandidateDecisionReasonSelection | null {
  try {
    const stored = window.sessionStorage.getItem(SELECTION_KEY);
    return stored === "single" || stored === "multiple" ? stored : null;
  } catch {
    // No storage here (a private window, a server): the default stands.
    return null;
  }
}

function rememberSelection(selection: CandidateDecisionReasonSelection) {
  try {
    window.sessionStorage.setItem(SELECTION_KEY, selection);
  } catch {
    // Nothing to keep it in: the choice lasts for this opening.
  }
}

// A chosen option is drawn with a heavier, full-strength border and bolder
// words on the same surface: the ring doubles the border without moving
// anything. A ticked reason and a chosen outcome share it.
const TICKED_REASON =
  "aria-pressed:border-foreground aria-pressed:font-semibold aria-pressed:ring-1 aria-pressed:ring-foreground";
const CHOSEN_OPTION =
  "min-w-36 px-5 text-muted-foreground hover:text-foreground data-[state=on]:border-foreground data-[state=on]:bg-background data-[state=on]:font-semibold data-[state=on]:text-foreground data-[state=on]:ring-1 data-[state=on]:ring-foreground";

// The Single / Multiple switch is a segmented control: one pill-shaped
// track, and the chosen option a raised pill inside it. On a touchscreen
// each option's tap area reaches the track's edges, top and bottom.
const SEGMENT_TRACK = "shrink-0 gap-0 rounded-full border bg-muted p-1";
const SEGMENT =
  "relative h-8 rounded-full px-4 text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:font-semibold data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:hover:bg-background pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:-inset-y-1.5 pointer-coarse:after:content-['']";

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
  /** The switch between one reason and several, named for a screen reader. */
  selection: string;
  /** The switch's option where a tap on a reason confirms with it. */
  single: ReactNode;
  /** The switch's option where reasons are ticked, then confirmed together. */
  multiple: ReactNode;
  /** The typed reason's placeholder. */
  placeholder: string;
  /** In place of the composer while a promise from `onConfirm` is pending. */
  saving: string;
  /**
   * Under the composer when a promise from `onConfirm` rejects: a line, or
   * a function given what it rejected with, for a host whose rejection says
   * why.
   */
  failed: string | ((cause: unknown) => string);
}

const DEFAULT_LABELS: CandidateDecisionReasonSheetLabels = {
  cancel: "Cancel",
  speak: "Tap to speak",
  typeInstead: "or type instead",
  reasons: "Or pick a reason",
  selection: "How many reasons",
  single: "Single",
  multiple: "Multiple",
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
  /**
   * The line under the question, which also describes the sheet to a screen
   * reader. A function is given how reasons are being picked, for a line
   * that says "pick a reason" or "pick one or more".
   */
  subtitle?: ReactNode | ((selection: CandidateDecisionReasonSelection) => ReactNode);
  /** The dictation overlay's title, such as "Why no on Mei Tanaka?". */
  voiceTitle?: string;
  /**
   * One-tap reasons, already worded. Picking one confirms with it; with
   * several picked at once (see `multipleReasons`), the bottom button does.
   */
  reasons?: readonly string[];
  /**
   * With two or more `reasons`, the sheet offers a switch between Single,
   * where a tap on a reason confirms with it, and Multiple, where reasons
   * are ticked and the bottom button confirms with them all. `false` leaves
   * the switch out, and a tap always confirms.
   */
  multipleReasons?: boolean;
  /**
   * Which of the two the switch is on, for a host that keeps the choice
   * itself, with `onReasonSelectionChange`. Left out, the sheet keeps it:
   * it opens on `defaultReasonSelection`, or on what this person last chose
   * in this browser session.
   */
  reasonSelection?: CandidateDecisionReasonSelection;
  /** Where the switch starts until someone chooses. `single` when left out. */
  defaultReasonSelection?: CandidateDecisionReasonSelection;
  onReasonSelectionChange?: (selection: CandidateDecisionReasonSelection) => void;
  /**
   * Called with the reason a person spoke, typed or picked, trimmed, or with
   * none when they skipped. Several reasons arrive as one line, joined with
   * "; ", and each on its own in the second argument's `reasons`, for a host
   * that keeps them apart. The host saves the decision and closes the sheet.
   * It may return a promise: while that is pending the sheet shows
   * `labels.saving` in place of the composer and the bottom button is
   * disabled, though the sheet can still be closed; if it rejects, the
   * composer comes back with a typed or spoken reason still in it, ticked
   * reasons still ticked, and `labels.failed` under it.
   */
  onConfirm: (reason: string | undefined, answer: CandidateDecisionReasonAnswer) => unknown;
  /**
   * Takes Skip away, so the only ways out are a reason or the close button.
   * A reason is optional without it: encouraged, never demanded.
   */
  reasonRequired?: boolean;
  /** Skip's wording, such as "Skip — just reject Mei Tanaka". */
  skipLabel?: ReactNode;
  /**
   * The bottom button's wording once reasons are ticked, when it confirms
   * with them in Skip's place, such as "Reject Mei Tanaka". A function is
   * given the ticked reasons, for a label that counts them.
   */
  confirmLabel?: ReactNode | ((reasons: readonly string[]) => ReactNode);
  /**
   * Host controls for what the decision does, under the reasons and over a
   * rule, such as whether the person has been contacted already. They leave
   * the screen while a save is pending. Their state stays the host's, read
   * when `onConfirm` runs.
   */
  outcome?: ReactNode;
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

function defaultSubtitle(
  candidateName: string | undefined,
  hasReasons: boolean,
  selection: CandidateDecisionReasonSelection,
): string {
  const whose = candidateName ? ` for ${candidateName}` : "";
  if (!hasReasons) return `Give your reason${whose}.`;
  return selection === "multiple" ? `Give your reason${whose}, or pick one or more.` : `Give your reason${whose}, or pick one.`;
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

function defaultConfirmLabel(decision: CandidateDecisionChoice | undefined): string {
  if (decision === "yes") return "Mark Yes";
  if (decision === "no") return "Mark No";
  return "Confirm";
}

/**
 * The voice-first "Why?" asked once a reviewer has decided: speaking the
 * reason is the default, a suggested reason is one tap, and typing is a tap
 * away. Each of them calls `onConfirm` with that reason; Skip calls it with
 * none; the close button and Escape call `onClose`, and nothing is decided.
 *
 * With two or more suggested reasons, a switch over them chooses between
 * Single, where a tap on a reason confirms with it, and Multiple, where a
 * tap ticks or unticks a reason. Once any are ticked the bottom button
 * confirms with them in Skip's place, and a spoken or typed reason is added
 * to them. The sheet opens on Single, then on whichever the person last
 * chose in this browser session; `multipleReasons={false}` leaves the switch
 * out.
 *
 * The switch is a segmented control: a pill-shaped track with the chosen
 * option raised inside it, each option a radio to a screen reader. A ticked
 * reason has a heavier border, bolder words and a tick. Rules set the
 * reasons' heading row, the host's `outcome` and the bottom bar apart.
 *
 * The mic and the composer are the kit's `Chat` in its voice-first empty
 * state, with the reasons under it, inside the kit's `Dialog`, so the sheet
 * keeps its focus when it opens from another dialog, such as a candidate's
 * profile. Dictation is wired as everywhere else in this library: the kit's
 * mic uses the transport of the host's `DictationProvider`
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
 * `decision` is given, its reasons
 * `data-slot="candidate-decision-reason-sheet-reasons"` with
 * `data-selection`, the host's `outcome`
 * `data-slot="candidate-decision-reason-sheet-outcome"`, and its bottom bar
 * `data-slot="candidate-decision-reason-sheet-footer"`.
 */
export function CandidateDecisionReasonSheet({ open, ...sheet }: CandidateDecisionReasonSheetProps) {
  // A host clears its decision as it closes the sheet, and the wording goes
  // with it: closed, the sheet is gone at once rather than fade out reworded.
  if (!open) return null;
  return <OpenReasonSheet {...sheet} />;
}

/**
 * The sheet while it is open: mounted afresh each time, so a draft, ticked
 * reasons, the switch to typing and a failed save never carry over to the
 * next person.
 */
function OpenReasonSheet({
  onClose,
  decision,
  candidateName,
  title,
  subtitle,
  voiceTitle,
  reasons = [],
  multipleReasons = true,
  reasonSelection,
  defaultReasonSelection = "single",
  onReasonSelectionChange,
  onConfirm,
  reasonRequired = false,
  skipLabel,
  confirmLabel,
  outcome,
  footer,
  actions,
  voice = true,
  voiceLang,
  labels,
}: Omit<CandidateDecisionReasonSheetProps, "open">) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const dictation = useDictationSupport();
  const reasonsLabelId = useId();
  // What had focus when the sheet opened, usually the Yes or No that asked.
  const opener = useRef<Element | null>(null);
  const [saving, setSaving] = useState(false);
  // What a save rejected with, for the line that says it failed.
  const [failure, setFailure] = useState<{ cause: unknown } | null>(null);
  // A second tap before the first re-render must not confirm twice.
  const inFlight = useRef(false);
  const [ownSelection, setOwnSelection] = useState<CandidateDecisionReasonSelection>(
    () => rememberedSelection() ?? defaultReasonSelection,
  );
  const [ticked, setTicked] = useState<ReadonlySet<string>>(() => new Set());

  // The same reason twice would be one chip drawn twice.
  const chips = [...new Set(reasons.map((reason) => reason.trim()).filter(Boolean))];
  // One reason leaves nothing to pick several of.
  const selectable = multipleReasons && chips.length > 1;
  const selection: CandidateDecisionReasonSelection = selectable ? reasonSelection ?? ownSelection : "single";
  // In the order shown, whatever order they were ticked in.
  const picked = selection === "multiple" ? chips.filter((reason) => ticked.has(reason)) : [];

  const heading = shown(title) ? title : defaultTitle(decision);
  const description = typeof subtitle === "function"
    ? subtitle(selection)
    : subtitle === undefined
      ? defaultSubtitle(candidateName, chips.length > 0, selection)
      : subtitle;
  const described = shown(description);

  const changeSelection = (next: CandidateDecisionReasonSelection) => {
    // A tap confirms again, so nothing stays ticked behind it.
    if (next === "single") setTicked(new Set());
    if (reasonSelection === undefined) {
      setOwnSelection(next);
      rememberSelection(next);
    }
    onReasonSelectionChange?.(next);
  };

  const toggle = (reason: string) => {
    setTicked((current) => {
      const next = new Set(current);
      if (!next.delete(reason)) next.add(reason);
      return next;
    });
  };

  /** Confirms with the ticked reasons, then `words`: a tapped, spoken or typed reason. */
  const confirm = async (words?: string) => {
    if (inFlight.current) return;
    setFailure(null);
    const given = words && !picked.includes(words) ? [...picked, words] : picked;
    try {
      const result = onConfirm(given.length > 0 ? given.join(REASON_SEPARATOR) : undefined, { reasons: given });
      if (isPromiseLike(result)) {
        inFlight.current = true;
        setSaving(true);
        await result;
      }
    } catch (cause) {
      setFailure({ cause });
      // The composer puts a typed or spoken reason back when it sees this.
      throw cause;
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  // Ticked reasons arm the bottom button, which then confirms with them, under their own wording.
  const armed = picked.length > 0;
  // Where a reason is required there is no Skip, but ticked reasons still need their button.
  const hasBottomButton = !reasonRequired || selection === "multiple";
  const hasBottomRow = shown(actions) || hasBottomButton;
  const confirmWords = typeof confirmLabel === "function" ? confirmLabel(picked) : confirmLabel;

  const reasonChips = chips.length > 0 ? (
    <Stack data-slot="candidate-decision-reason-sheet-reasons" data-selection={selection} gap="md">
      {/* The reasons' heading row, on a rule of its own where the switch sits beside it. */}
      <Stack
        direction="horizontal"
        gap="sm"
        align="center"
        justify="between"
        wrap
        {...(selectable ? { border: "bottom" as const, paddingBottom: "md" as const } : {})}
      >
        <Text as="p" id={reasonsLabelId} size="sm" tone="muted">{text.reasons}</Text>
        {selectable ? (
          <ToggleGroup
            type="single"
            size="sm"
            value={selection}
            // Pressing the chosen one again leaves it chosen.
            onValueChange={(next) => {
              if (next === "single" || next === "multiple") changeSelection(next);
            }}
            aria-label={text.selection}
            className={SEGMENT_TRACK}
          >
            <ToggleGroupItem value="single" className={SEGMENT}>{text.single}</ToggleGroupItem>
            <ToggleGroupItem value="multiple" className={SEGMENT}>{text.multiple}</ToggleGroupItem>
          </ToggleGroup>
        ) : null}
      </Stack>
      <Suggestions role="group" aria-labelledby={reasonsLabelId} layout="wrap">
        {chips.map((reason) => (selection === "multiple" ? (
          // A toggle: ticked reasons wait for the bottom button.
          <Suggestion
            key={reason}
            suggestion={reason}
            aria-pressed={ticked.has(reason)}
            className={TICKED_REASON}
            onClick={toggle}
          >
            {reason}
            {ticked.has(reason) ? <Icon icon={Check} size="sm" /> : null}
          </Suggestion>
        ) : (
          <Suggestion
            key={reason}
            suggestion={reason}
            // A failed save shows as `labels.failed`; the host has the rejection itself.
            onClick={(tapped) => void confirm(tapped).catch(() => undefined)}
          />
        )))}
      </Suggestions>
    </Stack>
  ) : null;

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

          <Stack direction="vertical" gap="none" grow overflow="y-auto" paddingX="md">
            {/*
              A centred column: the composer would otherwise run edge to edge
              on a wide screen. Its own margins centre it in the height while
              there is room and give way once it is taller than the sheet, so
              its top can always be scrolled to; centring it from the scroller
              would put a tall column's heading out of reach.
            */}
            <Stack gap="none" centered width="full" maxWidth="xl" paddingBottom="md" className="my-auto">
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
                  error={failure ? (typeof text.failed === "function" ? text.failed(failure.cause) : text.failed) : null}
                  defaultMode={voice && dictation ? "voice" : "text"}
                  voice={voice}
                  voiceLang={voiceLang}
                  voiceTitle={voiceTitle ?? defaultVoiceTitle(decision, candidateName, heading)}
                  voiceHeroLabel={text.speak}
                  voiceHeroSwitchLabel={text.typeInstead}
                  emptyTitle={heading}
                  emptySubtitle={described ? description : undefined}
                  placeholder={text.placeholder}
                  emptyFooter={reasonChips || shown(outcome) ? (
                    <Stack gap="md">
                      {reasonChips}
                      {shown(outcome) ? (
                        <Stack data-slot="candidate-decision-reason-sheet-outcome" border="top" paddingTop="md">
                          {outcome}
                        </Stack>
                      ) : null}
                    </Stack>
                  ) : undefined}
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
                  {hasBottomButton ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      // Where a reason is required, the button waits for one to be ticked.
                      disabled={saving || (reasonRequired && !armed)}
                      // A failed save shows as `labels.failed`; the host has the rejection itself.
                      onClick={() => void confirm().catch(() => undefined)}
                    >
                      {armed || reasonRequired
                        ? (shown(confirmWords) ? confirmWords : defaultConfirmLabel(decision))
                        : (shown(skipLabel) ? skipLabel : defaultSkipLabel(decision))}
                      <Icon icon={ArrowRight} size="md" marginStart="sm" />
                    </Button>
                  ) : null}
                </Stack>
              ) : null}
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/** One option of a `CandidateDecisionOutcomeChoice`. */
export interface CandidateDecisionOutcomeOption<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
}

export interface CandidateDecisionOutcomeChoiceProps<TValue extends string = string> {
  /** The caption over the options, which also names them to a screen reader. */
  label: ReactNode;
  options: readonly CandidateDecisionOutcomeOption<TValue>[];
  /** The chosen option. */
  value: TValue;
  /** Called with an option that isn't the chosen one. */
  onChange: (value: TValue) => void;
  disabled?: boolean;
}

/**
 * A captioned choice for the sheet's `outcome`: what else the decision does,
 * such as whether the person has been contacted already. One option is
 * always chosen, drawn as a ticked reason is, with a heavier border and
 * bolder words; each is a radio in a group the caption names. The host owns
 * the options, their wording and what each one does.
 *
 * The root is marked `data-slot="candidate-decision-outcome-choice"`.
 */
export function CandidateDecisionOutcomeChoice<TValue extends string = string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: CandidateDecisionOutcomeChoiceProps<TValue>) {
  const labelId = useId();
  return (
    <Stack data-slot="candidate-decision-outcome-choice" gap="sm">
      <Text as="p" id={labelId} size="sm" tone="muted">{label}</Text>
      <Stack direction="horizontal">
        <ToggleGroup
          type="single"
          variant="outline"
          value={value}
          // Pressing the chosen one again leaves it chosen.
          onValueChange={(next) => {
            const option = options.find((candidate) => candidate.value === next);
            if (option && option.value !== value) onChange(option.value);
          }}
          disabled={disabled}
          aria-labelledby={labelId}
          className="flex-wrap justify-start gap-2"
        >
          {options.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value} className={CHOSEN_OPTION}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Stack>
    </Stack>
  );
}
