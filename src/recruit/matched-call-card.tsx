"use client";

import { Button } from "@epicbagel/saas-kit/primitives/button";
import { CallCard, type CallParticipant } from "@epicbagel/saas-kit/primitives/call-card";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Input } from "@epicbagel/saas-kit/primitives/input";
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
import { BriefcaseBusiness, Loader2, Sparkles, UserSearch } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";

import type {
  CallInsights,
  CallPerson,
  CallSegment,
  CallTranscript,
  SearchCallPeople,
} from "./call-data";
import { CALL_PEOPLE_SEARCH_MIN_LENGTH, useCallPeopleSearch, useCallTranscript } from "./call-hooks";

/** Host-owned wording for the card's fixed parts. */
export interface MatchedCallCardLabels {
  /** The heading when the call has no title and no linked people. */
  untitled: string;
  /** The transcript toggle while it is closed. */
  showTranscript: string;
  /** Between two linked people in the heading. */
  peopleSeparator: ReactNode;
  /** Accessible name of a linked person's button. */
  openPerson: (name: string) => string;
  /** The heading over the insights. */
  insights: ReactNode;
  generate: ReactNode;
  regenerate: ReactNode;
  noRolesTitle: string;
  noRolesDescription: string;
  /** The header action that opens the link dialog. */
  linkPerson: ReactNode;
  linkTitle: ReactNode;
  searchPlaceholder: string;
  searching: ReactNode;
  noMatchesTitle: string;
  noMatchesDescription: string;
}

const DEFAULT_LABELS: MatchedCallCardLabels = {
  untitled: "Untitled call",
  showTranscript: "Show full transcript",
  peopleSeparator: " and ",
  openPerson: (name) => `Open ${name}`,
  insights: "Call insights",
  generate: "Generate",
  regenerate: "Regenerate",
  noRolesTitle: "No suggested roles yet",
  noRolesDescription: "No other live role fits this person from this call.",
  linkPerson: "Link another person",
  linkTitle: "Link this call to another person",
  searchPlaceholder: "Search people…",
  searching: "Searching…",
  noMatchesTitle: "No people match that name",
  noMatchesDescription: "Try a different name or spelling.",
};

/** Links the call to one more person, found by name. */
export interface MatchedCallLinkPerson<TPerson extends CallPerson = CallPerson> {
  searchPeople: SearchCallPeople<TPerson>;
  /**
   * Links the call. Resolve once it is linked: the dialog then closes and
   * clears its search, and the host adds the person to `people`. Reject when
   * it failed, having told the user why; the dialog stays open.
   */
  onLink: (person: TPerson) => Promise<void>;
}

export interface MatchedCallCardProps<TPerson extends CallPerson = CallPerson> {
  /** The call's title, shown when no person is linked yet. */
  title?: ReactNode;
  /** The people the call is linked to. They replace the title as buttons that open each one. */
  people?: readonly TPerson[];
  onOpenPerson?: (person: TPerson) => void;
  source?: ReactNode;
  timestamp?: ReactNode;
  /** Who was on the call besides the people in the heading. */
  participants?: readonly CallParticipant[];
  summary?: ReactNode;
  /** The transcript preview, until the full transcript loads. */
  transcript?: ReactNode;
  segments?: readonly CallSegment[] | null;
  /** Fetches the full transcript the first time it is opened. */
  loadTranscript?: () => Promise<CallTranscript | null | undefined>;
  /** Offers to link the call to another person. Omit it and the header has no link action. */
  linkPerson?: MatchedCallLinkPerson<TPerson>;
  /** The host's check of the call against its open roles. */
  insights: CallInsights;
  /** The roles the check suggested. Once insights are ready and this is empty, the card says no role fits. */
  roleMatches?: ReactNode;
  labels?: Partial<MatchedCallCardLabels>;
  /** Class for the card. Its root is the kit's CallCard, which takes no other attributes. */
  className?: string;
}

const isShown = (node: ReactNode) => node != null && node !== false && node !== "";

const noSearch: SearchCallPeople<never> = async () => [];

/**
 * A call already linked to one or more people, so it can be found again: the
 * linked people head the card and open each person, the transcript loads in
 * full when opened, and the footer holds the call's insights with a generate
 * action. A header action links the call to one more person through a search
 * dialog. The card keeps no record of its own: the host updates `people`
 * once a link is saved.
 */
export function MatchedCallCard<TPerson extends CallPerson>({
  title,
  people = [],
  onOpenPerson,
  source,
  timestamp,
  participants,
  summary,
  transcript,
  segments,
  loadTranscript,
  linkPerson,
  insights,
  roleMatches,
  labels,
  className,
}: MatchedCallCardProps<TPerson>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const call = useCallTranscript({ transcript, segments, loadTranscript });
  const [linkOpen, setLinkOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [linking, setLinking] = useState(false);
  const { results, searching } = useCallPeopleSearch<TPerson>(
    query,
    linkOpen && linkPerson != null,
    linkPerson?.searchPeople ?? noSearch,
  );
  const ready = insights.status === "ready";

  async function link(person: TPerson) {
    if (!linkPerson) return;
    setLinking(true);
    try {
      await linkPerson.onLink(person);
      setLinkOpen(false);
      setQuery("");
    } catch {
      // The host has said why; the dialog stays open to try again.
    } finally {
      setLinking(false);
    }
  }

  const heading = people.length > 0 ? (
    <Stack direction="horizontal" gap="xs" align="center" wrap>
      {people.map((person, index) => (
        <Fragment key={person.id}>
          {index > 0 && <Text as="span" variant="inherit">{text.peopleSeparator}</Text>}
          {onOpenPerson ? (
            <Button
              variant="ghost"
              size="compact"
              onClick={() => onOpenPerson(person)}
              aria-label={text.openPerson(person.name)}
            >
              {person.name}
            </Button>
          ) : (
            <Text as="span" variant="inherit">{person.name}</Text>
          )}
        </Fragment>
      ))}
    </Stack>
  ) : (title || text.untitled);

  return (
    <>
      <CallCard
        className={className}
        title={heading}
        source={source}
        timestamp={timestamp}
        participants={participants as CallParticipant[] | undefined}
        summary={summary}
        headerAside={linkPerson ? (
          <Button variant="outline" size="compact" onClick={() => setLinkOpen(true)} disabled={linking}>
            {text.linkPerson}
          </Button>
        ) : undefined}
        transcript={call.transcript}
        segments={call.segments}
        transcriptLabel={text.showTranscript}
        onLoadTranscript={call.onLoadTranscript}
        actions={
          <Stack gap="md" width="full" textAlign="start">
            <Stack direction="horizontal" justify="between" align="center">
              <Stack direction="horizontal" gap="xs" align="center">
                <Icon icon={Sparkles} size="sm" />
                <Text variant="small" weight="medium">{text.insights}</Text>
              </Stack>
              <Button variant="ghost" size="compact" onClick={() => insights.onGenerate(ready)} disabled={insights.generating}>
                {insights.generating ? <Icon icon={Loader2} size="sm" spin /> : <Icon icon={Sparkles} size="sm" />} {ready ? text.regenerate : text.generate}
              </Button>
            </Stack>
            {/* Keep generated insights directly beneath their action. */}
            {ready && (
              isShown(roleMatches) ? roleMatches : (
                <EmptyState
                  variant="empty"
                  size="inline"
                  icon={BriefcaseBusiness}
                  title={text.noRolesTitle}
                  description={text.noRolesDescription}
                />
              )
            )}
            {insights.error && <Text variant="small" tone="destructive">{insights.error}</Text>}
          </Stack>
        }
      />
      {linkPerson && (
        <ResponsiveDialog open={linkOpen} onOpenChange={setLinkOpen}>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader><ResponsiveDialogTitle>{text.linkTitle}</ResponsiveDialogTitle></ResponsiveDialogHeader>
            <ResponsiveDialogBody>
              <Stack gap="sm">
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} autoFocus />
                {searching && <Text variant="small" tone="muted">{text.searching}</Text>}
                {results.length > 0 && (
                  <List surface="bordered" radius="md">
                    {results.map((person) => (
                      <ListItem key={person.id}>
                        <Button variant="ghost" width="full" align="start" onClick={() => void link(person)} disabled={linking}>
                          {person.name}
                        </Button>
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
            </ResponsiveDialogBody>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      )}
    </>
  );
}
