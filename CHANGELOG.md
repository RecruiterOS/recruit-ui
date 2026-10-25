# Changelog

Every release of `@recruiteros/recruit-ui`, newest first. The package installs
from a GitHub commit, so pin the commit that carries the version you want.
Until 1.0, a minor release may change the public API; each such change is
listed under **Breaking**, with what to do instead.

## 0.10.1

### Fixed

- `CandidateReviewCard` shows its keyboard focus ring again. The card clips
  its content, and the ring sat outside the full-card trigger, so the clip
  cut all of it. The ring is now drawn inside the trigger's edge.
- `CandidateReviewCard` draws one rule between its facts (or insight) and a
  `CandidateReviewActionRow`, where the facts list's rule and the row's
  keyline used to stack about 12px apart. Under facts or an insight the card
  hides the row's keyline; with neither, the keyline stays. The facts are
  inset as far as the header and the action row, so their labels line up
  under the avatar instead of 6px to its left. The facts list carries
  `data-slot="candidate-review-card-facts"`, and the row's inline controls
  `data-slot="candidate-review-action-row-controls"`.
- `CandidateChannelActions` with `presentation="bar"` no longer cuts labels
  to a letter and an ellipsis on a narrow row. Its links share the row in
  equal parts, and a link with less than 4.5rem inside shows the glyph alone.
  Every link now carries the label as its accessible name (`aria-label`) and
  tooltip in both presentations, so a link that hides its text keeps both.
- Compact controls keep a 44px touch target on a touchscreen (a coarse
  pointer, `pointer-coarse:`); a mouse keeps the dense size. Every
  `CandidateChannelActions` link is at least 44px square there, compact icons
  (28px with a mouse) included, and in a `CandidateInlineCard` with
  `density="compact"` every link and button in `actions` is too, whatever
  size the host gave it. The floor is 44 CSS pixels (or 2.75rem, if the
  host's root type is larger) rather than the kit's `h-11`, because below
  768px the kit scales its root to 87.5%, which makes `h-11` 38.5px on a
  phone. A compact card's actions now sit in an element marked
  `data-slot="candidate-inline-card-actions"` with `display: contents`, so
  they lay out as before.
- `CallReconcileCard` with `onPickOther` no longer downloads its search-mode
  create and preview dialogs, or the drawer the kit's `ResponsiveDialog`
  renders on a phone. The dialogs are a chunk of their own, loaded only when
  a card in search mode mounts. They start closed, so nothing shows while
  the chunk loads, and a pick made before it arrives opens once it does.

## 0.10.0

### Added

- `CandidateProfileDialog` takes `presentation`: `dialog` (the default, as
  before) or `sheet`, which opens the profile as the kit's Sheet from the
  right on desktop and from the bottom below the kit's mobile breakpoint,
  with the same title, header, body, footer and close slots. The surface
  carries `data-presentation`, and a sheet `data-side`. A sheet is as wide as
  the centred dialog unless `contentClassName` widens it. The two differ in
  two ways: a dialog becomes a drawer below 1024px and a sheet moves to the
  bottom below 768px, and a sheet's footer stays one right-aligned row on a
  phone where a dialog's (`footerLayout="auto"`) becomes a two-column grid.
- `CandidateInlineCard` takes `density`: `comfortable` (the default, as
  before) or `compact`, one dense row with smaller padding, the name and
  lines centred on the avatar and every line truncated, for fixed-height list
  rows and board columns: give the card a height and its content centres in
  it. The root carries `data-density`.
- `CandidateActivityTimeline`: a person's history grouped by period, built
  on the kit's Timeline. Each row has a glyph, a title clamped to two lines,
  a line of context and a timestamp, and either a longer body behind a
  toggle or a link or button that opens something. A period can show a
  count beside its heading. Skeleton rows while loading and the kit's empty
  state ("No activity yet") when there is nothing.
- `CandidateChannelActions`: the host's ways to reach a person
  (`{ kind, href, label, icon }`) as round icon links or a labelled bar.
  Web links open in a new tab, and clicks never reach a surrounding card.
  Two channels may share a `kind`, such as two phone numbers.
- `CandidateCoverHeader` and `CandidateProfileHeader` take `padding="none"`,
  for a header that sits flush in a host-padded container. With no cover the
  header then doesn't clip, so focus rings at its edges stay whole.
- `CallReconcileCard` takes `suggestions`, the host's own controls for the
  people a call may be about, shown in place of the buttons `guesses`
  renders, and `onPickOther`, which hands picking a person to the host: the
  card then shows one button for the host's picker (labels `pickOther` and
  `pickHint`) instead of its own search, manual add, preview and create
  dialogs.

### Breaking

- `CallReconcileCardProps` is now a union: `CallReconcileCardBaseProps` with
  either `CallReconcileSearchProps` (the card's own search, as before:
  `searchPeople`, `onAttach`, `onCreateAttach` and `renderPreview` stay
  required together) or `CallReconcilePickerProps` (`onPickOther`). Passing
  props to the card works as before, but an interface can't extend a union,
  so `interface X extends CallReconcileCardProps` no longer compiles. Extend
  both halves instead: `interface X extends CallReconcileCardBaseProps,
  CallReconcileSearchProps`, or `CallReconcilePickerProps` for a host-owned
  picker.

## 0.9.0

The first release after 0.2.0; there were no 0.3.0 to 0.8.0 releases.

### Added

- Card lists and card controls: `CandidateCardList`,
  `CandidateCardColumnsToggle` with `useCandidateCardColumns`,
  `CandidateFavouriteButton` (with `idleTone`, `muted` by default or
  `inherit`, for the star while the person isn't a favourite),
  `CandidateProfileLinkButton`, `CandidateSharedProfileButton` and
  `CandidateContactChannelsMenu`.
- Jobs and the pipeline: `JobSummaryCard`, `JobClientBadge` and
  `CandidatePipelineCard`.
- Relationships and roles: `CandidateRelationshipCard`,
  `CandidateFilterChips`, `CandidateSignalMenu`, `CandidateSignalList`,
  `CandidateRoleMatchSummary`, `CandidateRoleMatchList`,
  `CandidateSuggestedRolesPanel`, `CandidateCareerHistoryPanel` and
  `CurrentCompanyPopover`.
- Review-card actions: `CandidateHeaderActions` with `CandidateIconAction`,
  `useCandidateVoiceNote`, `CandidateSelectableAvatar`,
  `CandidatePendingNote`, `CandidateReviewActionRow` (with `gap` and an
  `inline` or `split` `layout`), `CandidateDecisionButtons`,
  `CandidateDecisionReasonDialog`, `CandidateStageActions` and
  `CandidateStageSelect`.
- Calls: `CandidateCallList` and `CandidateCallCard` (a person's linked calls,
  each with an unlink confirmation and a check against open roles),
  `MatchedCallCard` (a call already linked to people, with a dialog that
  links one more) and `CallReconcileCard` (a call waiting for a person).
  `normalizeCallParticipants` and `normalizeCallSegments` turn raw lists into
  the cards' shapes; they also ship from
  `@recruiteros/recruit-ui/recruit/call-data`, a subpath without a client
  boundary, so a server can call them.
- A person's detail pane: `CandidateDetailLayout`, `CandidateDetailHeader`,
  `CandidateActionMenu`, `CandidateDetailTabs`, `CandidateDecisionSummary`,
  `CandidateJobEvidence`, `CandidateNoteList`, `CandidateNoteCard`,
  `CandidateNoteComposer`, `CandidateFactList` with `formatFactValue`,
  `CandidateContactDetails`, `CandidateChannelLog`, `CandidateDefinitionSection`,
  `CandidateOutreachComposer`, `CandidatePipelineList` and
  `CandidateSummaryBullets`. `CandidateActionMenu` is the one "…" menu: each
  item can carry its own `onSelect`, or the menu's `onSelect(id)` handles them
  all, and `CandidateSignalMenu` is the same menu with a signal's defaults.
- `CandidateEmptyCopy`, the one type every `empty` prop takes. Each of those
  props has a plain default ("No calls yet", "No notes yet", ...), so `empty`
  is optional everywhere, `CandidateCareerHistoryTimeline` included.
- `CandidateGradeBadge` takes `size`, `as`, `shrink`, `format` (`split` or
  `inline`), `appearance` (`badge` or `sentiment`) and `sentiment`.
- `CandidateQuote` takes `collapsible`, which clamps a long excerpt behind a
  show-more toggle.

### Changed

- The UI primitives come from `@epicbagel/saas-kit` (MIT) instead of a copy
  inside this repository. The package keeps the kit external, so the built
  files import it by package name, as the registry sources do.

### Breaking

- `@epicbagel/saas-kit` (`^1.0.0`) is a peer dependency. Install it
  alongside, so the application and every library that renders a primitive
  share one copy of the kit and its Dialog and Tooltip context.
- `lucide-react` moved from a dependency to a peer dependency
  (`>=0.400.0 <2`). Install it alongside, so the application and the package
  share one copy of the icon set.
- The Radix packages, `class-variance-authority`, `clsx`, `tailwind-merge`,
  `vaul` and `react-responsive` are no longer dependencies; the kit brings
  what it needs.
- Tailwind v4 consumers add `@import "@epicbagel/saas-kit/styles/source.css"`
  beside the `@source` for this package, and `utilities.css` if their
  stylesheet doesn't import the kit's styles.
- `CandidateGradeBadge` no longer sets `data-slot="candidate-grade"`. Its root
  keeps the kit Badge's own `data-slot="badge"`, which theme stylesheets
  select on. To target the grade badge, select `[data-grade]`: the letter
  (`A` to `D`) or `ungraded`, on the default `badge` appearance. The
  `sentiment` appearance passes only `className` to the kit's pill, so give it
  a class when you need a hook.
- `@recruiteros/recruit-ui/recruit/candidate-quote` is now a client entry
  (`"use client"`), because the show-more toggle holds state. A React Server
  Component can still render `CandidateQuote`, but it now crosses a client
  boundary, so its props must be serialisable.
- Registry: the `recruit-core` item is gone. `recruit-workflows` installs
  `@epicbagel/saas-kit` from npm and depends on the new `recruit-tokens`
  item; installed source imports the kit by package name, so no core path
  alias is needed. Registry installs need a shadcn project on Radix UI (see
  the README's "Registry setup").

### Deprecated

These still work in 0.9.0 and go in a later release:

- `emptyTitle` and `emptyDescription` on `CandidateCareerHistoryTimeline`:
  use `empty`.

### Known issues

- `CandidatePipelineCard`'s root is a `<button>`, so a link or button passed
  in its `company` or `actions` slot nests one control inside another:
  invalid HTML, which a server-rendered page reports as a hydration error.
  A later release moves the root off `<button>`; doing so also drops the few
  pixels a block-level column adds under each inline-level card.
