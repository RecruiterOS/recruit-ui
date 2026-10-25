// A compact control is sized for a mouse. On a coarse pointer (a touchscreen)
// it grows to a 44px touch target, whatever size it asked for; a mouse keeps
// the dense size. 44 CSS pixels rather than the kit's h-11 (2.75rem): below
// 768px the kit scales its root type to 87.5%, which makes h-11 38.5px on a
// phone, and the larger of the two where a host's root is bigger. min-height
// and min-width rather than a size, so a control already larger keeps its own.

/** On a coarse pointer, this element is at least 44px square. */
export const COARSE_POINTER_TOUCH_TARGET =
  "pointer-coarse:min-h-[max(44px,2.75rem)] pointer-coarse:min-w-[max(44px,2.75rem)]";

/** On a coarse pointer, every link and button inside this element is at least 44px square. */
export const COARSE_POINTER_TOUCH_TARGETS_WITHIN =
  "pointer-coarse:[&_a]:min-h-[max(44px,2.75rem)] pointer-coarse:[&_a]:min-w-[max(44px,2.75rem)] pointer-coarse:[&_button]:min-h-[max(44px,2.75rem)] pointer-coarse:[&_button]:min-w-[max(44px,2.75rem)]";
