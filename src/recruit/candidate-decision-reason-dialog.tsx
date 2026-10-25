"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@epicbagel/saas-kit/primitives/dialog";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Label } from "@epicbagel/saas-kit/primitives/label";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";

/** Host-owned wording for the dialog's fixed parts. */
export interface CandidateDecisionReasonDialogLabels {
  /** The eyebrow over the suggestion chips. */
  suggestions: ReactNode;
  /** The reason field's label. */
  reason: ReactNode;
  cancel: ReactNode;
}

const DEFAULT_LABELS: CandidateDecisionReasonDialogLabels = {
  suggestions: "Tap a signal to use it as the reason",
  reason: "Why?",
  cancel: "Cancel",
};

/** Joins a tapped suggestion onto the reason typed so far. */
const SUGGESTION_SEPARATOR = " · ";

export interface CandidateDecisionReasonDialogProps {
  open: boolean;
  /** Names the decision and the candidate, such as "Reject: Mei Tanaka". */
  title: ReactNode;
  /** One-tap reasons, already worded. Tapping one adds it to the reason. */
  suggestions?: readonly string[];
  placeholder: string;
  confirmLabel: ReactNode;
  /** `destructive` for a rejection, `default` to move forward. */
  confirmTone?: "default" | "destructive";
  /**
   * Called with the trimmed reason. The confirm button shows a spinner and
   * the dialog's buttons stay disabled until it settles; the host closes the
   * dialog once the decision is saved.
   */
  onSubmit: (reason: string) => Promise<void>;
  /** Called from Cancel, Escape and the close button. */
  onClose: () => void;
  labels?: Partial<CandidateDecisionReasonDialogLabels>;
  /** The reason field's id. A generated one is used when omitted. */
  id?: string;
}

/**
 * Asks why before a decision on a candidate is recorded: a required reason,
 * optionally started from one-tap suggestions.
 *
 * The reason resets each time the dialog opens. The host owns the decision,
 * its wording and what is saved; the root is the kit's dialog content and
 * keeps its `data-slot="dialog-content"`.
 */
export function CandidateDecisionReasonDialog(props: CandidateDecisionReasonDialogProps) {
  // Only generate an id when the host has not supplied one, so a host id
  // costs nothing.
  return props.id ? (
    <ReasonDialog {...props} id={props.id} />
  ) : (
    <ReasonDialogWithGeneratedId {...props} />
  );
}

function ReasonDialogWithGeneratedId(props: CandidateDecisionReasonDialogProps) {
  const id = useId();
  return <ReasonDialog {...props} id={id} />;
}

function ReasonDialog({
  open,
  title,
  suggestions = [],
  placeholder,
  confirmLabel,
  confirmTone = "default",
  onSubmit,
  onClose,
  labels,
  id,
}: CandidateDecisionReasonDialogProps & { id: string }) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReason("");
    setSubmitting(false);
  }, [open]);

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(reason.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle size="base">{title}</DialogTitle>
        </DialogHeader>
        <Stack direction="vertical" gap="sm">
          {suggestions.length > 0 && (
            <Stack gap="none">
              <Text as="div" variant="eyebrow" marginBottom="sm">
                {text.suggestions}
              </Text>
              <Stack direction="horizontal" gap="xs" wrap>
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    size="micro"
                    weight="normal"
                    interactive
                    onClick={() =>
                      setReason((current) => (current ? `${current}${SUGGESTION_SEPARATOR}${suggestion}` : suggestion))
                    }
                  >
                    {suggestion}
                  </Badge>
                ))}
              </Stack>
            </Stack>
          )}
          <Stack gap="xs">
            <Label htmlFor={id} appearance="eyebrow">
              {text.reason}
            </Label>
            <Textarea
              id={id}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder={placeholder}
              autoFocus
            />
          </Stack>
        </Stack>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {text.cancel}
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || reason.trim().length === 0}
            variant={confirmTone}
          >
            {submitting ? <Icon icon={Loader2} size="md" spin /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
