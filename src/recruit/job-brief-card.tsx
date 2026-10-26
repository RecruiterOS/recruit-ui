"use client";

import { Alert, AlertDescription } from "@epicbagel/saas-kit/primitives/alert";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Card } from "@epicbagel/saas-kit/primitives/card";
import { CollapsibleSection } from "@epicbagel/saas-kit/primitives/collapsible-section";
import { DefinitionItem, DefinitionList } from "@epicbagel/saas-kit/primitives/definition-list";
import { EditableList } from "@epicbagel/saas-kit/primitives/editable-list";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Heading } from "@epicbagel/saas-kit/primitives/heading";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { List, ListItem } from "@epicbagel/saas-kit/primitives/list";
import type { Sentiment } from "@epicbagel/saas-kit/primitives/sentiment-dot";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { FileText, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";
import { usePendingCall } from "./pending-action";
import { COARSE_POINTER_TOUCH_TARGET, COARSE_POINTER_TOUCH_TARGETS_WITHIN } from "./touch-targets";

/**
 * One of a brief's three lists about the people a role wants: what they must
 * have, what would be nice, and what rules them out.
 */
export type JobBriefRuleKind = "mustHaves" | "niceToHaves" | "redFlags";

/**
 * How a JobBriefCard sits. `collapsible` is a card whose whole body folds
 * under its title, for a section of a page. `preview` is a card that shows
 * the start of the brief and opens the rest in place, for a message in a
 * conversation.
 */
export type JobBriefCardPresentation = "collapsible" | "preview";

/** One labelled fact about a role, such as its location or salary, worded by the host. */
export interface JobBriefFact {
  /** Stable key for the row. */
  id: string;
  label: ReactNode;
  value: ReactNode;
}

/**
 * A titled part of the brief after the three lists, such as the role's
 * details, who it sells to, or the interview process. It holds facts, items,
 * or both; a section with neither isn't drawn.
 */
export interface JobBriefSection {
  /** Stable key for the section. */
  id: string;
  /** The section's heading, such as "Role details". */
  title: ReactNode;
  /** Labelled facts, drawn as a divided list. */
  facts?: readonly JobBriefFact[];
  /** Entries drawn as a bulleted list, or a numbered one with `ordered`. */
  items?: readonly ReactNode[];
  /** Number the items, such as for the steps of an interview process. */
  ordered?: boolean;
}

/** Host-owned wording for a JobBriefCard's fixed parts. */
export interface JobBriefCardLabels {
  /** The must-haves list's label. */
  mustHaves: ReactNode;
  /** The nice-to-haves list's label. */
  niceToHaves: ReactNode;
  /** The red-flags list's label. */
  redFlags: ReactNode;
  /** What one must-have is called in its list's controls: "Add must have…", "Remove must have". */
  mustHaveItem: string;
  /** What one nice-to-have is called in its list's controls. */
  niceToHaveItem: string;
  /** What one red flag is called in its list's controls. */
  redFlagItem: string;
  /** The notice over a brief that is still being read from a document. */
  processing: ReactNode;
  /** The in-progress blank slate's title, while nothing has been read yet. */
  processingTitle: string;
  /** The in-progress blank slate's description, under its title. */
  processingDescription: string;
  /**
   * The preview's toggle while part of the brief is hidden. It receives how
   * many facts, list entries and section rows are hidden (zero when only the
   * editing controls are).
   */
  showMore: (hidden: number) => ReactNode;
  /** The preview's toggle while the whole brief is shown. */
  showLess: ReactNode;
}

const DEFAULT_LABELS: JobBriefCardLabels = {
  mustHaves: "Must haves",
  niceToHaves: "Nice to haves",
  redFlags: "Red flags",
  mustHaveItem: "must have",
  niceToHaveItem: "nice to have",
  redFlagItem: "red flag",
  processing: "Reading your document. The brief will fill in shortly.",
  processingTitle: "Reading your document",
  processingDescription: "The brief will fill in shortly.",
  showMore: (hidden) => (hidden > 0 ? `Show full brief (${hidden} more)` : "Show full brief"),
  showLess: "Show less",
};

export interface JobBriefCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** `collapsible` (the default) for a page, `preview` for a message. */
  presentation?: JobBriefCardPresentation;
  /** The brief's title. It names the section. Defaults to "Job brief". */
  title?: ReactNode;
  /**
   * The title's heading level: 2 (the default), or 3 or 4 where the card sits
   * deeper in the page's outline. Only the tags change, never the look. In
   * `preview` the title is a heading at this level and the lists' and
   * sections' headings sit one level below it. In `collapsible` the title is
   * the kit CollapsibleSection's trigger, which can't hold a heading, so the
   * lists' and sections' headings take this level themselves and the outline
   * skips none.
   */
  titleLevel?: 2 | 3 | 4;
  /**
   * At the title's end, such as an "Updated" badge. It keeps its width: on a
   * narrow screen the title wraps rather than the status. In `collapsible`
   * it sits inside the trigger button, so pass phrasing content (a Badge
   * rendered `as="span"`).
   */
  status?: ReactNode;
  /** What the role is, in a sentence or two. Clamped to two lines in a closed preview. */
  description?: ReactNode;
  /** Headline facts after the description, such as location, salary and on-target earnings. */
  facts?: readonly JobBriefFact[];
  mustHaves?: readonly string[];
  niceToHaves?: readonly string[];
  redFlags?: readonly string[];
  /**
   * Which lists show, in order. Defaults to all three. Whether a page shows
   * its red flags is the host's call: leave `redFlags` out of `rules` where
   * they mustn't be seen.
   */
  rules?: readonly JobBriefRuleKind[];
  /**
   * Given, the lists are editable in place: each add, edit or remove hands
   * the whole new list to the host, with which list it is. The lists stay
   * controlled: they show the host's arrays. If the callback returns a
   * promise, the list shows what it sent, marked busy, until the promise
   * settles, then the host's arrays again, so a save that fails reverts and
   * the host says why. Resolve once the arrays reflect the save.
   */
  onRulesChange?: (kind: JobBriefRuleKind, items: string[]) => void | PromiseLike<unknown>;
  /** Titled parts after the lists, in order, such as role details, buyers, interview steps and the company. */
  sections?: readonly JobBriefSection[];
  /**
   * Last, such as example candidates or an action. In `collapsible` it folds
   * with the body; in `preview` it shows in both states, under the toggle.
   */
  footer?: ReactNode;
  /**
   * The brief is still being read from a document. With nothing to show and
   * nothing to edit yet, an in-progress blank slate stands in for the body;
   * otherwise a notice sits above it, so an editable brief keeps its lists
   * and add fields however long the reading takes.
   */
  processing?: boolean;
  /** Skeleton rows in place of a body that has nothing to show yet. */
  loading?: boolean;
  /** Whether the body is open: the collapsible's body, or the preview's full brief. */
  open?: boolean;
  /** Whether the body starts open when `open` is left to the card. Defaults to false. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * In a closed preview, how many facts and how many entries of the first
   * shown list with any show. Defaults to 3; 0 leaves the title, the
   * description and the toggle.
   */
  previewCount?: number;
  /**
   * The blank slate's wording when there is nothing to show and nothing to
   * edit. Defaults to "No brief yet".
   */
  empty?: CandidateEmptyCopy;
  labels?: Partial<JobBriefCardLabels>;
}

const RULE_KINDS: readonly JobBriefRuleKind[] = ["mustHaves", "niceToHaves", "redFlags"];
const NO_ITEMS: readonly string[] = [];
const NO_FACTS: readonly JobBriefFact[] = [];
const NO_SECTIONS: readonly JobBriefSection[] = [];

const SENTIMENT: Record<JobBriefRuleKind, Sentiment> = {
  mustHaves: "positive",
  niceToHaves: "warning",
  redFlags: "negative",
};

const ITEM_NAME: Record<JobBriefRuleKind, "mustHaveItem" | "niceToHaveItem" | "redFlagItem"> = {
  mustHaves: "mustHaveItem",
  niceToHaves: "niceToHaveItem",
  redFlags: "redFlagItem",
};

// The kit EditableList's own label, so a section reads as one more list.
const SECTION_LABEL = "text-xs font-medium uppercase tracking-wider";

// A long unbroken entry, such as a URL, must wrap inside the row instead of
// pushing the card wider than the page. The kit list's text column is a flex
// child without min-w-0 or a wrap rule, so both are set here (TODO: move into
// saas-kit's EditableList and drop this).
const RULE_LIST = "[&_li]:[overflow-wrap:anywhere] [&_li>*]:min-w-0";

// The kit list shows a row's edit and remove buttons on hover or focus only,
// which a touchscreen never has: there they stay visible, at the 44px a
// finger needs, with the fields beside them as tall. A row then outgrows its
// text, so its dot, text and buttons centre on one line (the dot drops the
// top offset that lines it up with the text's first line).
const EDITABLE_LIST = [
  "pointer-coarse:[&_button]:opacity-100",
  "pointer-coarse:[&_input]:min-h-[max(44px,2.75rem)]",
  "pointer-coarse:[&_li]:items-center",
  "pointer-coarse:[&_li>:first-child]:mt-0",
  COARSE_POINTER_TOUCH_TARGETS_WITHIN,
].join(" ");

type SubheadingLevel = 2 | 3 | 4 | 5;

function present(value: ReactNode): boolean {
  return value != null && value !== false && value !== "";
}

function sectionRows(section: JobBriefSection): number {
  return (section.facts?.length ?? 0) + (section.items?.length ?? 0);
}

function BriefFacts({ facts, bordered }: { facts: readonly JobBriefFact[]; bordered?: boolean }) {
  return (
    <DefinitionList variant="divided" className={bordered ? "border-t" : undefined}>
      {facts.map((fact) => (
        <DefinitionItem key={fact.id} label={fact.label}>{fact.value}</DefinitionItem>
      ))}
    </DefinitionList>
  );
}

function RuleList({
  kind,
  items,
  label,
  itemName,
  level,
  onRulesChange,
}: {
  kind: JobBriefRuleKind;
  items: readonly string[];
  label: ReactNode;
  itemName: string;
  level: SubheadingLevel;
  onRulesChange?: (kind: JobBriefRuleKind, items: string[]) => unknown;
}) {
  const [pending, save, sent] = usePendingCall(onRulesChange);
  const shown = pending && sent ? sent[1] : items;

  // A read-only list with nothing in it draws nothing, as the kit list does.
  if (!onRulesChange && shown.length === 0) return null;

  return (
    <Stack data-slot="job-brief-rule-list" data-kind={kind} aria-busy={pending || undefined} gap="none">
      <EditableList
        label={<span role="heading" aria-level={level}>{label}</span>}
        itemName={itemName}
        sentiment={SENTIMENT[kind]}
        items={[...shown]}
        onChange={onRulesChange ? (next) => save(kind, next) : undefined}
        className={onRulesChange ? `${RULE_LIST} ${EDITABLE_LIST}` : RULE_LIST}
      />
    </Stack>
  );
}

function BriefSection({ section, level }: { section: JobBriefSection; level: SubheadingLevel }) {
  const facts = section.facts ?? NO_FACTS;
  const items = section.items ?? [];
  if (facts.length === 0 && items.length === 0) return null;

  return (
    <Stack data-slot="job-brief-section" border="top" paddingTop="base" gap="compact">
      {/* A heading holding the kit list's label, so it lines up with the lists'. */}
      <Text as={`h${level}`} variant="inherit">
        <Text as="span" variant="caption" className={SECTION_LABEL}>{section.title}</Text>
      </Text>
      {facts.length > 0 ? <BriefFacts facts={facts} /> : null}
      {items.length > 0 ? (
        // The rule lists' rhythm: small type, 12px between entries.
        <List
          ordered={section.ordered}
          marker={section.ordered ? "decimal" : "disc"}
          spacing="normal"
          textSize="sm"
        >
          {items.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      ) : null}
    </Stack>
  );
}

/**
 * A job brief: what the role is, its headline facts, the must-have,
 * nice-to-have and red-flag lists, then titled sections such as role details
 * or the interview process, and a footer slot. Every value enters as a
 * display value or a slot, worded by the host.
 *
 * Two presentations share one body. `collapsible` is a kit Card holding a
 * CollapsibleSection, for a page: the title is the trigger and the whole
 * body folds under it. `preview` is a kit Card with the title as a heading,
 * for a message: closed, it shows the description (two lines), the first
 * `previewCount` facts and entries of the first shown list that has any,
 * then a toggle that opens the full brief in place; with nothing hidden, the
 * full brief shows and no toggle does. Closing it from the toggle brings the
 * card back into view, since a long brief's toggle sits far below its top.
 *
 * Given `onRulesChange`, the lists are editable in place, and saving stays
 * with the host. A read-only empty list draws nothing; an editable one keeps
 * the kit's "None set" and its add field, also while `processing`, under the
 * notice. A read-only brief with nothing to show is the kit's empty state,
 * or an in-progress one while `processing`; while `loading`, skeleton rows.
 *
 * The root is a `section` named by the title and marked
 * `data-slot="job-brief-card"`, with `data-presentation`; each list's
 * wrapper is marked `data-slot="job-brief-rule-list"` with its `data-kind`,
 * each section `data-slot="job-brief-section"`, and the skeleton
 * `data-slot="job-brief-loading"`. The kit Card inside keeps its own.
 */
export function JobBriefCard({
  presentation = "collapsible",
  title = "Job brief",
  titleLevel = 2,
  status,
  description,
  facts = NO_FACTS,
  mustHaves = NO_ITEMS,
  niceToHaves = NO_ITEMS,
  redFlags = NO_ITEMS,
  rules = RULE_KINDS,
  onRulesChange,
  sections = NO_SECTIONS,
  footer,
  processing = false,
  loading = false,
  open,
  defaultOpen = false,
  onOpenChange,
  previewCount = 3,
  empty = { title: "No brief yet" },
  labels,
  ...props
}: JobBriefCardProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const titleId = useId();
  const bodyId = useId();
  const [openState, setOpenState] = useState(defaultOpen);
  const expanded = open ?? openState;
  const setExpanded = (next: boolean) => {
    if (open === undefined) setOpenState(next);
    onOpenChange?.(next);
  };
  // A preview closed from its toggle, which sat at the foot of the full
  // brief: once it has closed, bring the card back into view, or the reader
  // is left far below it. "nearest" leaves a card that is in view alone.
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const card = returnTo.current;
    if (expanded || !card) return;
    returnTo.current = null;
    if (typeof card.scrollIntoView === "function") card.scrollIntoView({ block: "nearest" });
  }, [expanded]);

  const lists: Record<JobBriefRuleKind, readonly string[]> = { mustHaves, niceToHaves, redFlags };
  const shownRules = rules.filter((kind, index) => RULE_KINDS.includes(kind) && rules.indexOf(kind) === index);
  const editable = onRulesChange != null;
  // A collapsible's title is a button, not a heading, so its lists' and
  // sections' headings take the title's level rather than skip one.
  const subLevel = (presentation === "collapsible" ? titleLevel : titleLevel + 1) as SubheadingLevel;
  const hasDescription = present(description);
  const hasContent =
    hasDescription ||
    facts.length > 0 ||
    shownRules.some((kind) => lists[kind].length > 0) ||
    sections.some((section) => sectionRows(section) > 0);
  // An editable brief always keeps its lists, so the host's only way to add
  // rules never waits on a document that may never finish being read.
  const state = hasContent
    ? "content"
    : loading
      ? "loading"
      : editable
        ? "content"
        : processing
          ? "processing"
          : "empty";

  const blank =
    state === "loading" ? (
      <Stack data-slot="job-brief-loading" aria-busy gap="sm">
        <Skeleton preset="line-full" />
        <Skeleton preset="line-wide" />
        <Skeleton preset="row-compact" />
        <Skeleton preset="row-compact" />
      </Stack>
    ) : state === "processing" ? (
      <EmptyState
        variant="empty"
        size="inline"
        icon={Loader2}
        iconMotion="spin"
        title={text.processingTitle}
        description={text.processingDescription}
      />
    ) : state === "empty" ? (
      <EmptyState
        variant="empty"
        size="inline"
        icon={FileText}
        title={empty.title}
        // Without host wording, no description: the kit's generic one ("Get
        // started by creating...") doesn't fit a brief.
        description={empty.description ?? ""}
      />
    ) : null;

  const notice = processing ? (
    <Alert>
      <Icon icon={Loader2} size="sm" spin />
      <AlertDescription>{text.processing}</AlertDescription>
    </Alert>
  ) : null;

  const ruleList = (kind: JobBriefRuleKind, items: readonly string[], canEdit: boolean) => (
    <RuleList
      key={kind}
      kind={kind}
      items={items}
      label={text[kind]}
      itemName={text[ITEM_NAME[kind]]}
      level={subLevel}
      onRulesChange={canEdit ? onRulesChange : undefined}
    />
  );

  const fullBody = (
    <>
      {notice}
      {hasDescription ? <Text as="div" variant="caption">{description}</Text> : null}
      {facts.length > 0 ? <BriefFacts facts={facts} bordered /> : null}
      {shownRules.map((kind) => ruleList(kind, lists[kind], editable))}
      {sections.map((section) => (
        <BriefSection key={section.id} section={section} level={subLevel} />
      ))}
    </>
  );

  if (presentation === "collapsible") {
    const label = <span id={titleId}>{title}</span>;
    return (
      <Stack
        as="section"
        data-slot="job-brief-card"
        data-presentation="collapsible"
        aria-labelledby={titleId}
        gap="none"
        {...props}
      >
        <Card>
          <CollapsibleSection
            title={
              present(status) ? (
                <Stack as="span" direction="horizontal" gap="sm" align="center" minWidth="zero">
                  {label}
                  {status}
                </Stack>
              ) : (
                label
              )
            }
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            density="roomy"
            divided={false}
            inset="default"
          >
            {blank ?? fullBody}
            {state === "loading" ? null : footer}
          </CollapsibleSection>
        </Card>
      </Stack>
    );
  }

  // The preview: what is left out while it is closed. Its list is the first
  // one with entries, so an empty must-haves list doesn't leave it bare.
  const count = Math.max(0, Math.floor(previewCount));
  const first = shownRules.find((kind) => lists[kind].length > 0) ?? shownRules[0];
  const hidden =
    Math.max(0, facts.length - count) +
    shownRules.reduce(
      (sum, kind) => sum + (kind === first ? Math.max(0, lists[kind].length - count) : lists[kind].length),
      0,
    ) +
    sections.reduce((sum, section) => sum + sectionRows(section), 0);
  // Editing happens in the full brief, so an editable preview always offers it.
  const hasToggle = state === "content" && (hidden > 0 || editable);
  const full = !hasToggle || expanded;

  return (
    <Stack
      as="section"
      data-slot="job-brief-card"
      data-presentation="preview"
      aria-labelledby={titleId}
      gap="none"
      {...props}
    >
      <Card padding="md">
        <Stack gap="md">
          <Stack direction="horizontal" gap="md" align="start" justify="between">
            <FlexItem grow minWidth="zero">
              {/* The card-title look at every level. */}
              <Heading id={titleId} level={3} as={`h${titleLevel}`}>{title}</Heading>
            </FlexItem>
            {/* A badge would shrink and wrap before the title does. */}
            {present(status) ? <FlexItem shrink={false}>{status}</FlexItem> : null}
          </Stack>
          {blank ?? (
            <Stack id={bodyId} gap="md">
              {full ? (
                fullBody
              ) : (
                <>
                  {notice}
                  {hasDescription ? (
                    <Text as="div" variant="caption" lineClamp={2}>{description}</Text>
                  ) : null}
                  {count > 0 && facts.length > 0 ? <BriefFacts facts={facts.slice(0, count)} bordered /> : null}
                  {count > 0 && first ? ruleList(first, lists[first].slice(0, count), false) : null}
                </>
              )}
            </Stack>
          )}
          {hasToggle ? (
            <Stack direction="horizontal" gap="none">
              <Button
                type="button"
                variant="link-muted"
                size="bare"
                align="start"
                aria-expanded={expanded}
                aria-controls={expanded ? bodyId : undefined}
                onClick={(event) => {
                  if (expanded) {
                    returnTo.current = event.currentTarget.closest<HTMLElement>('[data-slot="job-brief-card"]');
                  }
                  setExpanded(!expanded);
                }}
                className={COARSE_POINTER_TOUCH_TARGET}
              >
                {expanded ? text.showLess : text.showMore(hidden)}
              </Button>
            </Stack>
          ) : null}
          {state === "loading" ? null : footer}
        </Stack>
      </Card>
    </Stack>
  );
}
