# Changelog

Every release of `@recruiteros/recruit-ui`, newest first. The package installs
from a GitHub commit, so pin the commit that carries the version you want.
Until 1.0, a minor release may change the public API; each such change is
listed under **Breaking**, with what to do instead.

## 0.11.0

### Breaking

- `CandidateSummaryBulletsLabels` gains a required `sentiment`
  (`CandidateSentimentLabels`), the word read before each line. Code that
  builds a full `CandidateSummaryBulletsLabels` object must add it.
  `CandidateSummaryBullets`' `labels` prop is now
  `CandidateSummaryBulletsLabelOverrides`: every label stays optional,
  including each sentiment's word.

### Added

- `CandidateShortlist`, a shortlist of people as one section: an optional
  `eyebrow`, the `title` (an h2 that names the section) and an optional
  `description`, with an optional `status` at the heading's end; then the
  host's candidate cards as `children`, one under another, and an optional
  `footer` under them, such as a `CandidateDestinationStatus`. With `count`
  zero, or with no `count` and nothing in `children` to render, it shows the
  kit's empty state in place of the cards and the footer, worded by `empty`
  ("No candidates shortlisted yet" by default). It has no surface of its own,
  so it sits flush in a message or pane, or inside a card the host draws. The
  root is a `section` marked `data-slot="candidate-shortlist"`, and
  `@recruiteros/recruit-ui/recruit/candidate-shortlist` is a client entry.
- `CandidateAssessment` takes `evidenceItems`, `caveatItems` and
  `signalItems`, so a host hands over its points instead of building the
  lists. Evidence draws as a list with a success-toned check mark on each
  point (`data-slot="candidate-assessment-evidence"`), caveats as a muted
  bulleted list (`data-slot="candidate-assessment-caveats"`), and signals,
  each a `CandidateSummaryBullet` with the host's sentiment, through
  `CandidateSummaryBullets`. An empty list draws no section, heading
  included. The `evidence`, `caveats` and `signals` slots stay, and a slot
  the host gives takes precedence over the items for the same section.
- `CandidateAssessment` takes `padding`, the kit PanelSection's: `default`
  (as before) pads it like a card's section, and `none` sits it flush in a
  container the host already pads, such as a `CandidateProfileDialog` body,
  so it lines up with what follows it there instead of sitting 26px inside
  it. `compact` is the kit's compact padding.
- `CandidateCareerHistoryPanel` takes `scroll`: `viewport` (the default, as
  before) keeps the timeline in a scroll area capped at the viewport's
  height, and `none` drops the scroll area, so the history runs at full
  height in a container that already scrolls, such as a profile dialog's
  body. With `none` there is no `career-history-scroll` element. The panel
  still imports the kit's ScrollArea for `viewport`, so a bundle that only
  uses `none` carries it too (about 5.6 kB gzipped).
- `CandidateProfileHeader` and `CandidateCoverHeader` take `padding="dialog"`,
  the kit dialog header's 16px. As a `CandidateProfileDialog` `header`, the
  name then starts at the body's left edge, in line with a flush
  `CandidateAssessment` and the rest of the body; with the default `lg` it
  sat 10px further in.
- `CandidateProfileDialog` takes `height`: `viewport` (the default, as
  before) fixes the desktop dialog at 85% of the viewport, so it keeps its
  height while sections load, and `content` sizes it to what it holds, up to
  the same cap, for a short profile such as an example. A drawer and a sheet
  already fit their content. The surface carries `data-height`.

### Changed

- `CandidateFilterChips` marks the pressed chip with a primary border and
  tint and a full-strength label, and gives the others a muted label: the
  kit ChipTabs' outline states. The kit Toggle's accent fill left a pressed
  chip about 1.2:1 against the others, with the same label colour.
- `CandidateGradeBadge` with `format="inline"` and no grade shows the host's
  `label` alone, such as "Needs review", where it showed "—" and dropped the
  label. With no label, or with `showLabel={false}`, it still shows "—", and
  `data-grade` is still `ungraded`.
- `@recruiteros/recruit-ui/recruit/candidate-assessment` is now a client
  entry (`"use client"`), because the assessment renders
  `CandidateSummaryBullets` from a client module. A server component can
  still render it with serializable props.

### Fixed

- `CandidateSummaryBullets` says each line's sentiment to a screen reader.
  The dot is decorative, so a positive and a negative line were announced
  alike and only the dot's colour told them apart. Each line now carries a
  visually hidden word before its text, marked
  `data-slot="candidate-summary-bullet-sentiment"`: "Positive", "Neutral",
  "Caution" or "Negative" by default, the host's own through
  `labels.sentiment` (any of the four), or a bullet's `sentimentLabel`. This
  covers `CandidateAssessment`'s `signalItems` too. A line's text content now
  starts with that word, such as "Positive: Led the migration"; the text
  itself keeps its own element.
- `CandidateInlineCard` keeps a leading glyph in `meta`, such as a location
  pin before the place, on the text's line, with a small gap after it. The
  stylesheet reset makes every `svg` a block, so the glyph sat on a line of
  its own above the text. The glyph is now inline, centred on a capital when
  it is as tall as the text, so the line still wraps, and with
  `density="compact"` still truncates with an ellipsis. Nothing else in
  `meta` changes. The meta line carries
  `data-slot="candidate-inline-card-meta"`.
- `CandidateProfileDialog` no longer clips its header on a phone. The drawer
  (and the sheet's bottom sheet) caps its height rather than fixing it, so
  with a tall body the header shrank with it and lost its last lines, such
  as a `CandidateProfileHeader`'s second meta line. The `header` now sits in
  an element that never shrinks, marked
  `data-slot="candidate-profile-dialog-header"`, and only the body gives way
  and scrolls. With no `header` there is no such element.
- `CandidateFilterChips` keeps a 44px touch target on a touchscreen, as the
  compact controls have since 0.10.1: on a coarse pointer every chip is at
  least 44px tall and wide (where it was 28px, and 24.5px on a phone, whose
  root type the kit scales to 87.5%); a mouse keeps the 28px chip.

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
