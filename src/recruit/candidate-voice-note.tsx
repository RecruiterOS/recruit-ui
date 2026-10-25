"use client";

import { HiddenControl } from "@epicbagel/saas-kit/primitives/hidden-control";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { VoiceDictationButton } from "@epicbagel/saas-kit/primitives/voice-dictation-button";
import { Mic } from "lucide-react";
import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";

import { CandidateIconAction } from "./candidate-header-actions";

export interface UseCandidateVoiceNoteOptions {
  /** Called with the transcript when a person finishes dictating. */
  onCommit: (text: string) => void | Promise<void>;
  /** The trigger's tooltip and the dictation overlay's title. */
  title?: string;
  /** The small caption in the dictation overlay. */
  caption?: string;
}

export interface CandidateVoiceNote {
  /** A quiet mic icon action, for a card's header actions. */
  trigger: ReactNode;
  /**
   * The dictation control itself, visually hidden. Render it once, anywhere
   * inside the card: the trigger and `open` drive it.
   */
  control: ReactNode;
  /** Opens the dictation overlay, for a host control of its own. */
  open: () => void;
}

/**
 * Voice notes on a candidate card: a visible mic trigger and the hidden
 * dictation control it opens, already wired together with no host ref.
 *
 * Dictation uses the browser's speech recognition. Where the browser has
 * none, the control renders nothing and the trigger does nothing. Neither
 * click reaches a surrounding card. The host owns saving the note and
 * anything that reacts to it.
 */
export function useCandidateVoiceNote({
  onCommit,
  title = "Leave a note",
  caption = "listening",
}: UseCandidateVoiceNoteOptions): CandidateVoiceNote {
  // The dictation button opens its overlay on any click inside it, so a
  // programmatic click on this empty anchor is the whole wiring.
  const anchor = useRef<HTMLElement>(null);
  const open = useCallback(() => {
    anchor.current?.click();
  }, []);

  return {
    open,
    trigger: <CandidateIconAction icon={Mic} title={title} onClick={open} />,
    control: (
      <HiddenControl onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
        <VoiceDictationButton
          size="sm"
          title={title}
          caption={caption}
          onCommit={(text) => {
            void onCommit(text);
          }}
        >
          <Text variant="inherit" as="span" ref={anchor} />
        </VoiceDictationButton>
      </HiddenControl>
    ),
  };
}
