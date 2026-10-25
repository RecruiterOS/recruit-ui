"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard, type CallParticipant } from "@epicbagel/saas-kit/primitives/call-card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { UserPlus, UserSearch } from "lucide-react";
import { lazy, Suspense, useState, type ReactNode } from "react";

import type {
  CallPerson,
  CallSegment,
  CallTranscript,
  SearchCallPeople,
} from "./call-data";
import { CALL_PEOPLE_SEARCH_MIN_LENGTH, useCallPeopleSearch, useCallTranscript } from "./call-hooks";

/** Host-owned wording for the card's fixed parts. */
export interface CallReconcileCardLabels {
  /** The heading when the call has no title. */
  untitled: string;
  /** The transcript toggle while it is closed. */
  showTranscript: string;
  /** What the footer asks the recruiter to do. */
  heading: ReactNode;
  dismiss: ReactNode;
  /** Starts the hint when the host suggests a person it couldn't find. */
  notFound: (name: string) => ReactNode;
  /** The rest of the hint under the heading. */
  hint: ReactNode;
  /** The rest of the hint when the host picks the person (`onPickOther`). */
  pickHint: ReactNode;
  /** The button that hands picking a person to the host, worded by whether there are possible matches above it. */
  pickOther: (hasMatches: boolean) => ReactNode;
  /** The eyebrow over the possible matches. */
  possibleMatches: ReactNode;
  /** The search field's placeholder, given the suggested person's name when there is one. */
  searchPlaceholder: (suggestedName?: string) => string;
  /** Opens the dialog that adds a new person from the call. */
  addManually: ReactNode;
  searching: ReactNode;
  noMatchesTitle: string;
  noMatchesDescription: string;
  createTitle: ReactNode;
  /** The eyebrow over the participant shortcuts in the create dialog. */
  useParticipant: ReactNode;
  name: ReactNode;
  namePlaceholder: string;
  email: ReactNode;
  emailPlaceholder: string;
  createSubmit: ReactNode;
  /** The preview dialog's title, read by screen readers only. */
  previewTitle: ReactNode;
  cancel: ReactNode;
  attach: ReactNode;
}

const DEFAULT_LABELS: CallReconcileCardLabels = {
  untitled: "Untitled call",
  showTranscript: "Show full transcript",
  heading: "Attach this call to a person",
  dismiss: "Dismiss",
  notFound: (name) => `We couldn't find ${name}.`,
  hint: "Search or add them below to attach the conversation and keep their history and future recommendations together.",
  pickHint: "Pick who it was with to attach the conversation and keep their history and future recommendations together.",
  pickOther: (hasMatches) => (hasMatches ? "Someone else" : "Attach to…"),
  possibleMatches: "Possible matches",
  searchPlaceholder: (name) => (name === undefined ? "Search by name" : `Search for ${name}`),
  addManually: "Manually add",
  searching: "Searching…",
  noMatchesTitle: "No people match that name",
  noMatchesDescription: "Try a different spelling, or add them manually.",
  createTitle: "Create candidate from this call",
  useParticipant: "Use a participant",
  name: "Name",
  namePlaceholder: "Full name",
  email: "Email",
  emailPlaceholder: "email@example.com",
  createSubmit: "Create & attach this call",
  previewTitle: "Candidate preview",
  cancel: "Cancel",
  attach: "Attach this call",
};

/** Whose call this is, already worded. */
export interface CallReconcileOwner {
  label: ReactNode;
  /** The person viewing owns the call: a filled badge rather than an outline. */
  isViewer?: boolean;
}

/** Someone on the call the host believes is new, not yet among its people. */
export interface CallReconcileSuggestedPerson {
  name: string;
  email?: string | null;
}

/** The person to create from the call and attach it to. */
export interface CallReconcileNewPerson {
  name: string;
  email?: string;
}

/** What every reconcile card shows, however the person is picked. */
export interface CallReconcileCardBaseProps {
  title?: ReactNode;
  source?: ReactNode;
  /** The gist of the call, clamped with a show-more toggle when long. */
  summary?: ReactNode;
  timestamp?: ReactNode;
  /** Who was on the call. Also offered as shortcuts in the create dialog. */
  participants?: readonly CallParticipant[];
  /** The transcript preview, until the full transcript loads. */
  transcript?: ReactNode;
  segments?: readonly CallSegment[] | null;
  /** Fetches the full transcript the first time it is opened. */
  loadTranscript?: () => Promise<CallTranscript | null | undefined>;
  /** Whose call it is, as a badge in the header. */
  owner?: CallReconcileOwner;
  /**
   * The host's own controls for the people the call may be about, under the
   * possible-matches eyebrow: buttons that confirm before attaching, say.
   * Shown in place of the buttons `guesses` renders.
   */
  suggestions?: ReactNode;
  /** Named in the hint and the search, and seeds the create dialog. */
  suggestedPerson?: CallReconcileSuggestedPerson | null;
  onDismiss: () => void;
  labels?: Partial<CallReconcileCardLabels>;
  /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
  className?: string;
}

/**
 * The card picks the person itself: likely guesses and people found by name
 * are previewed before the call attaches, and a person can be created from
 * the call.
 */
export interface CallReconcileSearchProps<TPerson extends CallPerson = CallPerson> {
  /** People the call may be about, offered first. */
  guesses?: readonly TPerson[];
  searchPeople: SearchCallPeople<TPerson>;
  /** Beside the search field, such as a button that looks the suggested person up elsewhere. */
  externalSearch?: ReactNode;
  /** Attaches the call to a person picked from the guesses or the search, after the preview. */
  onAttach: (person: TPerson) => void;
  /** Creates a person from the create dialog and attaches the call to them. */
  onCreateAttach: (person: CallReconcileNewPerson) => void;
  /**
   * The preview of a picked person, above Cancel and Attach this call. `close`
   * dismisses the preview without attaching.
   */
  renderPreview: (person: TPerson, close: () => void) => ReactNode;
  onPickOther?: never;
}

/**
 * The host picks the person: the card offers the host's `suggestions` and one
 * button that opens the host's own people picker, and has no search, preview
 * or create dialog of its own.
 */
export interface CallReconcilePickerProps {
  /** Opens the host's people picker. */
  onPickOther: () => void;
  guesses?: never;
  searchPeople?: never;
  externalSearch?: never;
  onAttach?: never;
  onCreateAttach?: never;
  renderPreview?: never;
}

export type CallReconcileCardProps<TPerson extends CallPerson = CallPerson> =
  CallReconcileCardBaseProps & (CallReconcileSearchProps<TPerson> | CallReconcilePickerProps);

// The create and preview dialogs (and the drawer the kit's ResponsiveDialog
// renders on a phone) are a chunk of their own. Search mode mounts them with
// the card, so the chunk loads at once, closed; picker mode never mounts
// them, so a host with its own picker never downloads them.
const CallReconcileDialogs = lazy(() =>
  import("./call-reconcile-dialogs").then((module) => ({ default: module.CallReconcileDialogs })),
);

const isShown = (node: ReactNode) =>
  node != null && node !== false && node !== "" && !(Array.isArray(node) && node.length === 0);

const noSearch: SearchCallPeople<never> = async () => [];

/**
 * A call nobody has been attached to yet, and the one decision it needs:
 * attach it to an existing person (a likely guess, or one found by name, each
 * previewed first), create a person from it, or dismiss it. The host owns
 * what each choice saves and removes the card afterwards.
 *
 * With `onPickOther` the host picks the person instead: the card shows the
 * host's `suggestions` and one button for its own picker.
 */
export function CallReconcileCard<TPerson extends CallPerson>({
  title,
  source,
  summary,
  timestamp,
  participants = [],
  transcript,
  segments,
  loadTranscript,
  owner,
  suggestions,
  guesses = [],
  suggestedPerson,
  searchPeople,
  externalSearch,
  onDismiss,
  onAttach,
  onCreateAttach,
  renderPreview,
  onPickOther,
  labels,
  className,
}: CallReconcileCardProps<TPerson>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = useCallTranscript({ transcript, segments, loadTranscript });
  const [query, setQuery] = useState("");
  const { results, searching } = useCallPeopleSearch<TPerson>(
    query,
    searchPeople != null,
    searchPeople ?? noSearch,
  );
  const [preview, setPreview] = useState<TPerson | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const closePreview = () => setPreview(null);
  const picker = onPickOther != null;
  // The host's suggestions, or else a button that previews each guess.
  const matches = suggestions !== undefined
    ? suggestions
    : guesses.map((guess) => (
      <Button key={guess.id} size="sm" variant="outline" onClick={() => setPreview(guess)}>
        {guess.name}
      </Button>
    ));
  const hasMatches = isShown(matches);

  return (
    <>
      <CallCard
        className={className}
        title={title || text.untitled}
        source={source}
        headerAside={owner ? (
          <Badge variant={owner.isViewer ? "secondary" : "outline"} shrink>{owner.label}</Badge>
        ) : undefined}
        summary={summary}
        timestamp={timestamp}
        participants={participants as CallParticipant[]}
        transcript={call.transcript}
        segments={call.segments}
        transcriptLabel={text.showTranscript}
        onLoadTranscript={call.onLoadTranscript}
        actions={(
          <Stack gap="md" width="full" textAlign="start" padding="sm">
            <Stack gap="xs">
              <Stack direction="horizontal" gap="md" align="center" justify="between">
                <Text size="sm" weight="medium">{text.heading}</Text>
                <Button variant="quiet" size="compact" shrink onClick={() => onDismiss()}>
                  {text.dismiss}
                </Button>
              </Stack>
              <Text size="xs" tone="muted">
                {suggestedPerson && <>{text.notFound(suggestedPerson.name)} </>}
                {picker ? text.pickHint : text.hint}
              </Text>
            </Stack>

            {picker ? (
              <Stack gap="xs" border="top" paddingTop="md">
                {hasMatches && <Text size="xs" tone="muted">{text.possibleMatches}</Text>}
                <Stack direction="horizontal" gap="sm" align="center" wrap>
                  {matches}
                  <Button variant="outline" size="sm" onClick={() => onPickOther?.()}>
                    <Icon icon={UserPlus} size="sm" />
                    {text.pickOther(hasMatches)}
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <>
                {hasMatches && (
                  <Stack gap="xs" border="top" paddingTop="md">
                    <Text size="xs" tone="muted">{text.possibleMatches}</Text>
                    <Stack direction="horizontal" gap="sm" wrap>
                      {matches}
                    </Stack>
                  </Stack>
                )}

                <Stack direction="horizontal" gap="sm" align="center" wrap border="top" paddingTop="md">
                  <FlexItem grow minWidth="zero" basis="md">
                    <Input
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={text.searchPlaceholder(suggestedPerson ? suggestedPerson.name : undefined)}
                    />
                  </FlexItem>
                  {externalSearch}
                  <Button
                    variant="outline"
                    size="sm"
                    shrink
                    onClick={() => {
                      const seed = participants.find((participant) => participant.email) ?? participants[0];
                      setNewName(suggestedPerson?.name ?? seed?.name ?? "");
                      setNewEmail(suggestedPerson?.email ?? seed?.email ?? "");
                      setCreateOpen(true);
                    }}
                  >
                    {text.addManually}
                  </Button>
                </Stack>
                {(results.length > 0 || searching) && (
                  <List surface="bordered" radius="md">
                    {searching && results.length === 0 && (
                      <ListItem padding="md" textSize="xs" tone="soft">{text.searching}</ListItem>
                    )}
                    {results.map((person) => (
                      <ListItem key={person.id}>
                        <InteractiveCard
                          display="block"
                          radius="none"
                          border="none"
                          padding="row"
                          textSize="sm"
                          onClick={() => setPreview(person)}
                        >
                          {person.name}
                        </InteractiveCard>
                      </ListItem>
                    ))}
                  </List>
                )}
                {!searching && query.trim().length >= CALL_PEOPLE_SEARCH_MIN_LENGTH && results.length === 0 && (
                  <EmptyState
                    variant="search"
                    size="inline"
                    icon={UserSearch}
                    title={text.noMatchesTitle}
                    description={text.noMatchesDescription}
                  />
                )}
              </>
            )}
          </Stack>
        )}
      />

      {/* The host's picker replaces both dialogs, so picker mode mounts neither. */}
      {picker ? null : (
        // Closed dialogs render nothing, so there is nothing to show while
        // the chunk loads.
        <Suspense fallback={null}>
          <CallReconcileDialogs
            labels={text}
            participants={participants}
            create={{
              open: createOpen,
              onOpenChange: setCreateOpen,
              name: newName,
              onNameChange: setNewName,
              email: newEmail,
              onEmailChange: setNewEmail,
              onSubmit: () => {
                const name = newName.trim();
                const email = newEmail.trim();
                setCreateOpen(false);
                onCreateAttach?.({ name, email: email || undefined });
              },
            }}
            preview={{
              open: preview !== null,
              content: preview ? renderPreview?.(preview, closePreview) : null,
              onClose: closePreview,
              onAttach: () => {
                const person = preview;
                setPreview(null);
                if (person) onAttach?.(person);
              },
            }}
          />
        </Suspense>
      )}
    </>
  );
}
