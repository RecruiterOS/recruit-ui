"use client";

import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard, type CallParticipant } from "@epicbagel/saas-kit/primitives/call-card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Input } from "@epicbagel/saas-kit/primitives/input";
import { InteractiveCard } from "@epicbagel/saas-kit/primitives/interactive-card";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { UserSearch } from "lucide-react";
import { useState, type ReactNode } from "react";

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

export interface CallReconcileCardProps<TPerson extends CallPerson = CallPerson> {
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
  /** People the call may be about, offered first. */
  guesses?: readonly TPerson[];
  /** Named in the hint and the search, and seeds the create dialog. */
  suggestedPerson?: CallReconcileSuggestedPerson | null;
  searchPeople: SearchCallPeople<TPerson>;
  /** Beside the search field, such as a button that looks the suggested person up elsewhere. */
  externalSearch?: ReactNode;
  onDismiss: () => void;
  /** Attaches the call to a person picked from the guesses or the search, after the preview. */
  onAttach: (person: TPerson) => void;
  /** Creates a person from the create dialog and attaches the call to them. */
  onCreateAttach: (person: CallReconcileNewPerson) => void;
  /**
   * The preview of a picked person, above Cancel and Attach this call. `close`
   * dismisses the preview without attaching.
   */
  renderPreview: (person: TPerson, close: () => void) => ReactNode;
  labels?: Partial<CallReconcileCardLabels>;
  /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
  className?: string;
}

/**
 * A call nobody has been attached to yet, and the one decision it needs:
 * attach it to an existing person (a likely guess, or one found by name, each
 * previewed first), create a person from it, or dismiss it. The host owns
 * what each choice saves and removes the card afterwards.
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
  guesses = [],
  suggestedPerson,
  searchPeople,
  externalSearch,
  onDismiss,
  onAttach,
  onCreateAttach,
  renderPreview,
  labels,
  className,
}: CallReconcileCardProps<TPerson>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = useCallTranscript({ transcript, segments, loadTranscript });
  const [query, setQuery] = useState("");
  const { results, searching } = useCallPeopleSearch<TPerson>(query, true, searchPeople);
  const [preview, setPreview] = useState<TPerson | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const closePreview = () => setPreview(null);

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
                {text.hint}
              </Text>
            </Stack>

            {guesses.length > 0 && (
              <Stack gap="xs" border="top" paddingTop="md">
                <Text size="xs" tone="muted">{text.possibleMatches}</Text>
                <Stack direction="horizontal" gap="sm" wrap>
                  {guesses.map((guess) => (
                    <Button key={guess.id} size="sm" variant="outline" onClick={() => setPreview(guess)}>
                      {guess.name}
                    </Button>
                  ))}
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
          </Stack>
        )}
      />

      <ResponsiveDialog open={createOpen} onOpenChange={setCreateOpen}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{text.createTitle}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <Stack gap="sm">
              {participants.length > 0 && (
                <Stack gap="xs">
                  <Text variant="small" tone="muted">{text.useParticipant}</Text>
                  <Stack direction="horizontal" gap="sm" wrap>
                    {participants.map((participant, index) => (
                      <Button
                        key={`${participant.email ?? participant.name}-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewName(participant.name ?? "");
                          setNewEmail(participant.email ?? "");
                        }}
                      >
                        {participant.name || participant.email}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              )}
              <Stack gap="xs">
                <Text variant="small" tone="muted">{text.name}</Text>
                <Input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder={text.namePlaceholder} />
              </Stack>
              <Stack gap="xs">
                <Text variant="small" tone="muted">{text.email}</Text>
                <Input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder={text.emailPlaceholder} />
              </Stack>
              <Button
                size="sm"
                disabled={!newName.trim()}
                onClick={() => {
                  const name = newName.trim();
                  const email = newEmail.trim();
                  setCreateOpen(false);
                  onCreateAttach({ name, email: email || undefined });
                }}
              >
                {text.createSubmit}
              </Button>
            </Stack>
          </ResponsiveDialogBody>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog open={preview !== null} onOpenChange={(open) => !open && closePreview()}>
        <ResponsiveDialogContent presentation="preview">
          <ResponsiveDialogHeader visibility="screen-reader">
            <ResponsiveDialogTitle>{text.previewTitle}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          {preview && (
            <Stack gap="none" minHeight="zero" grow>
              <FlexItem grow minHeight="zero" overflow="hidden">
                {renderPreview(preview, closePreview)}
              </FlexItem>
              <Stack direction="horizontal" gap="sm" align="center" justify="end" border="top" surface="background" padding="action-row">
                <Button variant="outline" size="sm" onClick={closePreview}>{text.cancel}</Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const person = preview;
                    setPreview(null);
                    onAttach(person);
                  }}
                >
                  {text.attach}
                </Button>
              </Stack>
            </Stack>
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
}
