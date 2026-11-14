// src/recruit/dictation-support.ts
import { useDictation } from "@epicbagel/saas-kit/hooks/use-dictation";
import { useEffect, useState } from "react";
function useDictationSupport() {
  const { supported } = useDictation();
  const [known, setKnown] = useState(false);
  useEffect(() => setKnown(true), []);
  return known ? supported : null;
}

export {
  useDictationSupport
};
