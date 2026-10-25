import {
  CandidateIconAction
} from "./chunk-6DUL7U2Q.js";

// src/recruit/candidate-voice-note.tsx
import { HiddenControl } from "@epicbagel/saas-kit/primitives/hidden-control";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { VoiceDictationButton } from "@epicbagel/saas-kit/primitives/voice-dictation-button";
import { Mic } from "lucide-react";
import { useCallback, useRef } from "react";
import { jsx } from "react/jsx-runtime";
function useCandidateVoiceNote({
  onCommit,
  title = "Leave a note",
  caption = "listening"
}) {
  const anchor = useRef(null);
  const open = useCallback(() => {
    anchor.current?.click();
  }, []);
  return {
    open,
    trigger: /* @__PURE__ */ jsx(CandidateIconAction, { icon: Mic, title, onClick: open }),
    control: /* @__PURE__ */ jsx(HiddenControl, { onClick: (event) => event.stopPropagation(), children: /* @__PURE__ */ jsx(
      VoiceDictationButton,
      {
        size: "sm",
        title,
        caption,
        onCommit: (text) => {
          void onCommit(text);
        },
        children: /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", ref: anchor })
      }
    ) })
  };
}

export {
  useCandidateVoiceNote
};
