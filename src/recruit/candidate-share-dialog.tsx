"use client";

import { Alert, AlertDescription } from "@epicbagel/saas-kit/primitives/alert";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@epicbagel/saas-kit/primitives/field";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { RadioGroup, RadioGroupItem } from "@epicbagel/saas-kit/primitives/radio-group";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@epicbagel/saas-kit/primitives/tabs";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Textarea } from "@epicbagel/saas-kit/primitives/textarea";
import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { ChoiceChips } from "./choice-chips";

/** Someone a link can be made for, as the dialog offers them. */
export interface CandidateShareAudience {
  /** Tells the audience from the others, and tells the host which was picked. */
  id: string;
  /** Its name on the picker, such as "The client". */
  label: string;
  /** What that audience sees when they open the link, under the picker. */
  description?: ReactNode;
  /**
   * Further fields this audience's link needs, such as where they book a
   * call, under the description. The host draws them and holds what is
   * typed in them: the dialog passes none of it to `onShare`.
   */
  fields?: ReactNode;
  /** `false` holds the share button until the audience's own fields are filled in. */
  ready?: boolean;
  /**
   * A link for this audience is already live. Its chip says so. Unless the
   * host also passes that link as `url`, the dialog says so in place of
   * everything it would ask for that audience, and makes no second one.
   */
  live?: boolean;
  /** What to say about the live link, in place of `labels.live`. */
  liveDescription?: ReactNode;
}

/** The two sides of the note: a recording, or typed words. */
export type CandidateShareNoteFormat = "voice" | "written";

/** What the person sharing chose, as `onShare` is given it. */
export interface CandidateShareChoices {
  /** Who the link is for: the `id` of one of `audiences`, or nothing when the dialog offers none. */
  audience?: string;
  /** The page hides who the person is. Always `false` unless the dialog is `anonymisable`. */
  anonymised: boolean;
  /** The typed note for whoever opens the link, trimmed, or an empty string. */
  note: string;
}

/** The fixed words of the share dialog. Pass `labels` to change any. */
export interface CandidateShareDialogLabels {
  /** The dialog's title, given who is being shared. */
  title: (name: string) => ReactNode;
  /** A line under the title, which also describes the dialog to a screen reader. None by default. */
  description: ReactNode;
  /** Over the sharer's own reason in the summary. */
  reason: ReactNode;
  /** Over the audiences, and their group's accessible name. */
  audience: string;
  /** On the chip of an audience with a live link. */
  liveBadge: ReactNode;
  /** Under the picker, for an audience whose live link the dialog wasn't given. */
  live: ReactNode;
  /** Over the choice between a named page and an anonymised one, and its accessible name. */
  visibility: string;
  /** The named choice, and the line under it. */
  named: ReactNode;
  namedDescription: ReactNode;
  /** The anonymised choice, and the line under it. */
  anonymised: ReactNode;
  anonymisedDescription: ReactNode;
  /** Over the note, and the note field's accessible name. */
  note: string;
  /** Under the note field. */
  noteDescription: ReactNode;
  /** The note field, while it is empty. */
  notePlaceholder: string;
  /** The accessible name of the switch between a spoken note and a written one. */
  noteFormat: string;
  /** That switch's two sides. */
  voiceNote: ReactNode;
  writtenNote: ReactNode;
  /** Over the link, and the link field's accessible name. */
  link: string;
  /** The share button before there is a link, given whether sharing also copies it. */
  create: (copies: boolean) => ReactNode;
  /** The share button where the host already has a link for these choices. */
  update: (copies: boolean) => ReactNode;
  /** The share button while the host makes the link. */
  sharing: ReactNode;
  /** Said once the link is made. */
  ready: string;
  /** The copy button. */
  copy: ReactNode;
  /** The copy button once the link is on the clipboard. */
  copied: ReactNode;
  /** Said once the link is on the clipboard. */
  linkCopied: string;
  /** Said when the browser wouldn't take the link, which is then selected to copy by hand. */
  copyFailed: string;
  /** Closes the dialog once the link is made. */
  done: ReactNode;
  /** A link that couldn't be made, given what the host's promise rejected with. */
  failed: (cause: unknown) => string;
}

/** The default wording of the share dialog. Pass `labels` to change any of it. */
export const candidateShareDialogLabels: Readonly<CandidateShareDialogLabels> = Object.freeze({
  title: (name: string) => `Share ${name}`,
  description: "",
  reason: "Your reason",
  audience: "Who is this link for?",
  liveBadge: "Live",
  live: "A link for them is already live. Stop sharing it to make a new one.",
  visibility: "How they appear",
  named: "Named",
  namedDescription: "Shows their name and photo.",
  anonymised: "Anonymised",
  anonymisedDescription: "Leaves out their name and photo.",
  note: "A note for them",
  noteDescription: "Optional. It shows above the profile.",
  notePlaceholder: "Why should they meet this person?",
  noteFormat: "Note format",
  voiceNote: "Voice note",
  writtenNote: "Written note",
  link: "Link",
  create: (copies: boolean) => (copies ? "Create and copy link" : "Create link"),
  update: (copies: boolean) => (copies ? "Save and copy link" : "Save changes"),
  sharing: "Creating link…",
  ready: "Your link is ready.",
  copy: "Copy",
  copied: "Copied",
  linkCopied: "Link copied.",
  copyFailed: "Copying didn't work in this browser. The link is selected, so you can copy it yourself.",
  done: "Done",
  failed: () => "That link couldn't be made. Try again.",
});

/**
 * A link as a person reads it: without its scheme, a leading "www." or a
 * trailing slash, and cut with an ellipsis once it runs past `maxLength`
 * characters. The whole link is what is copied.
 */
export function candidateShareLinkText(url: string, maxLength = 36): string {
  const text = url
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
  return text.length > maxLength ? `${text.slice(0, Math.max(1, maxLength - 1))}…` : text;
}

export interface CandidateShareDialogProps {
  open: boolean;
  /** Called when the dialog should close: from its close control, Done, or a share that made no link to show. */
  onOpenChange: (open: boolean) => void;
  /** Who is being shared, for the title and the summary. */
  candidateName: string;
  /** Their face in the summary, usually the kit's PersonAvatar at 44px. */
  avatar?: ReactNode;
  /** Under their name in the summary, such as their title and company. */
  headline?: ReactNode;
  /** The sharer's own reason for putting them forward, under the summary. */
  reason?: ReactNode;
  /**
   * Who the link can be for. With none, the dialog doesn't ask, and
   * `onShare` gets no `audience`.
   */
  audiences?: readonly CandidateShareAudience[];
  /** Offers the choice between a page that names the person and one that doesn't. */
  anonymisable?: boolean;
  /** Offers a typed note for whoever opens the link. */
  note?: boolean;
  /** The longest note the field takes. */
  noteMaxLength?: number;
  /**
   * A recorder for a spoken note, such as `CandidatePresentationRecorder`.
   * The host owns the recording and what happens to it. With `note` as
   * well, the two sit behind a switch, the recorder first, and the one not
   * showing stays mounted, so a take is never lost to the switch.
   */
  recorder?: ReactNode;
  /**
   * Which side of that switch shows as the dialog opens: `voice` (the
   * default), or `written` for a link that already has a typed note and no
   * recording.
   */
  defaultNoteFormat?: CandidateShareNoteFormat;
  /**
   * The choices, for a host that holds them, such as one that fills the
   * note in from a link it already has. Any left out are the dialog's own.
   */
  choices?: Partial<CandidateShareChoices>;
  /** Where the dialog's own choices start each time it opens. */
  defaultChoices?: Partial<CandidateShareChoices>;
  /** Called with every choice as it changes. */
  onChoicesChange?: (choices: CandidateShareChoices) => void;
  /**
   * The link, where the host already has one for these choices. The dialog
   * shows it with Copy, and the share button then says `labels.update`.
   * With no `onShare`, the dialog is the link and its Copy alone.
   */
  url?: string | null;
  /**
   * Makes the link. It is given the choices and returns the link, or a
   * promise for it; the dialog holds its controls meanwhile and then shows
   * the link with Copy. A promise that resolves with no link closes the
   * dialog, for a host that shows the link somewhere else. One that rejects
   * keeps the dialog as it was, with `labels.failed`.
   */
  onShare?: (choices: CandidateShareChoices) => string | void | PromiseLike<string | void>;
  /**
   * Copies the link in the same click that makes it. The clipboard is asked
   * inside that click, for a link that arrives later; a browser that
   * refuses leaves the link with its Copy button.
   */
  copyOnShare?: boolean;
  /**
   * What sharing is waiting for, such as a recording that is still
   * uploading ("Finish the voice note to share"). It shows on the share
   * button, which is held until it clears.
   */
  waitingFor?: ReactNode;
  /** An error of the host's own, such as a link that couldn't be read, over the share button. */
  error?: ReactNode;
  labels?: Partial<CandidateShareDialogLabels>;
}

const NO_AUDIENCES: readonly CandidateShareAudience[] = [];

// The two sides of the note stay mounted, so a recording survives the
// switch: the one not showing is hidden instead.
const INACTIVE_PANEL = "data-[state=inactive]:hidden";

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

function clipboard(): Clipboard | undefined {
  return typeof navigator === "undefined" ? undefined : navigator.clipboard;
}

/** Writes a link to the clipboard now. Called from inside a click. Never rejects. */
function writeLink(link: string): Promise<boolean> {
  const target = clipboard();
  if (!target?.writeText) return Promise.resolve(false);
  try {
    return target.writeText(link).then(
      () => true,
      () => false,
    );
  } catch {
    return Promise.resolve(false);
  }
}

/**
 * Asks the clipboard, from inside a click, for a link that isn't made yet.
 * A browser that takes a clipboard write only from a gesture is asked now
 * and handed the link when it arrives; any other is written to once the
 * link is here. Never rejects.
 */
function writeLinkWhenMade(link: Promise<string>): Promise<boolean> {
  const later = () => link.then(writeLink, () => false);
  const target = clipboard();
  if (!target) return link.then(() => false, () => false);
  if (typeof ClipboardItem !== "undefined" && typeof target.write === "function") {
    const blob = link.then((value) => new Blob([value], { type: "text/plain" }));
    // Nothing else may be listening by the time a failed share rejects this.
    blob.catch(() => undefined);
    try {
      return target.write([new ClipboardItem({ "text/plain": blob })]).then(() => true, later);
    } catch {
      // A ClipboardItem that takes no promise.
    }
  }
  return later();
}

/** The audience a dialog starts on: the first still to share with. */
function firstAudience(audiences: readonly CandidateShareAudience[]): string | undefined {
  return (audiences.find((audience) => !audience.live) ?? audiences[0])?.id;
}

function resolveChoices(
  own: Partial<CandidateShareChoices>,
  held: Partial<CandidateShareChoices> | undefined,
  audiences: readonly CandidateShareAudience[],
  anonymisable: boolean,
): CandidateShareChoices {
  const audience = held?.audience ?? own.audience;
  return {
    audience: audiences.some((candidate) => candidate.id === audience) ? audience : firstAudience(audiences),
    anonymised: anonymisable && Boolean(held?.anonymised ?? own.anonymised),
    note: held?.note ?? own.note ?? "",
  };
}

/**
 * Makes a link to a candidate's profile and hands it over: who is being
 * shared, who the link is for, whether the page names them, a note for
 * whoever opens it, then the link with Copy.
 *
 * Each part is optional. `avatar`, `headline` and `reason` are the summary
 * at the top. `audiences` asks who the link is for: each has its own
 * description, its own fields as a slot, and may already have a live link.
 * `anonymisable` asks whether the page names the person. `note` is a typed
 * note and `recorder` a slot for a spoken one.
 *
 * The host makes the link. `onShare` is given the choices and returns the
 * link, or a promise for it; the dialog then shows the link, cut short, with
 * Copy. A host that already has the link passes it as `url`. Copy writes to
 * the clipboard inside its own click, says "Copied" and announces it; where
 * the browser refuses, the whole link is put in a field and selected, to
 * copy by hand. `copyOnShare` asks the clipboard in the click that makes
 * the link.
 *
 * It fetches nothing and stores nothing: every opening starts from
 * `defaultChoices`, and a host that keeps a link's note or audience passes
 * them as `choices`. What it holds for one opening survives the window
 * narrowing or widening across the kit's switch between a dialog and a
 * bottom sheet.
 *
 * It is the kit's responsive dialog (a centred dialog, or a bottom sheet on
 * a phone), which keeps the kit's `data-slot` on its content; the dialog's
 * own body is marked `data-slot="candidate-share-dialog"`, with `data-view`
 * (`compose` or `result`).
 */
export function CandidateShareDialog(props: CandidateShareDialogProps) {
  // One opening is one session, and each starts afresh. The session is
  // counted here, above the kit's dialog, which swaps a dialog for a bottom
  // sheet as the window narrows and remounts what it holds: counted inside
  // it, a turned tablet would lose the note, a link just made, and a share
  // still on its way.
  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(props.open);
  if (props.open !== wasOpen) {
    setWasOpen(props.open);
    if (props.open) setSession(session + 1);
  }

  return <ShareDialogSession key={session} {...props} />;
}

/**
 * One opening of the dialog: its choices, the link it made and a share that
 * failed. A new one is mounted each time the dialog opens, so none of it
 * carries over to the next person, and a share that settles after the dialog
 * has been opened again is dropped.
 */
function ShareDialogSession({
  open,
  onOpenChange,
  candidateName,
  avatar,
  headline,
  reason,
  audiences = NO_AUDIENCES,
  anonymisable = false,
  note: takesNote = false,
  noteMaxLength,
  recorder,
  defaultNoteFormat = "voice",
  choices: heldChoices,
  defaultChoices,
  onChoicesChange,
  url,
  onShare,
  copyOnShare = false,
  waitingFor,
  error,
  labels,
}: CandidateShareDialogProps) {
  const text = { ...candidateShareDialogLabels, ...labels };
  const described = present(text.description);
  const id = useId();
  const [ownChoices, setOwnChoices] = useState<Partial<CandidateShareChoices>>(defaultChoices ?? {});
  const choices = resolveChoices(ownChoices, heldChoices, audiences, anonymisable);
  const [madeLink, setMadeLink] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [failure, setFailure] = useState<{ cause: unknown } | null>(null);
  const [copy, setCopy] = useState<"idle" | "copied" | "refused">("idle");
  const [noteFormat, setNoteFormat] = useState<CandidateShareNoteFormat>(defaultNoteFormat);
  // A second press before the first re-render must not share twice.
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const copyButton = useRef<HTMLButtonElement>(null);
  const linkField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // "Copied" is a confirmation, not a state to stay in.
  useEffect(() => {
    if (copy !== "copied") return;
    const timer = window.setTimeout(() => setCopy("idle"), 2_000);
    return () => window.clearTimeout(timer);
  }, [copy]);

  // The link made, its Copy is the next thing to press.
  useEffect(() => {
    if (madeLink !== null) copyButton.current?.focus();
  }, [madeLink]);

  // A link the browser wouldn't copy is selected, ready to copy by hand.
  useEffect(() => {
    if (copy !== "refused") return;
    linkField.current?.focus();
    linkField.current?.select();
  }, [copy]);

  const link = madeLink ?? (url?.trim() || null);
  const result = madeLink !== null || (onShare == null && link !== null);
  const audience = audiences.find((candidate) => candidate.id === choices.audience);
  const taken = audience?.live === true && link === null;
  const waiting = present(waitingFor);
  const canShare = onShare != null && !waiting && !taken && audience?.ready !== false;

  const change = (patch: Partial<CandidateShareChoices>) => {
    const next = { ...choices, ...patch };
    setOwnChoices(next);
    setFailure(null);
    onChoicesChange?.(next);
  };

  const share = () => {
    if (!onShare || !canShare || inFlight.current) return;
    setFailure(null);
    let made: PromiseLike<string | void> | string | void;
    try {
      made = onShare({ ...choices, note: choices.note.trim() });
    } catch (cause) {
      setFailure({ cause });
      return;
    }
    // A link, or nothing to show: the host keeps it somewhere else.
    const making = Promise.resolve(made).then((value) =>
      typeof value === "string" && value.trim() ? value.trim() : null,
    );
    // Asked now, inside the click, for a link that arrives later.
    const copying = copyOnShare
      ? writeLinkWhenMade(making.then((value) => value ?? Promise.reject(new Error("no link"))))
      : Promise.resolve(false);
    inFlight.current = true;
    setSharing(true);
    making
      .then(async (value) => ({ value, copied: value !== null && (await copying) }))
      .then(
        ({ value, copied }) => {
          inFlight.current = false;
          if (!mounted.current) return;
          setSharing(false);
          if (value === null) {
            // The host shows the link somewhere else.
            onOpenChange(false);
            return;
          }
          setMadeLink(value);
          setCopy(copied ? "copied" : "idle");
        },
        (cause: unknown) => {
          inFlight.current = false;
          if (!mounted.current) return;
          setSharing(false);
          setFailure({ cause });
        },
      );
  };

  const copyLink = () => {
    if (link === null) return;
    void writeLink(link).then((copied) => {
      if (mounted.current) setCopy(copied ? "copied" : "refused");
    });
  };

  const audienceTitleId = `${id}-audience`;
  const visibilityTitleId = `${id}-visibility`;
  const noteTitleId = `${id}-note`;
  const noteDescriptionId = `${id}-note-description`;
  const linkTitleId = `${id}-link`;
  const noteDescribed = present(text.noteDescription);
  const said = copy === "refused" ? text.copyFailed : copy === "copied" ? text.linkCopied : result ? text.ready : "";

  const noteField = (
    <Stack gap="xs">
      <Textarea
        aria-labelledby={noteTitleId}
        aria-describedby={noteDescribed ? noteDescriptionId : undefined}
        value={choices.note}
        onChange={(event) => change({ note: event.target.value })}
        rows={4}
        maxLength={noteMaxLength}
        placeholder={text.notePlaceholder}
        disabled={sharing}
      />
      {noteDescribed ? (
        <Text id={noteDescriptionId} size="sm" tone="muted">
          {text.noteDescription}
        </Text>
      ) : null}
    </Stack>
  );

  const linkBlock =
    link !== null ? (
      <Stack data-slot="candidate-share-dialog-link" gap="none">
        <SectionHeader id={linkTitleId} label={text.link} />
        <Stack direction="horizontal" gap="sm" align="center" surface="muted" radius="lg" padding="control">
          <Icon icon={Link2} size="md" tone="muted" />
          <FlexItem grow minWidth="zero">
            {copy === "refused" ? (
              <Input
                ref={linkField}
                readOnly
                value={link}
                aria-labelledby={linkTitleId}
                controlSize="sm"
                selectOnFocus
              />
            ) : (
              <Text as="span" variant="inherit" size="sm" display="block" truncate title={link}>
                {candidateShareLinkText(link)}
              </Text>
            )}
          </FlexItem>
          <Button
            ref={copyButton}
            type="button"
            variant={result ? "default" : "outline"}
            size="sm"
            shrink={false}
            onClick={copyLink}
          >
            <Icon icon={copy === "copied" ? Check : Copy} size="sm" />
            {copy === "copied" ? text.copied : text.copy}
          </Button>
        </Stack>
      </Stack>
    ) : null;

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      {/* Described by its own line, or told there is none rather than pointed at nothing. */}
      <ResponsiveDialogContent {...(described ? {} : { "aria-describedby": undefined })}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{text.title(candidateName)}</ResponsiveDialogTitle>
          {described ? <ResponsiveDialogDescription>{text.description}</ResponsiveDialogDescription> : null}
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody data-slot="candidate-share-dialog" data-view={result ? "result" : "compose"}>
          {/* A reason or a description with a long word in it wraps, not widens the dialog. */}
          <Stack gap="lg" className="[overflow-wrap:anywhere]">
            {present(avatar) || present(headline) || present(reason) ? (
              <Stack data-slot="candidate-share-dialog-summary" gap="md">
                <Stack direction="horizontal" gap="md" align="center">
                  {avatar}
                  <FlexItem grow minWidth="zero">
                    <Text size="sm" weight="semibold" truncate>
                      {candidateName}
                    </Text>
                    {present(headline) ? (
                      <Text size="xs" tone="muted" truncate>
                        {headline}
                      </Text>
                    ) : null}
                  </FlexItem>
                </Stack>
                {present(reason) ? (
                  <Stack gap="xs">
                    <Text size="xs" tone="muted">
                      {text.reason}
                    </Text>
                    <Text size="sm">{reason}</Text>
                  </Stack>
                ) : null}
              </Stack>
            ) : null}

            {result ? null : (
              <>
                {audiences.length > 0 && choices.audience !== undefined ? (
                  <Stack data-slot="candidate-share-dialog-audience" gap="sm">
                    <SectionHeader id={audienceTitleId} label={text.audience} spacing="none" />
                    <ChoiceChips
                      aria-labelledby={audienceTitleId}
                      chips={audiences.map((candidate) => ({
                        id: candidate.id,
                        label: candidate.label,
                        trailing: candidate.live ? (
                          <Badge as="span" variant="success" size="micro">
                            {text.liveBadge}
                          </Badge>
                        ) : undefined,
                      }))}
                      value={choices.audience}
                      disabled={sharing}
                      onChange={(next) => change({ audience: next })}
                    />
                    {taken ? (
                      <Text size="sm" tone="muted">
                        {present(audience?.liveDescription) ? audience?.liveDescription : text.live}
                      </Text>
                    ) : (
                      <>
                        {present(audience?.description) ? (
                          <Text size="sm" tone="muted">
                            {audience?.description}
                          </Text>
                        ) : null}
                        {audience?.fields}
                      </>
                    )}
                  </Stack>
                ) : null}

                {anonymisable && !taken ? (
                  <Stack data-slot="candidate-share-dialog-visibility" gap="sm">
                    <SectionHeader id={visibilityTitleId} label={text.visibility} spacing="none" />
                    <RadioGroup
                      aria-labelledby={visibilityTitleId}
                      value={choices.anonymised ? "anonymised" : "named"}
                      onValueChange={(next) => change({ anonymised: next === "anonymised" })}
                      disabled={sharing}
                    >
                      {(["named", "anonymised"] as const).map((option) => (
                        // The label makes the whole card the target. The radio
                        // is named by the title and described by the line under
                        // it outright, not left to how a browser reads a label
                        // that wraps a group.
                        <FieldLabel key={option} htmlFor={`${id}-${option}`}>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle id={`${id}-${option}-title`}>
                                {option === "named" ? text.named : text.anonymised}
                              </FieldTitle>
                              <FieldDescription id={`${id}-${option}-description`}>
                                {option === "named" ? text.namedDescription : text.anonymisedDescription}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={option}
                              id={`${id}-${option}`}
                              aria-labelledby={`${id}-${option}-title`}
                              aria-describedby={`${id}-${option}-description`}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </Stack>
                ) : null}

                {(takesNote || present(recorder)) && !taken ? (
                  <Stack data-slot="candidate-share-dialog-note" gap="sm">
                    <SectionHeader id={noteTitleId} label={text.note} spacing="none" />
                    {takesNote && present(recorder) ? (
                      <Tabs
                        value={noteFormat}
                        onValueChange={(next) => setNoteFormat(next === "written" ? "written" : "voice")}
                      >
                        <TabsList aria-label={text.noteFormat}>
                          <TabsTrigger value="voice" padding="md">
                            {text.voiceNote}
                          </TabsTrigger>
                          <TabsTrigger value="written" padding="md">
                            {text.writtenNote}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="voice" marginTop="md" forceMount className={INACTIVE_PANEL}>
                          {recorder}
                        </TabsContent>
                        <TabsContent value="written" marginTop="md" forceMount className={INACTIVE_PANEL}>
                          {noteField}
                        </TabsContent>
                      </Tabs>
                    ) : takesNote ? (
                      noteField
                    ) : (
                      recorder
                    )}
                  </Stack>
                ) : null}
              </>
            )}

            {/* The line that says the link is ready, or copied, is in the
                dialog from the start, before there is anything to say, so a
                screen reader announces it when there is. With no link yet it
                takes no room. */}
            <Stack gap="none" className={link === null ? "sr-only" : undefined}>
              {linkBlock}
              <Text
                role="status"
                size="sm"
                tone={copy === "refused" ? "destructive" : "muted"}
                marginTop={said ? "sm" : "none"}
              >
                {said}
              </Text>
            </Stack>

            {failure || present(error) ? (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{failure ? text.failed(failure.cause) : error}</AlertDescription>
              </Alert>
            ) : null}
          </Stack>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter layout="fill">
          {result ? (
            <ResponsiveDialogClose asChild>
              <Button type="button" variant="outline">
                {text.done}
              </Button>
            </ResponsiveDialogClose>
          ) : (
            <Button type="button" onClick={share} disabled={!canShare || sharing} aria-busy={sharing || undefined}>
              {sharing ? (
                <>
                  <Icon icon={Loader2} size="md" spin />
                  {text.sharing}
                </>
              ) : waiting ? (
                waitingFor
              ) : link !== null ? (
                text.update(copyOnShare)
              ) : (
                text.create(copyOnShare)
              )}
            </Button>
          )}
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
