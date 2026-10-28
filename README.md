# Recruit UI

Recruit UI is an open-source shadcn registry containing production-quality recruitment workflows—not merely buttons and cards. It also ships the same components as an installable React package, without owning application data, scoring, authentication, integrations, or persistence.

## Two delivery modes, one implementation

The installable package and shadcn registry are generated from the same workflow files in `src/`. Both depend on `@epicbagel/saas-kit` (MIT) for the UI primitives the workflows compose: layout, typography, buttons, badges, dialogs and drawers. Recruit UI contains no copy of them.

- Package consumers currently pin `@recruiteros/recruit-ui` to an immutable GitHub commit and import from the root, `core`, or direct `recruit` subpaths. `@epicbagel/saas-kit` and `lucide-react` are peer dependencies: install them alongside, so the application and every library that renders a primitive share one copy of the kit, and with it one Dialog and Tooltip context, and one copy of the icon set.
- Registry consumers install source under `components/recruit-ui`. The `recruit-workflows` item supplies the candidate workflows and installs `@epicbagel/saas-kit` as an npm dependency; the `recruit-tokens` item supplies the theme variables they read.

Workflow registry entries point directly at the canonical files in `src/`, and those files import the kit by package name, so a registry install needs no extra path alias. Static payloads in `dist/registry` are optional build artifacts. None is a separately maintained implementation.

## Package setup

```bash
pnpm add github:RecruiterOS/recruit-ui#FULL_COMMIT_SHA @epicbagel/saas-kit lucide-react react react-dom
```

Use the full commit SHA from the first public release; do not depend on a moving branch. A protected, immutable release tag may be used after one exists. The package is not published to npm; install it from GitHub as shown above. `@epicbagel/saas-kit` and `lucide-react` must satisfy the `peerDependencies` ranges in `package.json`; any `lucide-react` from 0.400 up to, but not including, 2.0 works.

The components use semantic Tailwind classes compatible with a standard shadcn theme. Tailwind v4 package consumers import the kit's source registration, so the classes its primitives use are generated, and add the built package to their stylesheet scan:

```css
@import "@epicbagel/saas-kit/styles/source.css";
@source "../node_modules/@recruiteros/recruit-ui/dist";
```

If your stylesheet doesn't already import the kit's styles (`@epicbagel/saas-kit/styles/globals.css` brings everything), also import its palette-free utilities and keyframes, beside the other imports:

```css
@import "@epicbagel/saas-kit/styles/utilities.css";
```

Keep every `@import` above the first `@source` or other rule: Tailwind drops an `@import` that follows one.

The components read the standard shadcn semantic tokens (`--background`, `--muted-foreground`, `--destructive`, …) plus `--destructive-foreground`, which current shadcn themes omit. Define any your theme lacks, or import `@epicbagel/saas-kit/styles/tokens.css` for the kit's neutral palette.

```tsx
import {
  CandidateAssessment,
  CandidateDecisionBar,
  CandidateProfile,
} from "@recruiteros/recruit-ui/recruit";
```

The root and `recruit` barrels are explicit client entry points. The build
also preserves each interactive component subpath as its own client boundary,
and fails if any generated ESM or CommonJS entry loses the `"use client"`
directive prologue.

Public workflow exports include:

- review and compact surfaces: `CandidateReviewCard`, `CandidateInlineCard` (an optional `cover` uses the same 4:1 media frame as the review card and profile, above its existing identity row; `coverSize="compact"` caps the banner at 96px on wide cards, keeping 4:1 below that; pass the media directly, with its alt text and failure handling owned by the host; a leading glyph in `meta`, such as a location pin, sits on the text's line; `density="compact"` makes it one dense row for fixed-height lists and board columns, whose actions still grow to a 44px touch target on a touchscreen; a comfortable card can take `nameSize="lg"`, `headlineWrap` and `actionsAlign="center"` for a short list where each card stands on its own), `CandidateCoverHeader`, `CandidateCoverImage`, and `CandidateQuote`;
- card lists and card controls: `CandidateCardList`, `CandidateCardColumnsToggle` with `useCandidateCardColumns`, `CandidateFavouriteButton`, `CandidateProfileLinkButton` (the host supplies the glyph and URL), `CandidateSharedProfileButton`, and `CandidateContactChannelsMenu`;
- profile composition: `CandidateProfile`, `CandidateProfileHeader`, `CandidateProfileBody`, `CandidateProfileFooter`, and `CandidateProfileDialog` (a centred dialog, or with `presentation="sheet"` a side sheet on desktop and a bottom sheet on a phone; the header keeps its natural height and only the body scrolls; `height="content"` lets the desktop dialog fit a short profile, and a `CandidateProfileHeader` with `padding="dialog"` starts at the body's left edge; give that header `titleLevel={2}` so the name is an h2 under the page's own h1). For a profile page, `CandidateProfileHeader`'s `actionsPlacement="aside"` sets a tall control such as a profile link beside the whole identity rather than on the name line, `CandidateProfile`'s `printMode="flat"` prints without the card's border, and `CandidateProfileFooter` takes `justify`, `padding="compact"` for a one-line credit and `printVisibility="hidden"`;
- review details: `CandidateCareerHistoryTimeline`, `CareerDateRange`, `CandidateCareerHistoryPanel` (the timeline under a counted header, scrolling within the viewport, or with `scroll="none"` at full height in a container that already scrolls), `CurrentCompanyLabel`, `CurrentCompanyPopover` (the company opens host content on hover or tap, mounted only while open), and presentation-only candidate grade helpers and `CandidateGradeBadge` (split or inline text, badge or sentiment-pill appearance; host applications supply grade labels, tones and sentiments, and an ungraded record's inline label, such as "Needs review", shows alone);
- decisions and delivery: `CandidateAssessment` (facts, summary, and evidence, caveats and signals as slots or as items it draws in its own lists: check-marked evidence, bulleted caveats and `CandidateSummaryBullets` signals; `padding="none"` sits it flush in a container the host already pads), `CandidateDecisionBar`, `CandidateDestinationStatus`, and `CandidateShortlist` (a shortlist as one section: eyebrow, title, description and status over the host's cards, a footer such as `CandidateDestinationStatus` under them, and the kit's empty state when it holds nobody, `emptySize="md"` for a shortlist that is a page's main list; it has no surface of its own, so it sits flush in a message or inside the host's card) with `CandidateShortlistNote` (the presenter's personal note over a shortlist: their face, a title such as "A note from Jordan" and their role, the message as rich text, an optional video, and a sign-off beside an action such as a booking link; the title is an h2 unless `titleLevel` sets 3 or 4, so the note never adds a second h1 to a page).
- jobs and the pipeline: `JobSummaryCard` (a job's identity, facts and footer actions), `JobBriefCard` (a job's brief: its description, headline facts, the must-have, nice-to-have and red-flag lists, further titled sections such as role details or the interview process, and a footer slot; `rules` picks which lists show, so a page that mustn't show red flags leaves them out. The two presentations look the same, one title row (the title, then a `version` and a `status` at its end, all naming the section) over one body, and differ only in what folds: `presentation="collapsible"`, the default, folds the whole brief under its title row for a page; `presentation="preview"` shows the start of it in a message, the first `previewCount` facts and entries, with a toggle that opens the rest in place. Given `onRulesChange`, the lists are editable in place and the host saves each whole list; a promise it returns keeps the list showing what it sent until it settles, so a failed save reverts. The kit's empty state when there is nothing to show, an in-progress one while a read-only brief is still `processing` with nothing yet, and otherwise a notice above a brief still being read, so an editable brief keeps its add fields. `version` badges which version of the brief it is with the kit's status badge, worded by `jobBriefVersionLabel`: "v3 · Current" in the success tone for the version in force now, "v2 · Earlier" in the neutral tone for one a later version replaced, so the state is in words as well as colour, and an optional `secondaryLabel` in a second, neutral badge, such as the number another system gives the same version), with `jobBriefView` (a brief's own fields, `JobBriefContent`, as the card's title, description, facts, lists and their names, sections and preview depth, so one brief reads the same in every app: titled "Role · Company" by `jobBriefTitle` or plainly "Job brief" under a header that already names the role, the salary in full by `formatJobBriefSalary` with a currency only when the brief has one, the sections in one order, an earlier brief previewing only its title and description, and `audience: "public"` leaving out what a page anyone can open mustn't show) and `jobBriefLabels` (its default wording, which `jobBriefView`'s `labels` overrides; the card's own `labels` words only its processing notice and toggle; they also ship from `@recruiteros/recruit-ui/recruit/job-brief-view`, a subpath without a client boundary), `JobBriefChanges` (what a version of a brief changed, for under its card: one quiet kit trace line per change, each led by an icon for its kind and never a sentiment colour, the first `previewCount` (3) shown and the rest folded under "N more changes", in a group named for the version, "What changed in v3"; nothing for a version with no changes to list) with `jobBriefChangeText` (one change as a line, from display values each app maps its own change records onto, `JobBriefChange`: all seven kinds, "Added must-have: Python", "Removed red flag: …", 'Reworded must-have: "…" → "…"', 'Moved must-have "…" to position 1', "Location: Remote → Hybrid", "Removed the location (was Remote)" and "Replaced the interview steps (3 entries)", each value cut to 80 characters, numbers grouped, lists counted, and a prose field such as a role description only said to have been added, updated or removed; its wording, `jobBriefChangeLabels`, and `jobBriefVersionLabels` also ship from `job-brief-view`), `JobClientBadge`, and `CandidatePipelineCard` (a dense board-column card).
- relationships and roles: `CandidateRelationshipCard` (a person in a network: signal, facts, suggested roles and the latest note), `CandidateFilterChips` (pressed-state chips that narrow a list to one kind; the pressed chip has a primary border and tint, a label is the host's content, such as a word and a count, and every chip keeps a 44px touch target on a touchscreen), `CandidateSignalMenu` (`CandidateActionMenu` with a signal's defaults), `CandidateSignalList`, `CandidateRoleMatchSummary`, `CandidateRoleMatchList` (roles a person may fit, with a confirmed add action), and `CandidateSuggestedRolesPanel`.
- calls: `CandidateCallList` and `CandidateCallCard` (a person's linked calls, each with an unlink confirmation and a check against open roles), `MatchedCallCard` (a call already linked to people, with a dialog that links one more), and `CallReconcileCard` (a call awaiting a person: attach it to a guess or a search result after a preview, create a person from it, or dismiss it; or, with `onPickOther`, offer the host's own `suggestions` and open the host's own people picker, in which case the card's search-mode dialogs are never downloaded). The host passes the people search and the transcript loader as functions, and the state of its insight check as `CallInsights`. `normalizeCallParticipants` and `normalizeCallSegments` turn raw participant and transcript lists into the cards' shapes; they also ship from `@recruiteros/recruit-ui/recruit/call-data`, a subpath without a client boundary, so a server can call them.
- a person's history and reach: `CandidateActivityTimeline` (what happened with a person, grouped by period, each row a kit timeline row with a glyph, title, context and timestamp, and a longer body behind a toggle or a link to open) and `CandidateChannelActions` (the host's email, call, message and profile links as round icon buttons or a labelled action bar; every link keeps a 44px touch target on a touchscreen).
- documents: `DocumentUploadPanel` (a titled section with an optional select for the next upload's kind, an error, the kit's drop zone and the list under it; the host uploads what is dropped), `DocumentList` (a skeleton while loading, the kit's empty state at zero) and `DocumentListItem` (a file's name, kind badge, the host's meta line and a summary or processing state, with preview, download, re-analyse and delete-with-confirm actions for the callbacks given; `density="compact"` makes it one dense row for a pane), with `formatFileSize`.
- outreach and presenting: `CandidateOutreachDraftList` (the messages drafted to a person, one card per draft with its channel, status, subject and message, Copy, and Approve, Dismiss or Mark sent for the callbacks given, as `availableActions` allows each draft, by default `defaultOutreachDraftActions`'s approve-then-send workflow; the callbacks receive the host's own draft) with `outreachDraftCopyText`, `CandidateAddToJobPopover` (a job select, a stage select and Confirm for one or many people, with an optional second mode that has a host-named assessor assess them instead; it starts from the host's defaults each time it opens and stays open with its choices if the host's callback throws), and `CandidatePresentationRecorder` (records a voice note to send with a profile and hands each take to the host as soon as it stops, keeping a failed one playable to retry; the host's player through `renderAudio`) with `supportedRecordingMimeType`.
- a person's detail pane: `CandidateDetailLayout` (a fixed header, alert, tabs and footer around the one body that scrolls), `CandidateDetailHeader`, `CandidateActionMenu`, `CandidateDetailTabs`, `CandidateDecisionSummary` (the recorded decision and the assessment grade as two rows of one card), `CandidateJobEvidence` (why the person was sourced for a role, and a recruiter's feedback on them for it), `CandidateNoteList`, `CandidateNoteCard` and `CandidateNoteComposer` (voice first, with typing and one-tap suggestions), `CandidateFactList` with `formatFactValue`, `CandidateContactDetails`, `CandidateChannelLog`, `CandidateDefinitionSection`, `CandidateOutreachComposer` (a channel, its house style, and the editable draft), and `CandidatePipelineList` with `CandidateSummaryBullets` (each role the person is in, with a stage select and the host's evidence for it; each summary line carries its sentiment as a visually hidden word, so it isn't told by the dot's colour alone).
- review-card actions: `CandidateHeaderActions` with `CandidateIconAction`, `useCandidateVoiceNote` (a mic trigger already wired to the hidden dictation control), `CandidateSelectableAvatar` (the avatar as a batch-selection toggle), `CandidatePendingNote`, `CandidateReviewActionRow`, `CandidateDecisionButtons` (Yes and No that start the host's own decision flow, unlike `CandidateDecisionBar`, which shows a recorded value), `CandidateDecisionReasonDialog`, `CandidateStageActions` (advance, jump ahead, contact, present, reject and declined) and `CandidateStageSelect`; `CandidateQuote` clamps a long excerpt behind a show-more toggle with `collapsible`.

All candidate identity, media, assessment, actions, contact, and destination values enter through explicit display slots and callbacks. A component whose root is the kit's Button, Badge or Card keeps the kit's own `data-slot` there, because theme stylesheets select on it (so `CandidateNoteCard` and `CandidateShortlistNote` add none, and `CandidateGradeBadge` names its grade in `data-grade` instead: the letter, or `ungraded`); other components mark their root (for the card list, its grid; for the contact and stage menus, the menu surface; for the current-company popover, the popover surface beside the label's own; for the stage select, its trigger; for the activity timeline, its root and each period's section; for the shortlist, its section; for the job brief card, its section, its version's badges, each list's wrapper and each further section; for a brief's changes, the group; for the document panel, list and row, their own roots, and for the kind select, its trigger; for the outreach draft list, its section and each card; for the add-to-job popover, the popover surface; for the presentation recorder, its root; for the channel actions, the labelled group; for the action menu and the signal menu built on it, the menu surface, `candidate-action-menu`; for the detail tabs, the tab root) with a `data-slot` of their own. A dialog keeps the kit's `data-slot` on its content, and `CandidateStageActions`, which renders its controls without a wrapper, marks only its menu. The call cards' root is the kit's `CallCard`, which accepts a `className` but no other attributes, so they add no `data-slot`; `CandidateCallList` marks its section. `CareerHistoryItem.dateRange` accepts host-formatted date text; raw dates are formatted as absolute calendar dates when that slot is omitted.

## Registry setup

This repository is a native GitHub source registry.

Registry installs need a shadcn project on Radix UI: a `components.json` with a Radix style such as `radix-nova` (or `new-york` from an older init), and the `@` import alias. Start a new project with:

```bash
pnpm dlx shadcn@latest init --base radix --preset nova
```

The workflow files are built on Radix and pass its `asChild` prop. With a Base UI style (`base-*`, the CLI's default), the CLI rewrites `asChild` into `render` on install, and the files fail `tsc` and lose links and accessible names at runtime. The package install above doesn't depend on your shadcn setup.

Then install the workflows with the official CLI:

```bash
pnpm dlx shadcn@latest add RecruiterOS/recruit-ui/recruit-workflows
```

Installing `recruit-workflows` also resolves `RecruiterOS/recruit-ui/recruit-tokens`. The root `registry.json` points only to files committed in this repository:

- `recruit-workflows` reads the canonical workflow files under `src/` directly,
  installs `@epicbagel/saas-kit` and `lucide-react` from npm, adds the kit's
  `utilities.css` and `source.css` imports to your stylesheet, and installs
  `LICENSE`, `NOTICE` and `THIRD_PARTY_NOTICES.md` alongside the source;
- `recruit-tokens` carries the kit's neutral palette as CSS variables. It is a
  `registry:item`, so the CLI only appends a variable your stylesheet doesn't
  already define and never overwrites your palette; on a current shadcn theme
  that adds `--destructive-foreground` and nothing else.

Workflow files install into an isolated `components/recruit-ui` directory and import the primitives from `@epicbagel/saas-kit`. They do not replace an application's existing shadcn primitives.

The static payloads in `dist/registry` carry the same two items as JSON (`recruit/recruit-workflows.json` and `tokens/recruit-tokens.json`). The workflows payload names its tokens as `RecruiterOS/recruit-ui/recruit-tokens`, which the CLI resolves from this repository's default branch, whichever ref or host served the workflows payload. If you serve the payloads yourself, or pin both to one ref, rewrite that dependency to the URL of the `recruit-tokens.json` you serve beside it.

## Boundary

Recruit UI accepts display values, React nodes, and callbacks. The host application owns:

- data fetching, caching, authentication, and authorization;
- record identifiers, links, media resolution, and navigation;
- score calculation, grade assignment, and decision policy;
- workflow states, status mapping, and persistence;
- product wording, brand assets, and analytics.

Do not add application records, customer material, screenshots, production payloads, private endpoints, or environment configuration to this repository. Public examples and tests use explicitly fictional labels only.

## License and provenance

RecruiterOS-authored portions are licensed under the Apache License, Version
2.0. Recruit UI depends on `@epicbagel/saas-kit` (MIT) for its UI primitives;
the kit is installed from npm, not copied into this repository, and its own
notices cover the shadcn/ui-derived portions it contains. Runtime dependencies
are external and retain their own licenses. See `LICENSE`, `NOTICE`, and
`THIRD_PARTY_NOTICES.md` for details.

## Development

```bash
pnpm install --frozen-lockfile
pnpm verify
```

Focused commands:

```bash
pnpm check:imports
pnpm check:empty-states
pnpm typecheck
pnpm test
pnpm build
pnpm check:dist
pnpm validate:registry
pnpm validate:shadcn
pnpm check:registry
pnpm check:public
```

Git dependencies consume committed, verified ESM, CommonJS, and declaration artifacts without running install-time build scripts. `pnpm check:dist` rebuilds those artifacts and fails if they differ from the committed distribution. The build keeps `@epicbagel/saas-kit` external, so the artifacts import the kit by package name exactly as the registry sources do. `pnpm check:imports` fails the build if a source imports an undeclared package, goes through a path alias, or names a kit module that the pinned kit release doesn't export; `pnpm check:registry` applies the same kit-module check to every registry payload. `pnpm check:empty-states` holds every blank slate to the kit's `EmptyState` with an explicit variant, size, icon and title.

Each release, and every change to the public API it makes, is in `CHANGELOG.md`. See `CONTRIBUTING.md` for the public-source workflow and `SECURITY.md` for private vulnerability reporting.
