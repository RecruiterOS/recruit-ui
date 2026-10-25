# Changelog

Every release of `@recruiteros/recruit-ui`, newest first. The package installs
from a GitHub commit, so pin the commit that carries the version you want.
Until 1.0, a minor release may change the public API; each such change is
listed under **Breaking**, with what to do instead.

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
