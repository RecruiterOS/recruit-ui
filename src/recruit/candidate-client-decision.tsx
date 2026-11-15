"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from "react";

import {
  CandidateDecisionButtons,
  type CandidateDecisionChoice,
} from "./candidate-decision-buttons";
import { CandidateDecisionReasonDialog } from "./candidate-decision-reason-dialog";
import type { CandidateDecisionReasonSheetProps } from "./candidate-decision-reason-sheet";
import { CandidateReviewActionRow } from "./candidate-review-action-row";

type LazySheetProps = CandidateDecisionReasonSheetProps & {
  /** Called when the sheet couldn't be downloaded, so the row can ask another way. */
  onUnavailable: () => void;
};

/** Stands in for a sheet that wouldn't download: it draws nothing and tells the row. */
function SheetUnavailable({ onUnavailable }: LazySheetProps) {
  useEffect(() => onUnavailable(), [onUnavailable]);
  return null;
}

// The voice-first sheet brings the kit's Chat with it, so only a row that
// asks through it downloads it. A download that fails must not take the
// page the row sits on down with it: the row then asks in its dialog.
const CandidateDecisionReasonSheet = lazy<ComponentType<LazySheetProps>>(() =>
  import("./candidate-decision-reason-sheet").then(
    (module) => ({ default: module.CandidateDecisionReasonSheet }),
    () => ({ default: SheetUnavailable }),
  ),
);

/** Host-owned wording for a client's decision on a candidate. */
export interface CandidateClientDecisionLabels {
  yes: ReactNode;
  no: ReactNode;
  /** The recorded answer, such as "You said Yes". */
  saidYes: ReactNode;
  saidNo: ReactNode;
  /** Reopens the question once an answer is recorded. */
  change: ReactNode;
  /** The dialog's title for each answer, given the candidate's name. */
  yesTitle: (name: string) => ReactNode;
  noTitle: (name: string) => ReactNode;
  yesPlaceholder: string;
  noPlaceholder: string;
  confirmYes: ReactNode;
  confirmNo: ReactNode;
  /** The dialog's reason label. Defaults to "Why?", or to "Why? (optional)" with `reasonOptional`. */
  reason: ReactNode;
  /**
   * Shown under the buttons when saving fails: a line, or a function given
   * what `onDecide` rejected with, for a host whose rejection says why.
   */
  failed: ReactNode | ((cause: unknown) => ReactNode);
  /**
   * The recorded answer where it is only shown (`readOnly`), to someone other
   * than the client, such as "Said Yes". Optional in the type, like the two
   * after it, so code that builds this whole object needn't change.
   */
  readOnlyYes?: ReactNode;
  readOnlyNo?: ReactNode;
  /** A `readOnly` row the client hasn't answered. */
  unanswered?: ReactNode;
}

const DEFAULT_LABELS: CandidateClientDecisionLabels = {
  yes: "Yes",
  no: "No",
  saidYes: "You said Yes",
  saidNo: "You said No",
  change: "Change",
  yesTitle: (name) => `Yes to ${name}`,
  noTitle: (name) => `No to ${name}`,
  yesPlaceholder: "What stands out?",
  noPlaceholder: "What's missing?",
  confirmYes: "Save Yes",
  confirmNo: "Save No",
  reason: "Why?",
  failed: "That didn't save. Try again.",
  readOnlyYes: "Said Yes",
  readOnlyNo: "Said No",
  unanswered: "No answer yet",
};

/** How a client's decision asks for its reason. */
export type CandidateClientDecisionReasonPrompt = "dialog" | "sheet";

/**
 * The voice-first sheet's own settings, for a row that asks through it
 * (`reasonPrompt="sheet"`): its wording, what sits in its footer, and its
 * dictation. The row itself supplies the answer, the candidate's name, the
 * one-tap reasons and whether a reason is required.
 */
export type CandidateClientDecisionSheetProps = Pick<
  CandidateDecisionReasonSheetProps,
  "title" | "subtitle" | "voiceTitle" | "skipLabel" | "footer" | "actions" | "voice" | "voiceLang" | "labels"
>;

export interface CandidateClientDecisionProps {
  /** The candidate's name as the dialog should say it. */
  candidateName: string;
  /** The answer already recorded, if any. */
  decision?: CandidateDecisionChoice | null;
  /** The reason recorded with it, shown under the answer. */
  reason?: ReactNode;
  /**
   * Saves the answer and its reason. The dialog stays open, its buttons
   * disabled, until the promise settles, then closes. When the promise
   * rejects, the buttons come back with an error line under them. The reason
   * is an empty string when `reasonOptional` let the client answer without
   * one.
   */
  onDecide: (decision: CandidateDecisionChoice, reason: string) => Promise<void>;
  /** One-tap reasons for each answer, already worded. */
  suggestions?: { yes?: readonly string[]; no?: readonly string[] };
  /**
   * Lets the client answer without a reason: the dialog still asks why, and
   * saves with none given. The reason is required without it.
   */
  reasonOptional?: boolean;
  /**
   * How the reason is asked for. `dialog` (the default) is a typed reason in
   * `CandidateDecisionReasonDialog`. `sheet` is the voice-first
   * `CandidateDecisionReasonSheet`: speaking is the default, a suggested
   * reason is one tap, typing is a tap away, and Skip saves with no reason
   * where `reasonOptional` allows it. The sheet holds itself on a saving
   * state while `onDecide`'s promise is pending and, when it rejects, keeps
   * the reason and says so there, so the row shows no error of its own. If
   * the sheet can't be downloaded, the row asks in the dialog.
   */
  reasonPrompt?: CandidateClientDecisionReasonPrompt;
  /**
   * The sheet's own settings for `reasonPrompt="sheet"`, or a function of
   * the answer being explained that returns them, for wording that names
   * the answer.
   */
  reasonSheet?:
    | CandidateClientDecisionSheetProps
    | ((decision: CandidateDecisionChoice) => CandidateClientDecisionSheetProps);
  /**
   * Shows the answer and takes none, for someone looking at a client's
   * shortlist who can't answer for them: the recorded answer in words
   * (`labels.readOnlyYes`, `labels.readOnlyNo`) with its reason, or
   * `labels.unanswered`, and no Yes, No or Change. `onDecide` is never called.
   */
  readOnly?: boolean;
  /**
   * Holds Yes, No and Change without hiding them, such as while the page
   * the row sits on is loading someone else. A reason being asked for when
   * it turns on is dropped, and nothing is decided.
   */
  disabled?: boolean;
  /**
   * `default` is the action row of a review card: inset like the card, under
   * a keyline. `none` sits the row flush, with no keyline, in a container
   * that already pads and rules it, such as a section of a profile.
   */
  padding?: "default" | "none";
  labels?: Partial<CandidateClientDecisionLabels>;
}

/**
 * A client's Yes or No on a candidate, with why: the action row of a card on
 * a shortlist the client reviews.
 *
 * With no answer yet it shows Yes and No as equal buttons; pressing one asks
 * for the reason and only then calls `onDecide`. The reason is typed in
 * `CandidateDecisionReasonDialog`, or with `reasonPrompt="sheet"` spoken,
 * picked or typed in the voice-first `CandidateDecisionReasonSheet`, which is
 * downloaded only by a row that asks through it. The reason is required
 * unless `reasonOptional` lets the answer be saved without one. Once an
 * answer is recorded (`decision`) it shows that answer in words with its
 * reason and a Change control that asks again. The host owns the record: the
 * component saves nothing and marks nothing recorded before `decision` says
 * so.
 *
 * `readOnly` shows the same row to someone who can't answer for the client:
 * the answer in words with its reason, or that there is none yet, and no
 * controls. `disabled` keeps the controls and holds them. They are held
 * while a save is on its way too, so closing what asks for the reason and
 * answering again can't send two answers at once; a save that fails after
 * it was closed says so under the buttons.
 *
 * Pass it as `CandidateReviewCard`'s `actions`: its root is a
 * `CandidateReviewActionRow`, marked `data-slot="candidate-client-decision"`
 * with the recorded answer in `data-decision`, and `data-read-only` on a
 * read-only row. With `padding="none"` the root is a plain row with the same
 * marks, for a container that pads it.
 */
export function CandidateClientDecision({
  candidateName,
  decision = null,
  reason,
  onDecide,
  suggestions,
  reasonOptional = false,
  reasonPrompt = "dialog",
  reasonSheet,
  readOnly = false,
  disabled = false,
  padding = "default",
  labels,
}: CandidateClientDecisionProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [asking, setAsking] = useState<CandidateDecisionChoice | null>(null);
  const [changing, setChanging] = useState(false);
  // What a save rejected with, for the line that says it failed.
  const [failure, setFailure] = useState<{ cause: unknown } | null>(null);
  const failed = failure !== null;
  const [sheetUnavailable, setSheetUnavailable] = useState(false);
  // A save on its way. What asks for the reason can be closed while it is,
  // so the buttons are held until it settles: two answers never cross.
  const [saving, setSaving] = useState(false);
  // What is being asked now, for a save that settles after its render.
  const askingNow = useRef(asking);
  askingNow.current = asking;

  // A reason being given is about the person on screen. When the host holds
  // the row, such as while another person's page opens, what asks for it
  // closes, and nothing is decided.
  useEffect(() => {
    if (disabled) setAsking(null);
  }, [disabled]);

  const submit = async (why: string) => {
    if (!asking) return;
    setFailure(null);
    setSaving(true);
    try {
      await onDecide(asking, why);
      setAsking(null);
      setChanging(false);
    } catch (cause) {
      setAsking(null);
      setFailure({ cause });
    } finally {
      setSaving(false);
    }
  };

  const close = () => {
    setAsking(null);
    setFailure(null);
  };

  // Wording that names the answer is asked for once there is one to name.
  const sheet = typeof reasonSheet === "function" ? (asking ? reasonSheet(asking) : undefined) : reasonSheet;
  const held = disabled || saving;

  const prompt =
    reasonPrompt === "sheet" && !sheetUnavailable ? (
      // Fetched as the row mounts, so a press opens the sheet at once.
      <Suspense fallback={null}>
        <CandidateDecisionReasonSheet
          open={asking !== null}
          decision={asking ?? undefined}
          candidateName={candidateName}
          reasons={asking === "no" ? suggestions?.no : suggestions?.yes}
          reasonRequired={!reasonOptional}
          // Setting by setting: nothing else a host's object carries can
          // reopen the sheet, lift its rule on the reason or rename who it
          // is about.
          title={sheet?.title}
          subtitle={sheet?.subtitle}
          voiceTitle={sheet?.voiceTitle}
          skipLabel={sheet?.skipLabel}
          footer={sheet?.footer}
          actions={sheet?.actions}
          voice={sheet?.voice}
          voiceLang={sheet?.voiceLang}
          labels={sheet?.labels}
          onUnavailable={() => setSheetUnavailable(true)}
          // A rejected save stays in the sheet, which keeps the reason and
          // says it didn't save: nothing is recorded and nothing is lost.
          onConfirm={async (why) => {
            if (!asking) return;
            setSaving(true);
            try {
              await onDecide(asking, why ?? "");
              setAsking(null);
              setChanging(false);
            } catch (cause) {
              // Closed meanwhile, the sheet can't say so: the row does.
              if (askingNow.current === null) setFailure({ cause });
              throw cause;
            } finally {
              setSaving(false);
            }
          }}
          onClose={close}
        />
      </Suspense>
    ) : (
      <CandidateDecisionReasonDialog
        open={asking !== null}
        title={asking === "no" ? text.noTitle(candidateName) : text.yesTitle(candidateName)}
        suggestions={asking === "no" ? suggestions?.no : suggestions?.yes}
        placeholder={asking === "no" ? text.noPlaceholder : text.yesPlaceholder}
        confirmLabel={asking === "no" ? text.confirmNo : text.confirmYes}
        reasonOptional={reasonOptional}
        onSubmit={submit}
        onClose={close}
        // The dialog words the field itself ("Why?", or "Why? (optional)")
        // unless the host has.
        labels={labels?.reason === undefined ? undefined : { reason: labels.reason }}
      />
    );

  // A failed save shows the buttons again, with the error under them.
  const recorded = decision !== null && (readOnly || (!changing && !failed));
  const said =
    decision === "yes"
      ? readOnly ? text.readOnlyYes : text.saidYes
      : readOnly ? text.readOnlyNo : text.saidNo;

  const content = recorded ? (
    <>
      <FlexItem grow minWidth="zero">
        <Stack direction="horizontal" gap="sm" align="center">
          <Icon icon={decision === "yes" ? ThumbsUp : ThumbsDown} size="sm" />
          <Text as="span" size="sm" weight="semibold">
            {said}
          </Text>
        </Stack>
        {reason != null && reason !== "" ? (
          <Text size="sm" tone="muted" marginTop="xs">
            {reason}
          </Text>
        ) : null}
      </FlexItem>
      {readOnly ? null : (
        <Button type="button" variant="ghost" size="sm" disabled={held} onClick={() => setChanging(true)}>
          {text.change}
        </Button>
      )}
    </>
  ) : readOnly ? (
    <Text size="sm" tone="muted">
      {text.unanswered}
    </Text>
  ) : (
    <FlexItem grow minWidth="zero">
      <CandidateDecisionButtons
        stretch
        disabled={held}
        labels={{ yes: text.yes, no: text.no }}
        onChoose={(choice) => {
          setFailure(null);
          setAsking(choice);
        }}
      >
        {prompt}
      </CandidateDecisionButtons>
      {failure ? (
        <Text size="sm" tone="destructive" marginTop="xs" role="alert">
          {typeof text.failed === "function" ? text.failed(failure.cause) : text.failed}
        </Text>
      ) : null}
    </FlexItem>
  );

  const marks = {
    "data-slot": "candidate-client-decision",
    "data-decision": decision ?? "none",
    "data-read-only": readOnly || undefined,
  };

  if (padding === "none") {
    return (
      <Stack
        {...marks}
        direction="horizontal"
        gap="sm"
        align="center"
        wrap
        // Like the action row: a click here never reaches a clickable card.
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        {content}
      </Stack>
    );
  }

  return (
    <CandidateReviewActionRow {...marks} isolateClicks>
      {content}
    </CandidateReviewActionRow>
  );
}
