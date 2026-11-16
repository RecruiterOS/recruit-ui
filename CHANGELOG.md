# Changelog

Every release of `@recruiteros/recruit-ui`, newest first. The package installs
from a GitHub commit, so pin the commit that carries the version you want.
Until 1.0, a minor release may change the public API; each such change is
listed under **Breaking**, with what to do instead.

## 0.33.2

The rest of the kit, first part: the seventh batch of a polish audit. No
API change.

### Fixed

- A role's title in `CandidateRoleMatchList` is a link that stands alone,
  and says so (`display="inline-flex"`), so with `@epicbagel/saas-kit`
  1.43.0, which the peer range already allows, it takes a tap area on a
  touchscreen. It was 17.5px tall there. Nothing is drawn differently.

With saas-kit 1.43.0 the library's checkboxes, switches and contact links
take a tap area on a touchscreen too, with no change here.

## 0.33.1

Gaps: the sixth batch of a polish audit. No API change.

### Fixed

- `CandidateSummaryBullets`' Generate summary button has the kit button's
  own gap between its icon and its label, 8px. It asked for 4px, a gap
  meant for a 12px icon, but the kit draws a button's icon at 16px, so the
  icon sat closer to its label than on every other button.

With `@epicbagel/saas-kit` 1.42.2, which the peer range already allows, the
marks in `CandidateContactDetails` sit one distance from their words (a
link's was 4px, plain text's 6px), and the Add button of `JobBriefCard`'s
editable lists has the standard 8px between its icon and label (it was
12px).

## 0.33.0

Text alignment: the fifth batch of a polish audit. The minimum kit version
moves to 1.41.0.

### Breaking

- The peer range for `@epicbagel/saas-kit` is `^1.41.0` (it was `^1.39.0`).
  With it, on a touchscreen, every text button the library draws takes a
  tap area at least 1.75rem tall and 2.75rem wide, without changing how it
  looks. They were as tall as their line of text, 14 to 18px. That is Show
  more and Show less on `CandidateCareerHistoryTimeline` and
  `CandidateQuote`, the toggle on an activity's body in
  `CandidateActivityTimeline`, the company link on `CurrentCompanyLabel`,
  Generate summary on `CandidatePipelineList`, and the reset link on
  `CandidateOutreachComposer`.

### Fixed

- `JobSummaryCard`'s facts start and end where its title does. The list
  was inset 20px and the header 22px.
- `CandidateDecisionSummary`'s two rows share a left edge. The decision
  was padded 12px with 8px after its tile, the assessment 22px with 12px,
  so the second tile and its text sat 10px and 14px to the right of the
  first. Both are now the decision's.
- `CandidateAssessment`'s `grade` keeps its own width. The slot was a
  direct child of the column, which stretched a badge across the panel.
  It is in a row marked `data-slot="candidate-assessment-grade"`.
- `MatchedCallCard`'s title starts on the title's edge when it names
  people who can be opened. Each name is a padded button, so the first
  sat 8px to the right of the date under it.
- `CallReconcileCard`'s attach section lines up with the rest of the card.
  It added its own 14px padding inside the card's padded action bar, so
  its heading sat 14px inside the summary above it.

## 0.32.0

Padding and insets: the fourth batch of a polish audit. The minimum kit
version moves to 1.39.0.

### Breaking

- The peer range for `@epicbagel/saas-kit` is `^1.39.0` (it was `^1.38.0`).
  With it:
  - On a viewport under 768px, every card, panel section and padded stack
    the library draws has padding that scales with the type and controls
    inside it, to 87.5%: a card's 26px is 22.75px on a phone. It was fixed
    in pixels, so padding stayed full size while its content shrank.
    Nothing changes on a desktop.
  - A select at its default size and a textarea start their text 16px
    from the left edge, where an input does; they were at 12px. That is
    `CandidateStageSelect` at its default size, the selects in
    `CandidateAddToJobPopover`, and every composer and reason field.

### Fixed

- `JobBriefCard`'s collapsible presentation set its inset in fixed pixels
  too. It is in rem, so it still lines up with the preview presentation on
  a phone.

## 0.31.0

Tap targets on a touchscreen: the third batch of a polish audit. The minimum
kit version moves to 1.38.0, where the kit's smallest controls take a larger
tap area on a touchscreen without changing how they are drawn.

### Breaking

- The peer range for `@epicbagel/saas-kit` is `^1.38.0` (it was `^1.37.0`).
  Nothing changes with a mouse. On a touchscreen:
  - A `DocumentListItem`'s preview, download, re-analyse and delete buttons,
    and a compact `CandidateSharedProfileButton`, are drawn as before (24.5px
    and 21px on a phone) and can be tapped anywhere in an area the height of
    a standard control, 38.5px on a phone, centred on the icon.
  - A `CandidateSelectableAvatar`'s tap area reaches 2px past the avatar.

### Added

- Tests that hold a tap area on each small control the library doesn't grow
  (`touch-targets.test.tsx`).

## 0.30.0

Controls that share a row share a height, and filter chips keep their
labels on a phone: the second batch of a polish audit. The minimum kit
version moves to 1.37.0, where a select, a native select and a toggle are
the kit's standard 44px.

### Breaking

- The peer range for `@epicbagel/saas-kit` is `^1.37.0` (it was `^1.36.0`).
  With it a `CandidateStageSelect` at its default size, the selects and the
  toggle group in `CandidateAddToJobPopover`, and any other default-size
  select or toggle are 44px high, where they were 40px: the height of the
  inputs and icon buttons beside them. A `controlSize` a host passes is
  unchanged.

### Fixed

- `CandidateFilterChips`: on a touchscreen a crowded row squeezed every
  chip to a 44px circle, with its label spilling over its neighbours. The
  row scrolls, and relied on a flex item's automatic minimum to stop its
  chips shrinking; the touch target's own minimum width replaced that
  minimum. Each chip now says it doesn't shrink, so it keeps its label's
  width on any pointer and the row scrolls as it was meant to.

## 0.29.0

Controls in a row line up: the first batch of a polish audit. The minimum
kit version moves to 1.36.0, where the kit's `CopyButton` takes the size it
is given.

### Breaking

- The peer range for `@epicbagel/saas-kit` is `^1.36.0` (it was `^1.35.0`).
  On an older kit a draft's Copy button ignores its size and stays 28px.

### Fixed

- `CandidateOutreachDraftList`: a draft's Copy button is the same icon
  button as Approve, Dismiss and Mark sent beside it, and the row centres
  them. Copy was a 28px button in a row of 44px ones, and the row
  top-aligned them, so its icon sat 8px above theirs (7px on a phone). The
  cause was in the kit, whose `CopyButton` set its own box whatever size it
  was given; this release asks it for the row's size.

## 0.28.2

A stock cover leaves no band on paper. The minimum kit version doesn't move.

### Fixed

- A stock cover at its full size printed as an empty band a quarter of the
  card's width high. 0.28.0 hid its frame in print, but at full size the
  frame sits in a ratio wrapper that holds the height, and that was left
  standing. The stock cover is now wrapped in an element marked
  `data-slot="candidate-cover-stock"`, and that is what paper leaves out,
  wrapper and all. A printed shared profile or profile header starts at the
  person's name again. A capped cover (`coverSize="compact"`) holds its own
  height and was unaffected; a cover of the person's own prints as it did.

## 0.28.1

A wide card can cap its cover. A full 4:1 banner on a card that runs the
width of a page is taller than the person under it. The minimum kit version
doesn't move.

### Added

- `coverSize` on `CandidateReviewCard`, `CandidateRelationshipCard` and
  `CandidateProfileHeader`, as `CandidateCoverHeader` and
  `CandidateInlineCard` already take it: `compact` caps the cover at 96px,
  the stock one and the person's own alike, and narrower than 384px it is
  4:1 either way. The default is the full 4:1, as before.

### Changed

- `ClientSearchDelivery` caps each person's cover at 96px. Its cards run the
  width of the page, where the stock banner 0.28.0 brought was 180px high
  on a 720px column.

## 0.28.0

Everyone has a cover. A card or a profile given no cover of the person's own
draws the kit's stock banner in its place, so a list of cards is one height
and nobody's looks bare. The minimum kit version moves to 1.35.0, which is
where the banner is.

### Breaking

- `CandidateReviewCard`, `CandidatePipelineCard`, `CandidateRelationshipCard`
  and `CandidateProfileHeader` draw a cover when `cover` is left out: the
  kit's `CoverBanner`, in the 4:1 frame a cover of the person's own would
  have. They drew no frame before, so most cards are a quarter of their
  width taller. So do the things built on them: each person in a
  `ClientSearchDelivery`, the header of a `CandidateSharedProfile`, and the
  card a `CandidatePipelineBoard` draws when the host gives it none. Pass
  `cover={null}` wherever no cover is right, which draws none as before. A
  flush profile header (`padding="none"`) is unchanged, because it sits
  inside a container the host pads, where a banner couldn't reach the edges,
  and so is `CandidateInlineCard`, whose cover is extra: both draw a cover
  only when given one.
- The peer range for `@epicbagel/saas-kit` is `^1.35.0` (it was `^1.16.0`):
  `CoverBanner` and its styles arrived in 1.35.0. A host on an older kit
  moves to 1.35.0 or later; its styles are in the kit's
  `styles/utilities.css`, which a host already imports.
- An anonymised shared profile has a banner too. The person's own cover is
  still never drawn. The stock one stands over the header in its first
  design whatever `person.coverSeed` is, so nothing of theirs deals it and
  no two anonymised people differ by it. `cover: null` still draws none.

### Added

- `coverSeed` on `CandidateReviewCard`, `CandidatePipelineCard`,
  `CandidateRelationshipCard`, `CandidateProfileHeader`,
  `CandidateSharedProfilePerson` and `ClientSearchPerson`: what deals the
  stock banner its design, the same one every time for the same seed. Pass
  the person's id and they keep one banner wherever they appear. Left out,
  the name is the seed where it is plain text; a name that is an element is
  never read, and deals the first design. `null` deals the first design
  outright.
- `CandidateCoverHeader` takes `coverFallback` (`"stock"` or `"none"`, the
  default) and `coverSeed`, for a host that builds its own card on the
  shared header: with `"stock"` it draws the banner where `cover` is left
  out, and `cover={null}` still draws none.
- `candidateCoverSeed(seed, name)`, the rule the cards share for choosing a
  seed, and the types `CandidateCoverSeed` and `CandidateCoverFallback`.

### Changed

- A stock cover isn't printed. It is drawn as a background, which a browser
  leaves out of print, so its frame is hidden on paper rather than printed
  as an empty band. A cover of the person's own prints as it did.
- `cover` is typed `ReactNode | null` where the stock banner can stand in,
  to say that `null` is a choice. Nothing a host passes today stops
  compiling.

## 0.27.0

A shared profile keeps the whole of an assessment together, and a host can
say why a Yes or No didn't save. Nothing changes for a host that passes
neither, and the minimum kit version doesn't move.

### Added

- `CandidateSharedProfileFit`, and `CandidateSharedProfile`'s `fit`, take
  `groups`: further lists that belong with the assessment, under the
  evidence, each a `CandidateSharedProfileFitGroup` of a `title` and its
  `items`, such as what to test in an interview and what stands out. The
  fit held one unnamed list, so a host with more than evidence had to put
  the rest in sections of its own, which the profile draws after the career,
  away from the grade they qualify. Each group is a `section` named by its
  heading, one level under the fit's, marked
  `data-slot="candidate-shared-profile-fit-group"`. The host names each and
  gives each line its sentiment, a group with no lines isn't drawn, a group
  alone is a fit, and the lines print in colour as the evidence does.
- `CandidateClientDecision`'s `labels.failed` may be a function given what
  `onDecide` rejected with, beside the line it could already be, as a
  note's `noteFailed` and a share's `failed` are. A host whose rejection
  says why, such as a link that has stopped, shows that under the buttons.
- `CandidateDecisionReasonSheet`'s `labels.failed` may be a function given
  what `onConfirm` rejected with, the same way, so the reason is said in the
  sheet, where the person still is. Both reach a shared profile through
  `decisionLabels` and `reasonSheet.labels`.

## 0.26.1

`CandidateShareDialog` fits a laptop, and a host can hold which side of its
note shows. It is built on the same kit primitives as before, with the kit's
`Grid` beside them, so the minimum kit version doesn't move.

### Added

- `CandidateShareDialog` takes `noteFormat` and `onNoteFormatChange`, beside
  `defaultNoteFormat`, as it takes `choices` and `onChoicesChange`: a host
  holds which side of the note shows, the recorder or the written note.
  `defaultNoteFormat` is read as each opening starts, but a host learns
  which side a link's note is on only once it has read its links, or as the
  person sharing switches between a named page and an anonymised one, each
  with its own link. Until now it had to remount the dialog by `key`, which
  drew it twice and dropped focus. Changing `noteFormat` remounts nothing:
  both sides stay mounted, so a take in the recorder and a half-written
  note are kept, and focus stays where it was. The one place focus can't
  stay is inside the side that has just been hidden, where it goes to the
  tab of the side now showing and isn't dropped on the page behind the
  dialog. `onNoteFormatChange` is called with the side the person sharing
  asks for, once each time they press the other side's tab, whether or not
  the host holds the side; a host that holds it decides whether the side
  changes.

### Changed

- `CandidateShareDialog` fits a laptop. In a window 1280 by 720 everything
  it asks is in view without scrolling: the person's summary with the
  sharer's reason, named or anonymised, and a note with a recorder or a
  written note, with or without a link that already exists. It was capped
  at 85% of the window's height and set looser, so at 1280 by 800 a
  recorder's button was under the dialog's own fold, and so was a link that
  already existed. What changed:
  - The centred dialog may be as tall as the window, less a margin of 1rem
    above and below: the height the kit's own `Dialog` calls `viewport`. Past
    that its body scrolls between the title and the share button, as
    before. A phone keeps the kit's bottom sheet at the kit's height.
  - The person's `avatar` and `headline` sit beside the title, which names
    them, so the summary no longer says the name a second time. A host
    whose `labels.title` leaves the name out now shows it nowhere, and
    should put it in the title. The summary's `data-slot`,
    `candidate-share-dialog-summary`, is that line, in the dialog's header;
    the sharer's `reason` is under it, first in the body, marked
    `candidate-share-dialog-reason`.
  - A link the host already has (`url`) shows above everything the dialog
    asks, where it showed under it, so someone who opens the dialog again
    to copy the link finds it in view, with Copy the first control in the
    dialog.
  - Named and anonymised sit side by side where there is room, on the kit's
    `Grid`, and one over the other on a phone. They are one radio group to
    the arrow keys either way.
  - With both a recorder and a written note, the switch between them sits
    on the note's own heading line, and drops under it where the two don't
    fit side by side. Labels too long for the dialog scroll inside the
    switch, and can't scroll the whole dialog sideways.
  - Over the questions, a link that is copied says so on its button and to
    a screen reader, and no longer in a line under the link, which pushed
    every question down and back. The line shows once the link is made, and
    when the browser wouldn't copy.
  - The gaps between sections are a step tighter, the reason and the line
    under the written note are set closer, and the written note's field
    opens at three rows, where it opened at four.
- `CandidateShareDialog`'s switch between a spoken and a written note
  changes sides when a tab is pressed, with a pointer, Enter or Space. The
  arrow keys move between the two tabs and change nothing, where they took
  the side with them. A host that holds the side can change it while focus,
  or the place Shift+Tab comes back to, is on the other side's tab; a tab
  that took its side with it on focus would undo the host's switch as soon
  as focus came round again.

### Fixed

- `CandidateShareDialog`: a title long enough to reach the centred dialog's
  close control wraps beside it. It ran under it. On a bottom sheet a title
  that wraps has room between its lines, and a long word in the line under
  the title (`labels.description`) wraps, so it can't widen the sheet's
  header past the sheet.
- `CandidateShareDialog`: a link that couldn't be made, and an error of the
  host's own, are brought into view. They show under everything the dialog
  asks, which on a small window is under the dialog's own fold, so a failed
  share could look as though nothing had happened.

## 0.26.0

Both new components are built on kit primitives that `@epicbagel/saas-kit`
1.16.0 already has (`ResponsiveDialog`, `Tabs`, `RadioGroup`, `Field`,
`Toggle`, `Callout`, `Avatar`, the notes and the dictation hook), so the
minimum kit version doesn't move. The chips that switch between people, and
that pick who a link is for, are the kit's `Toggle` in a named group, as
`CandidateFilterChips` are: the kit's own `ChipTabs` names its group and
marks the pressed chip only in a later release.

### Added

- `CandidateSharedProfile`: the content of the page someone opens from a
  link to a candidate, as one composition built from display values and
  callbacks. It is the content and no more: it draws no header, brand, theme
  or shell, so the host wraps it in its own page and decides its width. In
  order it shows an `eyebrow`, such as the search the person was shared for;
  the people the link shares, when it shares several (`people`, `personId`);
  a notice on an `archived` link, over a profile that dims; then the profile
  (`CandidateProfile`): who the person is (`person`), a spoken note with its
  transcript (`voiceNote`) and a written note with its author (`note`) from
  whoever shared them, how well they fit a role (`fit`), a `summary`,
  `experience` (`CandidateCareerHistoryTimeline`), `education`, `skills`,
  `certifications` and `languages`, the host's own sections as `children`,
  the reader's Yes or No with why (`decision`, `onDecide`), their own notes
  (`clientNotes`, `onAddNote`) and a `credit`. Every part is optional and
  shows only when the host passes what it shows: a profile given a name
  alone is a heading, a host that passes no `onDecide` gets no Yes or No,
  and one that passes no `onAddNote` no note field, though an answer or
  notes already given still show. It fetches nothing, navigates nowhere,
  stores nothing and holds no timer: what the reader does goes out through
  `onPersonChange(id)`, `onDecide(decision, reason)` and `onAddNote(text)`.
  While a promise from `onPersonChange` is pending, or the host names an
  `openingPersonId`, the switcher says who is opening and it, the Yes or No
  and the note field are held, since an answer then would be about whoever
  is on screen; a reason being given at that moment is dropped, and the
  answer and a half-written note start afresh for each person. A switch that
  fails says so under the switcher. `anonymised` is enforced here, not left
  to the host: the name, the avatar, the cover and the profile link are
  never drawn, the switcher names nobody ("Candidate 2") and shows no faces,
  and the questions say "this candidate", whatever `person` and `people`
  hold. What the host passes as an employer's name or a note is the host's
  to redact. There is no prop for a record: a note is its words and who they
  are from, the grade and the fit are passed on field by field, and every
  root takes an id, a class, a style and `data-` and `aria-` attributes and
  drops anything else, so a field spread in by mistake, off a record or a
  view model, is never written into the page as an attribute, nor taken for
  a section's heading. `readOnly` shows the answer and the notes and takes
  none, for someone who can't act for the reader. `titleLevel` puts the name
  under a page's own h1; every section sits one level under the name, the
  reader's answer and notes among them, and each role and line of education
  one under that, so the outline skips no level. A word longer than its
  line, such as a link pasted into a note, wraps inside the profile and
  isn't cut off at its edge. Printed, it is a resume: the profile loses its
  border, and the switcher, the archived notice, the profile link, the audio
  player, the answer, the notes, the credit and a career's "Show more" are
  left out, so a description folded on screen prints folded; a spoken note
  prints as its transcript. Print colours, margins and the page's surface
  are the host's page's. Wording is `labels`
  (`CandidateSharedProfileLabels`, with its defaults in
  `candidateSharedProfileLabels`), and `decisionLabels` words the Yes or No.
- `CandidateSharedProfileSwitcher`: the people one link shares, as a row of
  chips that switches between their profiles (`people`, `value`,
  `onChange`). Each chip is a toggle button, so a screen reader says which
  is showing, in a group named by the caption over it ("3 people shared with
  you"); a face beside a name is hidden from a screen reader, which has the
  name. Two people with one name are told apart by their `detail`, such as a
  company. While a promise from `onChange` is pending, or the host names who
  is `opening`, the caption says so ("Opening Mei Tanaka…"), is read out,
  and the chips are held: said to be disabled but not disabled outright, so
  the keyboard's focus stays on the chip that was pressed. A promise that
  rejects, or an `onChange` that throws, brings the chips back with a line
  under them (`labels.switchFailed`, which is given the cause, or the host's
  own `error`). With fewer than two people, or a `value` that isn't one of
  them, it draws nothing. `anonymised` names nobody and shows no face.
- `CandidateSharedProfileHeader`: who the profile is about, on
  `CandidateProfileHeader`: their face (the `avatar` slot), their name as
  the heading, their title and company (`CurrentCompanyLabel`), where they
  are and how long they have worked, and a link to their own profile beside
  it all (`CandidateProfileLinkButton`, with the host's glyph and URL). An
  `anonymised` header has the heading `labels.anonymous` and a glyph where
  the face would be: never initials, which would be somebody's.
- `CandidateSharedProfileVoiceNote` and `CandidateSharedProfileNote`: what
  whoever shared the profile says about the person. The spoken note is a
  player over its transcript (`src`, `transcript`), through the host's own
  player with `renderAudio`, as `CandidatePresentationRecorder` takes one.
  The written note is its words under who it is from (`text`, `author`).
- `CandidateSharedProfileFit`: how well the person fits a role (`roleTitle`):
  the grade as a `CandidateGradeBadge` in the host's own wording and tone
  (`grade`), a line on why (`summary`), and the evidence, each line with its
  sentiment as a dot and a word a screen reader says (`evidence`, as
  `CandidateSummaryBullets` takes them). The tone and the dots print in
  colour, so a printed caution doesn't read like a strength. With no grade,
  summary or evidence it draws nothing.
- `CandidateSharedProfileAnswer`: the reader's Yes or No with why, as a
  section of the profile: `CandidateClientDecision` under a heading, asking
  why in a dialog or, with `reasonPrompt="sheet"`, voice first.
  `reasonOptional`, `reasonSuggestions`, `readOnly` and `disabled` are the
  decision row's own. The heading is the kit's small section header, said at
  `titleLevel` (2 unless told otherwise), so it is a section of the profile
  in the page's outline. On a touchscreen Yes, No and Change are each a 44px
  target.
- `CandidateSharedProfileNotes`: the notes the reader has left on the
  person, and room for another (`notes`, `onAdd`), on `CandidateNoteCard`
  and `CandidateNoteComposer`, under the kit's small section header with a
  count, said at `titleLevel`. It is spoken first where dictation can run
  (the host's `DictationProvider`, or the browser's speech recognition) and
  typed otherwise, or with `voice={false}`; no composer is drawn until it is
  known which, so a page rendered on a server never opens one way and turns
  into the other. A typed note that doesn't save stays in the field with
  `labels.noteFailed`, which is given what the host's promise rejected with.
  A spoken note holds the composer while it saves, so it can't be sent
  twice; one that doesn't save, or runs past `maxLength`
  (`labels.noteTooLong`), is put in the field, so it needn't be said again.
  A note is its words, who it is from ("You" unless the host says) and when,
  and nothing else.
- `CandidateSharedProfileSection`: a heading over the host's own content,
  for a section of its own that sits and prints like the profile's
  (`title`, `titleLevel`, and `printVisibility="hidden"` to leave it off
  paper).
- `CandidateShareDialog`: the dialog that makes a link to a candidate's
  profile and hands it over, with every part optional. At the top, the
  person's summary: their `avatar`, name and `headline`, and the sharer's
  own `reason` for putting them forward. Then who the link is for, from the
  host's `audiences` (`CandidateShareAudience`: an id, a label, a
  `description` of what that audience sees, its own `fields` as a slot whose
  values the host holds, `ready` to hold the share button until they are
  filled in, and `live` where a link for it already exists, which its chip
  says); whether the page names the person (`anonymisable`: "Named" or
  "Anonymised", each radio named by its title and described by the line
  under it); and a note for whoever opens it, typed (`note`,
  `noteMaxLength`) or spoken through a `recorder` slot, such as
  `CandidatePresentationRecorder`. With both, they sit behind a switch, the
  recorder first unless `defaultNoteFormat` says `written`, and the side not
  showing stays mounted, so a take is never lost to the switch. The host
  makes the link: `onShare` is given the choices (`CandidateShareChoices`:
  the audience, whether it is anonymised, and the note, trimmed) and returns
  the link or a promise for it, and the dialog holds its controls meanwhile.
  The link then shows cut short (`candidateShareLinkText`, with the whole
  link in its tooltip) with Copy and a line saying it is ready, which is in
  the dialog from the start so a screen reader announces it. Copy writes to
  the clipboard inside its own click, since some browsers take a write only
  from the gesture, says "Copied", announces it, and goes back to Copy;
  where the browser refuses, or has no clipboard to ask, the whole link is
  put in a field, focused and selected, to copy by hand. `copyOnShare`
  copies in the click that makes the link: the clipboard is asked there for
  a link that arrives later, a browser that can't be asked ahead is written
  to once the link is here, and one that refuses leaves the link with its
  Copy button and claims nothing. A host that already has a link for the
  choices passes it as `url`: it shows beside the form with Copy, and the
  share button says "Save changes"; with no `onShare` the dialog is the link
  and its Copy alone. A `live` audience whose link the host doesn't pass
  says so (`liveDescription`, or `labels.live`) in place of everything it
  would ask, and makes no second one. A promise that resolves with no link
  closes the dialog, for a host that shows the link somewhere else; one that
  rejects, or an `onShare` that throws, keeps the dialog as it was with
  `labels.failed`, which is given the cause. `waitingFor` holds the share
  button and shows on it, such as a recording still uploading, and `error`
  shows an error of the host's own. Every opening starts afresh from
  `defaultChoices`, with the first audience that isn't live, and a share
  that settles after the dialog has been opened again is dropped; a host
  that keeps a link's note or audience passes them as `choices` and hears of
  each change through `onChoicesChange`. It fetches nothing and stores
  nothing. It is the kit's responsive dialog, a centred dialog or a bottom
  sheet on a phone; what it holds for one opening (the choices, a share on
  its way, the link) is kept above that swap, so a window narrowed or a
  tablet turned loses none of it. Wording is `labels`
  (`CandidateShareDialogLabels`, with its defaults in
  `candidateShareDialogLabels`).
- `CandidateClientDecision` takes `reasonPrompt="sheet"`, which asks why in
  the voice-first `CandidateDecisionReasonSheet` in place of the typed
  dialog: speaking is the default, a suggested reason is one tap, typing is
  a tap away, and Skip saves with no reason where `reasonOptional` allows
  it. The sheet is downloaded only by a row that asks through it, as the row
  mounts, so a row that asks in the dialog never fetches the kit's `Chat`;
  if the download fails, the row asks in the dialog, and the page it sits on
  stays up. A save that fails stays in the sheet, with the reason and the
  sheet's own error; if the sheet was closed meanwhile, the row says so
  under its buttons. `reasonSheet` passes the sheet's own settings (its
  wording, footer, actions and dictation), as an object or as a function of
  the answer being explained; they are taken one by one, so nothing else
  such an object carries changes who the sheet is about or what it requires.
- `CandidateClientDecision` takes `disabled`, which keeps Yes, No and Change
  and holds them, dropping a reason being asked for when it turns on, and
  `padding="none"`, which sits the row flush, with no keyline, in a
  container that already pads and rules it. Without them nothing changes: it
  is a review card's action row.
- `CandidateDecisionButtons` takes `disabled`, which holds both buttons.
- `CandidateNoteComposer`'s `labels` take `input`, the text field's name
  for a screen reader, and `error`, the line under a note that didn't save.
  Both are the kit composer's own, there in 1.16.0, the oldest kit this
  package runs on; the five labels hosts have always passed are unchanged.
- `CandidateCareerHistoryTimeline` takes `titleLevel`, the heading level of
  each role's title: 5 as before, or 3, 4 or 6 to sit one under whatever
  heads the history, so a page's outline skips no level. Only the tag
  changes, and when it is given the "Earlier" label is said at the same
  level.

### Fixed

- `CandidateClientDecision`: Yes, No and Change are held while a save is on
  its way. The dialog that asks why could be closed with Escape while a slow
  save was pending, leaving the buttons live, so a second answer could be
  sent on top of the first and the two would land in whichever order they
  arrived.
- `CandidateCareerHistoryTimeline`: a role's description is set in the muted
  tone whether it is a paragraph, a host's own node or a bulleted list. The
  paragraph and the node were in the fainter `subtle` tone, about 2.5:1
  against the page on the kit's neutral palette, under the contrast body
  text needs.

## 0.25.0

The client's search page is built on kit primitives that `@epicbagel/saas-kit`
1.16.0 already has (`Chat`, `PageShell`, `PageHeader`, `Suggestion`,
`ResponsiveDialog`), so the minimum kit version doesn't move. Two things a
newer kit's `Chat` adds still reach a host that has one: the agency's turns in
the conversation are named from kit 1.26.0, which draws a turn's author, and
`mobileCompactSuggestions` (kit 1.20.0) or any later setting passes through
the conversation's `chat` prop. On 1.16.0 the turns are simply unnamed.

### Added

- `ClientSearchPage`: a search as the person it is run for sees it, as one
  page built from display values and callbacks. While the search is a `draft`
  it is the conversation that gets the brief ready
  (`ClientSearchConversation`). Once it is open the page is managed, with no
  reply box, and shows in order: a question put to the reader with its
  suggested answers, or `labels.reading` while their reply is being read
  (`awaitingReply`); the search under way with its reasoning (`searching`,
  `liveSteps`); what they can ask for next (`actions`); each delivery newest
  first (`deliveries`, given oldest first), with a Yes or No on each person
  and how that run searched; any run that delivered nobody (`otherRuns`); and
  the brief. Over both is a header: the `title`, an `eyebrow` such as a link
  back, the `subtitle` followed by the current step ("Now: Shortlist to
  review", `labels.now`), and buttons that open the brief and the progress
  (`steps`). `call` is how a call is booked, a link (`href`), a callback
  (`onSelect`) or both: an open search offers it in the header, and a draft
  as the current step's next action (`labels.callInstead`) unless the step
  has its own. The page fetches nothing, navigates nowhere and holds no
  timer: the host passes new values when there are some, and everything the
  reader does goes out through `onReply(words, files)`, `onAnswer(answer)`
  (which defaults to `onReply` with no files), `onAction(action)`,
  `onDecide(person, decision, reason)` and `call`. A promise from `onAnswer`
  or `onAction` holds both the answers and the actions until it settles, so
  the two never cross, and a rejected one brings them back with
  `labels.failed` in the section it was sent from. `actionsNeedCall` offers
  the actions but opens a prompt to book a call in place of `onAction`;
  `callPromptOpen` and `onCallPromptOpenChange` let a host open that prompt
  itself, such as when its server turns a request down. `readOnly` shows the
  same page with nothing to send, for someone who can't act for the reader,
  such as the team that runs the search: no composer, no suggested replies,
  no answers or requests to press (they show as text), no Yes, No or Change,
  no call and no step's `action`; what only opens or folds (the brief, the
  progress, a run's steps) still does. `reasonOptional`, `reasonSuggestions`,
  `maxFiles`, `chat`, `briefOptions` and `markdownComponents` pass to the
  sections that use them, and `decisionLabels`, `traceLabels` and
  `progressLabels` word the components it is built from. It fills its
  container's height, the header staying put while the rest scrolls, so it
  needs a container with a height of its own; an open search's sections
  scroll in a region the keyboard can reach, named by `labels.sections`.
- `ClientSearchConversation`: the kit's `Chat`, as the whole surface, over a
  search's `thread`: each turn (`ClientSearchTurn`: who said it, the words as
  Markdown, when, and the names of its files), each version of the brief
  under the turn that wrote it (`JobBriefCard` as a preview, badged "v2 ·
  Current" or "v1 · Earlier"), and each delivery where it landed. The
  composer stages the files the reader picks, up to `maxFiles` (5; 0 leaves
  files out; picking more keeps the first and says so), and `onReply(words,
  files)` is handed the words and the files themselves. A suggested reply
  (`suggestedReplies`) goes alone, leaving the draft and the staged files
  where they are. While a promise from `onReply` is pending the composer is
  held under a running line (`labels.sending`); when it resolves the files
  it sent leave the composer; when it rejects the words go back, the files
  stay, focus returns to the composer and `labels.failed` shows under it.
  `awaitingReply` holds the composer under `labels.reading`. The kit Chat's
  other settings (`voice`, `attachmentAccept`, `fileDrop`,
  `onOpenAttachment` and the rest) pass through `chat`, and dictation runs
  through the host's `DictationProvider`, as the kit's mic does everywhere.
  `readOnly`, or no `onReply`, shows the thread alone.
- `ClientSearchQuestion`, `ClientSearchLive` and `ClientSearchNextActions`:
  the three sections at the top of an open search, each on the kit's Card
  under a heading that names the section (an h2, or `titleLevel` 3 or 4).
  The question is Markdown over its suggested `answers`, one tap each
  (`onAnswer`). The live search says who is searching and what to expect
  (`labels.searchingFirst`, or `labels.searchingMore` with `more`, or the
  host's `description`) over the run under way as a live `SourcingTrace`.
  The next actions are `ClientSearchAction`s (an id and a label), one tap
  each (`onAction`), and nothing is drawn with none. A promise from either
  callback holds the section's controls, marked `aria-busy`, and a rejected
  one, or a callback that throws, brings them back with `labels.failed`;
  `disabled` holds them from outside, and `readOnly`, or no callback, lists
  them as text.
- `ClientSearchDelivery`: one delivery of people. Its `title` and
  `description` head a `CandidateShortlist` of a `CandidateReviewCard` for
  each `ClientSearchPerson` (a name, and optionally an avatar, cover,
  headline, header actions, facts, `evidence` lines under "Why we picked
  them", a `decision` and the reader's own `reason`), each with a
  `CandidateClientDecision` under it, then how the run that found them
  searched (`runSteps`), folded to one line. A person is display values only:
  there is no field for a record and none for notes, so a card shows no more
  than the host passed. `onDecide(person, decision, reason)` saves an answer;
  `readOnly`, or no `onDecide`, shows the answers and takes none.
- `ClientSearchBriefPanel` and `ClientSearchProgressPanel`: the brief
  (`JobBriefCard` over `jobBriefView`, read only) and the progress
  (`JobSearchProgress`), each behind a button that opens it in the kit's
  responsive dialog, a centred dialog or a bottom sheet on a phone.
- `ClientSearchCallPrompt` and `ClientSearchCallButton`: a prompt, opened by
  the host, that says what was asked for needs a call first, and the control
  that books one, a link where `call.href` is given (in a new tab with
  `external`) and otherwise a button that calls `call.onSelect`.
- `ClientSearchLabels`, with its defaults in `clientSearchLabels`: the fixed
  words of the page and of every section of it, in one object. `failed` is
  given what the host's promise rejected with, so a host can say why where it
  knows (a file was too large) and something general where it doesn't.
- `clientSearchThread`: puts a search's turns, brief versions and deliveries
  in one order. Everything is ordered by time, read as an instant (a string
  in any precision or offset, a number or a Date); at one instant a turn
  comes first, then a brief, then a delivery, and within a kind the order
  given holds. A brief that names its turn (`replyTurnId`) sits straight
  under that turn; one that names none, or a turn the search doesn't hold,
  takes its own place by time. The highest `revision` is marked `current`,
  and a time that can't be read puts its item last. The host's own records
  come back untouched in each item (`ClientSearchThreadItem`). It also ships
  from `@recruiteros/recruit-ui/recruit/client-search-thread`, a subpath
  without a client boundary, so a server can call it.
- `CandidateClientDecision` takes `reasonOptional`, for a host whose clients
  may answer without saying why. The dialog still asks, its field labelled
  "Why? (optional)" unless `labels.reason` words it, the confirm button is
  enabled with no reason, and `onDecide` is called with an empty string.
  Without it nothing changes: the reason is required.
- `CandidateClientDecision` takes `readOnly`, for someone looking at a
  client's shortlist who can't answer for them. The row shows the recorded
  answer in the third person with its reason (`labels.readOnlyYes`, "Said
  Yes"; `labels.readOnlyNo`), or `labels.unanswered` ("No answer yet"), with
  no Yes, No or Change, and is marked `data-read-only`. The three labels are
  optional in `CandidateClientDecisionLabels`, so code that builds the whole
  object needn't change.

### Fixed

- A registry install now gets `CandidateClientDecision`, `JobSearchProgress`
  and `SourcingTrace`, with the timeline `SourcingTrace` draws. The four
  files were added in 0.22.0 and 0.23.0 without being listed in
  `registry/recruit-workflows.json`, so the package shipped them and the
  registry didn't. `pnpm validate:registry` now fails when a source under
  `src/recruit` is missing from the catalog, or a listed file imports one
  that isn't listed.

## 0.24.0

Both new components are built on kit primitives that `@epicbagel/saas-kit`
1.16.0 already has (`Chat`, `Dialog`, `ResourceList` in board mode), so the
minimum kit version doesn't move.

### Added

- `CandidateDecisionReasonSheet`: the voice-first "Why?" asked once a
  reviewer has said Yes or No. It is the kit's `Chat` as a one-shot prompt
  inside the kit's `Dialog`: speaking the reason is the default, a suggested
  reason (`reasons`) is one tap, typing is a tap away, and each calls
  `onConfirm(reason)`. Skip calls it with no reason, unless `reasonRequired`
  takes Skip away; the close button and Escape call `onClose` and decide
  nothing. `decision` and `candidateName` only word the defaults ("Why no?",
  "Skip — just mark No"), which `title`, `subtitle`, `voiceTitle`,
  `skipLabel` and `labels` replace, so any other question, such as why a
  candidate declined, is the host's wording with no `decision`. `footer` puts
  host content over the bottom row, such as a switch that changes what the
  decision does, and `actions` puts host controls in that row before Skip.
  While a promise from `onConfirm` is pending the sheet shows `labels.saving`
  in place of the composer; if it rejects, the composer comes back with the
  typed or spoken reason and `labels.failed` under it. Dictation runs through
  the host's `DictationProvider`, as the kit's mic does everywhere, or the
  browser's speech recognition without one; where neither can run, or with
  `voice={false}`, the sheet opens on the typed reason. Clicks and key
  presses inside it never reach a clickable card it is rendered in, it keeps
  its focus when opened from another dialog, and closing it returns focus to
  the control that opened it.
- `CandidatePipelineBoard`: a job's pipeline as a board, with a column for
  each stage (`columns`: an id, a title and an optional `count` and `tone`)
  and a card for each person (`items`, `getId`, `getStage`, `getName`).
  `renderCard(item, stage)` draws a card, by default a
  `CandidatePipelineCard` with the name that calls `onSelect`. It is the
  kit's board (`ResourceList` in board mode), which takes the drag and, below
  768px, shows one stage at a time. The kit moves a card by mouse only, so
  each card also has a move menu, which is how a keyboard or a touchscreen
  moves one: over the card's corner and shown on hover or focus where a mouse
  can hover, and beside the card, always shown, anywhere else, at 44px on a
  touchscreen. It stands in for the kit's own per-card select on a phone, so
  there is one move control at every width. `onMove(item, toStage)` may
  return a promise: the card shows in its new stage while the move saves and
  goes back if the promise rejects. Once it resolves, the card stays where it
  was moved until the host says something new about the person, by passing
  another record for them or changing their stage, and `items` decide from
  then on: a host that reloads after saving shows no flicker, and the board
  never keeps a move the host's own data doesn't have. A move is announced to
  a screen reader (`labels.moved`, `labels.moveFailed`) and focus follows a
  card moved from its menu. Each column says why it is empty, differently
  when a search or a filter is narrowing the board (`narrowed`, worked out
  from `searchTerm` and `filters` when left out); a board holding nobody
  shows `empty` in place of its columns, `loading` draws skeleton cards and
  `error` a failed load. The kit's toolbar props (`searchTerm` and
  `onSearchChange`, `filterSchema`, `filters` and `onFiltersChange`,
  `quickFilters`, the sort props, `actions` and `filterActions`) pass
  straight through, each shown only when wired; the board narrows nothing
  itself, so the host passes the `items` that match. `columnWidth` (`wide`,
  400px, or `narrow`, 280px) and `height` (`viewport`, each column scrolling
  under its heading, or `content`) size it, and `columnHeadingLevel` fits its
  headings to the page's outline. A long name or headline truncates inside
  its card: in the kit's board alone it widens every card in the column past
  the column's edge.
- `CandidateDecisionReasonDialog` takes `reasonOptional`, for a quick
  decision where a reason helps but mustn't slow it down, such as one on
  several people at once. The confirm button is then enabled with no reason,
  `onSubmit` is called with an empty string, and the field's label defaults
  to "Why? (optional)". Without it nothing changes: the reason is required.

### Changed

- `CandidateDecisionReasonDialog`'s reason field tells a screen reader
  whether it is required (`aria-required`).

### Fixed

- `CandidateDecisionReasonDialog`: tapping a suggestion after typing only
  spaces starts the reason with the suggestion. It used to join the
  suggestion onto the spaces, and submit "· Too senior".

## 0.23.0

### Added

- `SourcingTrace`: how a sourcing run went, for the person the search is run
  for. A line per step (`SourcingTraceStep`: a key, a title, a status of
  `pending`, `running`, `done`, `error` or `skipped`, and an optional
  description and Markdown detail), each with a glyph a screen reader names
  (`labels`). A `live` run shows every step, the running one shimmering with
  its detail open; any other run folds into one line ("How Scout searched ·
  3 of 5 steps done · stopped") that opens to its steps, a step it left
  unfinished shown stopped. `markdownComponents` takes a host's Markdown
  overrides. `sourcingStepShownStatus()` and `sourcingTraceSummary()` are the
  rules it draws by. Its timeline is adapted from Prompt Kit's ChainOfThought
  (MIT; see `THIRD_PARTY_NOTICES.md`).

## 0.22.0

### Added

- `JobSearchProgress`: where a search stands, for the person it is run for.
  Its steps in order (`JobSearchStep`: a title, a state of `done`, `current`
  or `upcoming`, and an optional description, meta and action), each a kit
  timeline row with a glyph and a visually hidden word for its state
  (`labels`), the current one marked `aria-current="step"` with its next
  action under it. The host decides the steps and which is current.
- `CandidateClientDecision`: a client's Yes or No on a candidate, with why,
  as the action row of a `CandidateReviewCard` on a shortlist the client
  reviews. Yes and No ask for the reason (`CandidateDecisionReasonDialog`,
  with one-tap `suggestions` for each answer) before `onDecide` is called; a
  recorded `decision` shows in words with its `reason` and a Change control;
  a failed save brings the buttons back with an error line. The host owns
  the record and every word (`labels`).

## 0.21.0

### Added

- A brief's target companies: `JobBriefContent.targetCompanies`, the
  companies a brief names as places to find people (not the kinds of company
  in `icp`, the hiring company, or a company to avoid). `jobBriefView` shows
  them as a "Target companies" section (`jobBriefLabels.targetCompanies`),
  after the role details and before the target company types, and leaves them
  out for `audience: "public"`.
- `JobBriefSection.previewCount` (and `JobBriefViewSection.previewCount`): a
  section with more items than that shows its first ones and folds the rest
  under a toggle that counts them ("Show 7 more", then "Show fewer"; the card
  labels `sectionMore` and `sectionLess`), described by the section's heading.
  `jobBriefView`'s target companies show five. A preview's "Show full brief (N
  more)" counts only the items opening it shows.
- Several entries of one list in one change line: `JobBriefChange.items` and
  `fieldPlural`, worded by the new `jobBriefChangeLabels.addedSeveral`,
  `removedSeveral`, `someEntries` and `plural` ("Added 12 target companies:
  Example Labs, Fictional Robotics, Sample Analytics and 9 more").
  `groupJobBriefChanges` reads more than three entries (its `above`) one list
  gained, or lost, in a version as one such change, in the place of the
  first.

### Changed

- `JobBriefChanges` groups a list's entries that way by default, before it
  folds its lines; `groupAbove` sets how many a list can gain or lose first
  (`Infinity` keeps a line for every change). A version that changed four or
  more entries of one list now shows one line for them.

## 0.20.1

### Changed

- A brief's further sections (target company types, the interview steps)
  set their rows `tight`, about 1.8em apart, as saas-kit 1.24.0's read-only
  `EditableList` sets the requirements, so every list in a read-only brief has
  the same rhythm. With saas-kit 1.24.0 a read-only bullet row is also its text
  height on a touchscreen, rather than a 44px row.

## 0.20.0

### Breaking

- Requires `@epicbagel/saas-kit` 1.16.0 or later for shared bullet rows and responsive scroll navigation.

### Added

- `CandidateCardList.scrollNavigation` enables the shared avatar navigator for visible candidates. It follows filtered results, preserves one- and two-column layouts, and switches to a horizontal index on narrow screens.

### Changed

- Unordered brief sections, including target company types, use the same
  bullet row as editable requirements. Dot placement, spacing, text wrapping
  and mobile alignment stay consistent. Interview steps remain numbered.

## 0.19.0

### Fixed

- `CandidateAssessment` signals now use the same body size, line height and
  muted tone as its evidence and caveats. Signal dots and accessible
  sentiment labels are unchanged.

### Added

- `CandidateSummaryBullets` accepts `presentation="body"` for small body
  text that inherits its surrounding tone. Its default `"compact"`
  presentation keeps the existing dense pipeline text treatment.

## 0.18.0

### Breaking

- `@epicbagel/saas-kit` 1.13.0 or later is required for its generic notes
  components. The peer and registry minimum is `^1.13.0`.

### Changed

- `CandidateNoteList`, `CandidateNoteCard` and `CandidateNoteComposer` now
  delegate to SaaS Kit's `NoteList`, `NoteCard` and `NoteComposer`. Existing
  exports, labels and data slots are preserved. New generic consumers can use
  SaaS Kit's `Notes` with an array of attributed notes directly.
- Note saves disable conflicting actions, preserve failed drafts with an
  inline error and prevent duplicate submissions. Without a voice callback,
  the composer opens for typing. Controlled drafts are supported; their
  host clears them after a successful save.

## 0.17.0

### Breaking

- `@epicbagel/saas-kit` 1.7.0 or later is required for the public
  `document-preview` primitive. The peer and registry minimum is `^1.7.0`.

### Added

- `DocumentUploadPanel` takes an optional controlled `preview` to render
  the kit's responsive document dialog in either panel density. The host
  supplies the document title, URL, loading/error state and download/close
  callbacks; authentication, URL acquisition and persistence stay in the app.

## 0.16.0

### Added

- `CandidateInlineCard` takes an optional `cover` slot, using the same
  `CandidateCoverHeader` and 4:1 `CandidateCoverImage` frame as the full
  review card and profile. Pass the host's media directly; the shared header
  supplies the frame. The card's existing avatar, name, headline, meta,
  assessment and actions stay in the identity row below it. Clicking the
  cover opens the card, while nested links and buttons keep their own
  actions. The keyboard trigger and its focus ring surround the whole card.
  A compact card keeps its dense identity row, with the cover's natural
  height above it; without a cover, the existing fixed-height row and layout
  are unchanged. Media loading, failure handling and alt text remain the
  host's, and a failed image keeps the frame's reserved space.
- `CandidateInlineCard` and `CandidateCoverHeader` take
  `coverSize="compact"` for a condensed banner: its frame keeps the 4:1
  ratio on narrow cards and caps its actual height at 96px on wider ones,
  cropping the image at its centre. `CandidateCoverImage` takes the same
  option as `size` (`CandidateCoverImageSize`). All three default to
  `"default"`, the existing uncapped 4:1 frame.

## 0.15.0

### Breaking

- `@epicbagel/saas-kit` 1.1.0 or later is required: the peer range is
  `^1.1.0` (it was `^1.0.0`), and the registry installs that range.
  `JobBriefChanges` draws the kit's trace lines (`primitives/trace`), which
  1.1.0 added. A host on 1.0.0 upgrades the kit; nothing else changes.

### Added

- `JobBriefCard` takes `version` (`JobBriefVersion`: `number`, `current`,
  and optionally `label` and `secondaryLabel`) and draws it at the title's
  end, before any `status`, as the kit's `StatusBadge`: worded by
  `jobBriefVersionLabel`, in the success tone on the version in force now
  and the neutral tone on one a later version replaced, then any
  `secondaryLabel` (the number another system gives the same version, say)
  in a second, neutral badge. The badges name the section with the title and
  the status ("Account Executive · Example Co v3 · Current"), so versions of
  one brief stay apart in a screen reader's list of regions, and in
  `collapsible` they sit in the trigger as phrasing content. They are marked
  `data-slot="job-brief-version"` with `data-current`; each badge keeps the
  kit's own `data-slot`.
- `jobBriefVersionLabel(version, labels)`, a version's wording: "v3 ·
  Current" for the version in force now and "v2 · Earlier" for one a later
  version replaced, so the state is in words and never in a badge's colour
  alone. A number that isn't a whole number from 1 is left out, leaving the
  mark ("Current"); an empty `earlier` leaves an earlier version's number
  alone ("v2"); the version's own `label` wins. Its default words are
  `jobBriefVersionLabels` (`JobBriefVersionLabels`: `number`, `current`,
  `earlier` and `separator`), frozen.
- `JobBriefChanges`, what a version of a brief changed, for under its card:
  one quiet kit trace line per change, each led by an icon for its kind (a
  plus for added, a minus for removed or cleared, an arrow for set or
  reworded, up and down arrows for moved, a refresh for replaced) and never
  a sentiment colour, worded by `jobBriefChangeText`. The first
  `previewCount` show (3 by default) and the rest fold under a toggle, "2
  more changes", that opens them in place. The root is a group named for the
  `version` ("What changed in v3", or "What changed" without one; a host's
  `aria-label` wins), marked `data-slot="job-brief-changes"`, and each line
  carries its `data-change-kind`; the kit's trace parts keep their own
  `data-slot`. With no changes it draws nothing, as for a brief's first
  version, which is the whole brief. `labels` takes any of
  `jobBriefChangeLabels`. `@recruiteros/recruit-ui/recruit/job-brief-changes`
  is a client entry, and `JobBriefChangesProps` ships with it.
- `jobBriefChangeText(change, labels)`, one change as a line, from display
  values each app maps its own change records onto (`JobBriefChange`: the
  `kind`, the `field` as it reads mid-sentence and, where it leads a line,
  its `fieldTitle`, then the `item`, `from` and `to` the kind uses, and
  `prose`). All seven kinds (`JobBriefChangeKind`): "Added must-have:
  Python", "Removed red flag: Job hopping", 'Reworded must-have: "Python" →
  "Python 3"', 'Moved must-have "Python" to position 1', "Location: Remote →
  Hybrid", "Removed the location (was Remote)" and "Replaced the interview
  steps (3 entries)". Each value (`JobBriefChangeValue`) is shaped for a
  line: text with its whitespace collapsed and cut to 80 characters, never
  through one, with an ellipsis; a number grouped ("80,000", so a year comes
  in as text); a list counted ("3 entries"). A missing value drops its colon,
  quotes or arrow rather than leaving them dangling, a `set` to nothing from
  a value reads as `cleared`, and a kind the release doesn't know reads as a
  new value. A `prose` field, such as a role description, says only that it
  was added, updated or removed. Its wording is `jobBriefChangeLabels`
  (`JobBriefChangeLabels`), frozen, which also words `JobBriefChanges`'
  toggle (`more`) and group (`groupName`).
- The version and change helpers and their types ship from
  `@recruiteros/recruit-ui/recruit/job-brief-view`, the subpath without a
  client boundary, so a server can word a change too, and from the
  `job-brief-card` entry and the `recruit` and root barrels; the change
  helpers and types also from the `job-brief-changes` entry.

## 0.14.0

### Breaking

- `JobBriefCard` names its lists "Must-haves", "Nice-to-haves" and "Red
  flags" by default, and one entry of each "must-have", "nice-to-have" and
  "red flag", so the controls read "Add must-have…" and "Remove
  nice-to-have". It said "Must haves", "Nice to haves", "must have" and
  "nice to have". A host that wants the old words passes them to
  `jobBriefView`'s `labels`, or in the card's `ruleLabels`.
- `JobBriefCard` takes the lists' names and what one entry of each is
  called in `ruleLabels` (`JobBriefRuleLabels`), which `jobBriefView` fills
  from its own `labels`, so the lists read as the rest of the brief does.
  `labels` (`JobBriefCardLabels`) keeps only the host's wording for the
  processing notice, the in-progress blank slate and the preview's toggle
  (`processing`, `processingTitle`, `processingDescription`, `showMore`,
  `showLess`); a list name passed there (`mustHaves`, `mustHaveItem`, ...)
  is ignored. Pass it in `ruleLabels`, or to `jobBriefView`'s `labels`.

### Added

- `jobBriefView(content, options)`, which turns a brief's own fields into
  what `JobBriefCard` shows, so the same brief reads the same in every app:
  spread the result onto the card and add only the host's props
  (`presentation`, `status`, `onRulesChange`, `footer`, the open state). The
  brief comes in as `JobBriefContent`, display values under the parsed
  brief's field names, every one optional (`roleTitle`, `companyName`,
  `roleDescription`, `summary`, `location`, `salaryMin`, `salaryMax`,
  `currency`, `mustHaves`, `niceToHaves`, `redFlags`, `icp`, `roleDetails`,
  `buyingPersonas`, `interviewSteps`, `companyOverview`, `companyWebsite`).
  It returns a `JobBriefView`: the `title`; the `description`, the role
  description or else the summary; the `facts` Location, Salary and OTE; the
  three lists as written, so an editable card saves exactly what it showed;
  the `rules`; the `sections` Role details, Target company types, Buying
  personas, Interview process (in step order, numbered) and Company, then
  the host's `extraSections`, each only when it has something in it;
  `previewCount`; and `ruleLabels`, the lists' names and what one entry of
  each is called. Every value is text.
- `jobBriefView`'s options (`JobBriefViewOptions`): `current` (true by
  default) previews three facts and entries, and `current: false`, for a
  brief a later one replaced, none, so it closes down to its title and
  description; `title` (`JobBriefTitleStyle`), `role` by default or
  `generic` ("Job brief") for a page whose header already names the role;
  `audience: "public"` for a page anyone with its link can open, which
  leaves out the red flags (and their list from `rules`), the on-target
  earnings, the role details, the company section and the interviewers'
  names; `labels`; and `extraSections`, such as the named accounts a role
  targets.
- `jobBriefTitle(content, fallback)`, a brief's title: "Role · Company", or
  the role alone when there is no company, the role already names it, or
  the pair would pass 72 characters, when a longer role is cut with an
  ellipsis. A placeholder a parser writes for a missing field ("TBD",
  "N/A", "Role", "Unknown") counts as none, and quotes, markdown marks and
  extra whitespace are stripped. With no role, `fallback` ("Job brief").
- `formatJobBriefSalary(content, labels)`, a salary band in full grouped
  numbers: "60,000–80,000", one figure when both ends agree, "From 60,000"
  or "Up to 80,000". A `currency` puts its symbol before each amount
  ("£60,000"), a code through `Intl` and anything else as given; without
  one there is no symbol, never a guessed one. Null with neither end.
- `jobBriefLabels`, the default wording of a brief (`JobBriefLabels`): the
  title, the list and entry names, the fact and section names, the persona
  categories ("economic buyer") and the interview-step phrasing. It is
  frozen; `labels` overrides any of it, and a host's own text (an email, a
  form) can read the same words from it.
- `JobBriefContent`, `JobBriefRoleDetails`, `JobBriefPersona`,
  `JobBriefInterviewStep`, `JobBriefCompanyOverview`, `JobBriefView`,
  `JobBriefViewFact`, `JobBriefViewSection`, `JobBriefViewOptions`,
  `JobBriefTitleStyle`, `JobBriefLabels` and `JobBriefRuleLabels`. All of it ships from
  `@recruiteros/recruit-ui/recruit/job-brief-card` and the `recruit` and root
  entries, and from `@recruiteros/recruit-ui/recruit/job-brief-view`, a
  subpath without a client boundary, so a server component can map a brief
  too. `JobBriefRuleKind` is declared there now and still ships from the
  card's entry.

### Changed

- `JobBriefCard`'s two presentations look the same and differ only in what
  folds. The collapsible's title row is the preview's: the title in the
  card-title type (it was the trigger's small label type) and the `status`
  at the row's end, before the chevron (it sat right after the title), and
  both take the preview's inset, so the collapsible's title and body sit
  26px in rather than 16px. The whole row is still the trigger.
- `JobBriefCard`'s section is named by its title and its `status` together
  ("Account Executive · Example Co Current"), in both presentations, so
  versions of one brief stay apart in a screen reader's list of regions; it
  was named by the title alone. A host that joined them itself with
  `aria-labelledby` can drop that; a host's `aria-labelledby` still wins.
- A closed `preview` with nothing to show before its toggle (no
  description, and a `previewCount` of 0 or nothing to count) draws no
  body, so the toggle sits one gap under the title row; an empty body there
  doubled the gap.

## 0.13.0

### Added

- `JobBriefCard`, a job's brief as one section: a `description`, headline
  `facts` worded by the host (location, salary and on-target earnings, say),
  the must-have, nice-to-have and red-flag lists (`mustHaves`,
  `niceToHaves`, `redFlags`, each a kit EditableList with its sentiment dot),
  then titled `sections` such as role details, who the role sells to, the
  interview process or the company, each holding labelled facts, a bulleted
  list, or a numbered one with `ordered`, and last a `footer` slot. `rules`
  names which lists show, in order (all three by default), so a page that
  mustn't show red flags leaves them out. The root is a `section` named by
  the title, marked `data-slot="job-brief-card"` with `data-presentation`;
  each list's wrapper is marked `data-slot="job-brief-rule-list"` with its
  `data-kind`, each section `data-slot="job-brief-section"`, and the
  skeleton `data-slot="job-brief-loading"`, while the kit Card inside keeps
  its own `data-slot`. `@recruiteros/recruit-ui/recruit/job-brief-card` is a
  client entry, and the `JobBriefCardProps`, `JobBriefCardLabels`,
  `JobBriefCardPresentation`, `JobBriefRuleKind`, `JobBriefFact` and
  `JobBriefSection` types ship with it.
- `JobBriefCard` takes two `presentation`s. `collapsible` (the default),
  for a page, is a kit Card holding a CollapsibleSection whose trigger is
  the title, with the whole body folding under it; `open`, `defaultOpen`
  (false by default) and `onOpenChange` drive it. `preview`, for a message
  in a conversation, is a kit Card with the title as a heading and an
  optional `status` at its end (an "Updated" badge, say, which keeps its
  width while the title wraps). Closed, a preview shows the description
  clamped to two lines and the first `previewCount` facts and entries of
  the first shown list that has any, so an empty must-haves list hands the
  preview to the nice-to-haves (3 by default; 0 leaves the title, the
  description and the toggle), then a toggle, "Show full brief (N more)",
  that opens the rest in place; it has `aria-expanded`, `aria-controls`
  while open, and a 44px touch target on a touchscreen. Closing it from the
  toggle, which sits at the foot of the full brief, scrolls the card back
  into view (`block: "nearest"`, so a card already in view stays put). With
  nothing hidden, the whole brief shows and no toggle does. A preview's
  footer shows in both states, under the toggle.
- `JobBriefCard` takes `onRulesChange(kind, items)`, which makes the lists
  editable in place: each add, edit or remove hands the whole new list to
  the host with which list it is, and the lists stay controlled. A callback
  that returns a promise keeps the list showing what it sent, marked
  `aria-busy`, until the promise settles, then the host's lists again, so a
  save that fails reverts while the host says why; only the latest save
  settles a list. On a touchscreen a row's edit and remove buttons stay
  visible (the kit list shows them on hover or focus only) at a 44px touch
  target. A preview edits only once open, so an editable preview always
  offers its toggle. A read-only empty list draws nothing; an editable one
  keeps the kit's "None set" and its add field.
- `JobBriefCard`'s blank slates: with nothing to show and nothing to edit,
  the kit's empty state (worded by `empty`, "No brief yet" by default);
  while `processing` with nothing to show or edit yet, an in-progress one
  with a spinning icon (`labels.processingTitle`, "Reading your document",
  over `labels.processingDescription`, "The brief will fill in shortly.");
  otherwise while `processing`, the kit's Alert above the brief
  (`labels.processing`). An editable brief never gives its lists up to the
  in-progress state: a document that is never read in full would otherwise
  leave an empty brief with no way to add a rule. While `loading` with
  nothing yet, skeleton rows marked `aria-busy`. `titleLevel` (2 by default,
  or 3 or 4) sets the heading level: in a preview the title is a heading at
  it, with each list's label and each section's title a heading one level
  under; in `collapsible`, where the title is a button, the lists and
  sections take that level themselves, so the page's outline skips none.
  Only the tags change. Every fixed word is a label (`labels`): the lists'
  names, the item names their controls use ("Add must have…", "Remove must
  have"), the processing notice and blank slate, and the toggle.
- `CandidateProfileHeader` takes `titleLevel`, the name's heading level, with
  the `CandidateProfileHeaderTitleLevel` type. 1 (the default, as before)
  suits a profile that is the page; 2, 3 or 4 suit one inside something that
  already has the page's h1, such as the header of a `CandidateProfileDialog`
  over a page, so the dialog adds no second h1. Only the tag changes: at levels
  2 to 4 the header restates the kit ContactHeader's rows, gaps and name
  type from kit primitives, because the kit's name is always an h1.

### Known issues

- In `JobBriefCard`'s `collapsible` presentation the title is the label of
  the kit CollapsibleSection's trigger button, which can't hold a heading, so
  that title isn't in the page's heading outline; the section is still named
  by it, and its lists and sections sit at `titleLevel` so no level is
  skipped. A heading level on CollapsibleSection is a kit change.
- The kit EditableList names each row's buttons after the list ("Edit must
  have", "Remove must have") rather than after the entry, so a screen reader
  hears the same name on every row of a list. Per-entry names are a kit
  change.

## 0.12.0

### Added

- `DocumentUploadPanel`, `DocumentList` and `DocumentListItem`, for the files
  attached to a person or a role. `DocumentUploadPanel` is a section named by
  its `title` ("Documents" by default): an optional `kindSelect` in the header
  for the kind the next upload is filed as (a kit Select named "Document
  kind"), an `error`, the kit's `FileDropzone` (multiple files, the host's
  `accept`, busy with `labels.uploading` while `uploading`), and the list.
  The host uploads what `onFiles` receives, loads the list and renders each
  row. `DocumentList` shows a skeleton row while `loading`, the kit's empty
  state when `count` is zero (worded by `empty`, "No documents yet" by
  default), and its `children` otherwise; with no `count`, such as before a
  first load succeeds, it shows only its children. `DocumentListItem` is one
  file: a glyph, the `name`, the `kind` as a badge with a host-chosen tone,
  the host's `meta` line (size and date, say), then a `summary`, or a spinner
  and `labels.processing` while `processing`. It draws preview, download,
  re-analyse and delete buttons for the callbacks given, each named for
  screen readers after the file ("Download brief.pdf"); delete asks to
  confirm in the row first, moving focus to Cancel and back. A download,
  re-analyse or delete callback that returns a promise shows its button busy
  until it settles, so the host needn't track which row is busy;
  `downloading` and `reanalysing` show it busy from outside. Each takes
  `density`: `default` for a page or tab of its own, where the summary takes
  the row's full width, and `compact` for a pane, one dense row under a
  counted section header (`SectionHeader`, the count shown only above zero)
  with the kit PanelSection's `border`. The roots are marked
  `data-slot="document-upload-panel"`, `"document-list"` and
  `"document-list-item"`, the kind select's trigger
  `data-slot="document-kind-select"`, and
  `@recruiteros/recruit-ui/recruit/document-list` is a client entry.
- `formatFileSize`, which reads a size in bytes as "512 B", "180 KB" or
  "2.4 MB", and a missing size as an em dash (or the `empty` text given).
- `CandidateOutreachDraftList`, the messages drafted to a person, one card
  per draft: the channel (its `label` and an optional `icon`), the draft's
  status as a badge (`draft`, `approved`, `sent` or `dismissed`, worded by
  `labels.status`), the subject when there is one and the message with its
  line breaks kept. Each card has the kit's `CopyButton`, which copies
  `copyText(draft)` (by default `outreachDraftCopyText`: the subject line,
  then the message); Approve and Dismiss while the draft is still a draft,
  and Mark sent once it is approved, each only when its callback is given.
  Every button is named for screen readers after the draft's channel ("Copy
  Email draft", `labels.actionName`), and a callback that returns a promise
  disables the card's buttons, with a spinner on the one pressed, until it
  settles. The callbacks receive the host's own draft object, so it can
  carry its own fields. The list sits under a heading counted only above
  zero, shows a skeleton row while `loading` with no drafts yet, and the
  kit's empty state when there are none (worded by `empty`, "No outreach
  drafts yet" by default). The root is the kit PanelSection, a section named
  by its title and marked `data-slot="candidate-outreach-draft-list"`; each
  card is marked `data-slot="candidate-outreach-draft"`, and
  `@recruiteros/recruit-ui/recruit/candidate-outreach-drafts` is a client
  entry.
- `CandidateOutreachDraftList` takes `availableActions(draft)`, which names
  the status actions (`approve`, `dismiss`, `markSent`) each draft offers, so
  a workflow without an approval step can offer Mark sent on a draft. It
  defaults to `defaultOutreachDraftActions`: Approve and Dismiss while a
  draft is a `draft`, Mark sent once it is `approved`, and none after. A
  button still shows only when its callback is given too.
- `CandidateAddToJobPopover`, which adds one or more people to a job: a
  select for the job (`jobs`, with an optional `defaultJob`), one for the
  stage they land at (`stages`, each read as "at <stage>" by
  `labels.stageOption`, starting at `defaultStage` or the first), and
  Confirm, which calls `onConfirm(job, stage)`. With `assessors` and
  `onAssess`, a toggle offers a second mode that picks an assessor and calls
  `onAssess(job, assessor)` instead; `assessIcon` is its glyph. The heading
  counts the people when `count` is above one ("Add 3 candidates to a job").
  The popover closes once the callback settles, and stays open with its
  choices if it throws, so the host reports the failure in its callback. The
  host's own `trigger` opens it, or an outline "Add to job" button; every
  select is named (`labels.job`, `labels.stage`, `labels.assessor`), and an
  empty `jobs` shows the kit's empty state inside the job select (`empty`).
  Each time it opens it starts again from `defaultJob` and `defaultStage`,
  and a job or stage its options no longer list counts as no pick, so a job
  the person was just added to, which the host then leaves out of `jobs`,
  is never submitted twice; a `defaultJob` that arrives later is picked on
  the next open. The popover surface is marked
  `data-slot="candidate-add-to-job-popover"`, and
  `@recruiteros/recruit-ui/recruit/candidate-add-to-job-popover` is a client
  entry.
- `CandidatePresentationRecorder`, which records a short voice note to send
  with a person's profile: Record, a running clock, Stop, then a player for
  the take. Each take goes to `onAccept(blob, mimeType)` as soon as recording
  stops; while it runs the recorder shows Uploading, and if it throws the
  take stays playable with Retry and Discard and the error's message shows
  under the controls, so nobody has to record it again. `existingAudio`
  stays playable until a new take is accepted (the button then reads
  "Record a replacement"); `externalState` shows `uploading` or
  `transcribing` from outside; `onPendingChange` reports whether a take is
  in progress or unsaved; `renderAudio` replaces the browser's own audio
  controls with the host's player. Every line, including the microphone
  errors, is a label. The root is marked
  `data-slot="candidate-presentation-recorder"`, and
  `@recruiteros/recruit-ui/recruit/candidate-presentation-recorder` is a
  client entry.
- `supportedRecordingMimeType`, the first audio format the browser's
  MediaRecorder can write (MP4 before WebM and Ogg), or "" without one.
- `CandidateInlineCard` takes three options for a comfortable card that
  stands on its own, such as a row in a short list shared with a client:
  `nameSize="lg"` sets the name at the kit's section-title size (it stays an
  `h5`), `headlineWrap` lets the headline wrap instead of ending in an
  ellipsis, so a long title and company read in full on a phone, and
  `actionsAlign="center"` centres the actions on the card's height, for a
  lone chevron. Each defaults to the card as before (`default`, `false`,
  `start`), and a compact card ignores them. The headline is now marked
  `data-slot="candidate-inline-card-headline"`.
- `CandidateProfileHeader` takes `actionsPlacement`. `name` (the default, as
  before) puts `actions` on the name line; `aside` sets them in a column of
  their own beside the whole identity, top-aligned, in a kit Stack row that
  keeps its width (4px apart) and is marked
  `data-slot="candidate-profile-header-actions"`, so a control taller than
  the name's line, such as an icon button beside a large avatar, doesn't
  push the meta away from the name.
- `CandidateProfile` takes `printMode`: `default` (as before) prints the card
  as it looks on screen, and `flat` prints it without its border, so a
  printed profile reads as a page.
- `CandidateProfileFooter` takes `justify` (`start`, the default and as
  before, `center`, `end` or `between`), `padding` (the kit PanelSection's:
  `default`, as before, for a row of actions, or `compact` for a one-line
  credit) and `printVisibility` (`hidden` leaves the footer off paper).
- `CandidateShortlistNote`, a personal note from whoever presents a
  shortlist, set above it on the kit's Card: the sender's `avatar`, a `title`
  such as "A note from Jordan" and a `meta` line such as their role, then the
  `message` set as rich text (the kit's RichText; pass paragraphs, or
  Markdown the host has already rendered and sanitised), an optional `media`
  slot such as an embedded video, and a last line with a `signature` such as
  "— Jordan" beside an `action` such as a link to book a call. The title is
  a kit Heading at `titleLevel`: an h2 by default, so the note adds no second
  h1 to the page it sits on, or 3 or 4 where it sits deeper in the page's
  outline. Only the tag changes; the title looks the same at every level.
  Each part shows only when given, and the last line is left out when it
  would hold neither. The root keeps the Card's own `data-slot`.
- `CandidateShortlist` takes `emptySize`: `inline` (the default, as before)
  for a shortlist inside a message, pane or card, or `md` for one that is
  the main list on a page of its own, such as a shortlist page sent to a
  client.

### Fixed

- `CandidateShortlist`'s `status` keeps its width. It sat in the heading row
  as a shrinkable item, so on a narrow screen a long status badge, such as
  "Identities shared on engagement", squeezed onto two lines while the title
  kept its room; it now sits in a slot that doesn't shrink (as the kit
  Section's action does), and the title wraps instead.

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
