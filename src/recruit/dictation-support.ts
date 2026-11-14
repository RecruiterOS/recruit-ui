import { useDictation } from "@epicbagel/saas-kit/hooks/use-dictation";
import { useEffect, useState } from "react";

/**
 * Whether dictation can run here, as the kit's own mic decides it: the
 * host's transport from a `DictationProvider`, or else the browser's speech
 * recognition. `null` until the first effects have run, which is when the
 * kit finds out.
 */
export function useDictationSupport(): boolean | null {
  const { supported } = useDictation();
  const [known, setKnown] = useState(false);
  // Declared after the kit's own effect, so both land in one render.
  useEffect(() => setKnown(true), []);
  return known ? supported : null;
}
