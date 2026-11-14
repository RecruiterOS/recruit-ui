/**
 * The attributes a shared profile passes on to a root: an id, a style, and
 * any `data-` or `aria-` attribute (the class is merged by the caller).
 * Everything else is dropped. A shared profile is opened by people outside
 * the host's organisation, and React writes an unknown prop into the page as
 * an attribute, so a field spread in by mistake, off a record or a view
 * model, would otherwise be there to read in the page's source.
 *
 * Shared by the shared profile and its sections; it isn't part of the
 * public API.
 */
export function sharedProfileRootAttributes(props: object): Record<string, unknown> {
  const attributes: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(props)) {
    if (name === "id" || name === "style" || name.startsWith("data-") || name.startsWith("aria-")) {
      attributes[name] = value;
    }
  }
  return attributes;
}

/**
 * Lets a word longer than its line break anywhere, so a pasted link in a
 * note, or an unbroken name, wraps inside its section and isn't cut off at
 * the profile's edge. It is inherited, so a root that sets it covers
 * everything under it.
 */
export const SHARED_PROFILE_WRAP = "[overflow-wrap:anywhere]";
