/**
 * One of a brief's three lists about the people a role wants: what they must
 * have, what would be nice, and what rules them out.
 */
export type JobBriefRuleKind = "mustHaves" | "niceToHaves" | "redFlags";

/** A role's sales figures, each as the brief words it ("£400k ARR", say). */
export interface JobBriefRoleDetails {
  /** On-target earnings. Shown as a headline fact, not in the role details. */
  ote?: string | null;
  quota?: string | null;
  equity?: string | null;
  avgDealSize?: string | null;
  biggestDeal?: string | null;
  salesCycle?: string | null;
  motion?: string | null;
}

/** Someone the role sells to. */
export interface JobBriefPersona {
  role?: string | null;
  /** `champion`, `economic_buyer`, `gatekeeper`, `influencer`, or the brief's own word. */
  category?: string | null;
  notes?: string | null;
}

/** One step of the interview process. */
export interface JobBriefInterviewStep {
  /** Where the step falls. Steps without one keep their place in the list. */
  stepNumber?: number | null;
  label?: string | null;
  interviewerName?: string | null;
  expectedFormat?: string | null;
}

/** The hiring company's figures. */
export interface JobBriefCompanyOverview {
  founded?: number | null;
  headcount?: number | null;
  hq?: string | null;
  arr?: readonly { year: number; value: string }[] | null;
  teamDistribution?: readonly { region: string; count: number }[] | null;
}

/**
 * A job brief as display values, under the parsed brief's own field names.
 * Every field is optional; a host maps its own record onto this shape (its
 * stored brief, a job row, a message's snapshot) and `jobBriefView` does the
 * rest, so the same brief reads the same wherever it is shown.
 */
export interface JobBriefContent {
  roleTitle?: string | null;
  companyName?: string | null;
  /** What the role is. Preferred over `summary` as the card's description. */
  roleDescription?: string | null;
  /** A summary of the brief, the description when there is no `roleDescription`. */
  summary?: string | null;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  /**
   * The salary's currency, as an ISO 4217 code ("GBP") or a symbol ("£").
   * Without one the salary shows as bare numbers: a currency is never guessed.
   */
  currency?: string | null;
  mustHaves?: readonly string[] | null;
  niceToHaves?: readonly string[] | null;
  redFlags?: readonly string[] | null;
  /** The kinds of company the role targets. */
  icp?: readonly string[] | null;
  roleDetails?: JobBriefRoleDetails | null;
  buyingPersonas?: readonly JobBriefPersona[] | null;
  interviewSteps?: readonly JobBriefInterviewStep[] | null;
  companyOverview?: JobBriefCompanyOverview | null;
  companyWebsite?: string | null;
}

/** One labelled fact, as text. */
export interface JobBriefViewFact {
  id: string;
  label: string;
  value: string;
}

/** A titled part of the brief after its lists, as text. */
export interface JobBriefViewSection {
  id: string;
  title: string;
  facts?: readonly JobBriefViewFact[];
  items?: readonly string[];
  /** Number the items, as for the steps of an interview process. */
  ordered?: boolean;
}

/** The fixed words of a brief, wherever it is shown. */
export interface JobBriefLabels {
  /** The title when the brief names no role, and the `generic` title. */
  title: string;
  /** The must-haves list's name. */
  mustHaves: string;
  /** The nice-to-haves list's name. */
  niceToHaves: string;
  /** The red-flags list's name. */
  redFlags: string;
  /** What one must-have is called, as in "Add must-have…". */
  mustHaveItem: string;
  /** What one nice-to-have is called. */
  niceToHaveItem: string;
  /** What one red flag is called. */
  redFlagItem: string;
  location: string;
  salary: string;
  /** A salary with only a floor, given the formatted amount. */
  salaryFrom: (amount: string) => string;
  /** A salary with only a ceiling, given the formatted amount. */
  salaryUpTo: (amount: string) => string;
  /** On-target earnings. */
  ote: string;
  roleDetails: string;
  quota: string;
  equity: string;
  avgDealSize: string;
  biggestDeal: string;
  salesCycle: string;
  motion: string;
  /** The section listing the kinds of company the role targets. */
  targetCompanyTypes: string;
  buyingPersonas: string;
  /** A persona's category as it reads after the persona's role, by category. */
  personaCategories: Readonly<Record<string, string>>;
  interviewProcess: string;
  /** A step with no label or format, given its number. */
  interviewStep: (number: number) => string;
  /** A step and who runs it. */
  interviewWith: (step: string, interviewer: string) => string;
  company: string;
  website: string;
  founded: string;
  headcount: string;
  hq: string;
  arr: string;
  team: string;
}

/**
 * The lists' names and what one entry of each is called: the part of a
 * brief's wording a JobBriefCard draws itself, which `jobBriefView` hands it
 * as `ruleLabels`.
 */
export type JobBriefRuleLabels = Pick<
  JobBriefLabels,
  "mustHaves" | "niceToHaves" | "redFlags" | "mustHaveItem" | "niceToHaveItem" | "redFlagItem"
>;

/** The default wording of a brief. Pass `labels` to `jobBriefView` to change any of it. */
export const jobBriefLabels: Readonly<JobBriefLabels> = Object.freeze({
  title: "Job brief",
  mustHaves: "Must-haves",
  niceToHaves: "Nice-to-haves",
  redFlags: "Red flags",
  mustHaveItem: "must-have",
  niceToHaveItem: "nice-to-have",
  redFlagItem: "red flag",
  location: "Location",
  salary: "Salary",
  salaryFrom: (amount: string) => `From ${amount}`,
  salaryUpTo: (amount: string) => `Up to ${amount}`,
  ote: "OTE",
  roleDetails: "Role details",
  quota: "Quota",
  equity: "Equity",
  avgDealSize: "Average deal size",
  biggestDeal: "Biggest deal",
  salesCycle: "Sales cycle",
  motion: "Sales motion",
  targetCompanyTypes: "Target company types",
  buyingPersonas: "Buying personas",
  personaCategories: Object.freeze({
    champion: "champion",
    economic_buyer: "economic buyer",
    gatekeeper: "gatekeeper",
    influencer: "influencer",
  }),
  interviewProcess: "Interview process",
  interviewStep: (number: number) => `Step ${number}`,
  interviewWith: (step: string, interviewer: string) => `${step} with ${interviewer}`,
  company: "Company",
  website: "Website",
  founded: "Founded",
  headcount: "Headcount",
  hq: "HQ",
  arr: "ARR",
  team: "Team",
});

/**
 * How `jobBriefView` titles a brief. `role` names it after the role and
 * company ("Account Executive · Example Co"); `generic` is the plain title
 * ("Job brief"), for a page whose own header already names the role.
 */
export type JobBriefTitleStyle = "role" | "generic";

export interface JobBriefViewOptions {
  /**
   * Whether this is the brief in force now (the default) or one a later brief
   * replaced. A current brief previews its first three facts and entries; an
   * earlier one only its title and description, so a history of briefs stays
   * short.
   */
  current?: boolean;
  /** `role` (the default) or `generic`. */
  title?: JobBriefTitleStyle;
  /**
   * `public` for a page anyone holding its link can open: the brief without
   * its red flags, on-target earnings, role details, company figures or
   * interviewers' names. Leave it out where the brief's own team reads it.
   */
  audience?: "public";
  labels?: Partial<JobBriefLabels>;
  /** Further sections after the brief's own, in order, such as the named accounts a role targets. */
  extraSections?: readonly JobBriefViewSection[];
}

/** What a JobBriefCard shows for a brief: spread it onto the card. */
export interface JobBriefView {
  title: string;
  description?: string;
  /** Location, salary and on-target earnings, each only when the brief has it. */
  facts: JobBriefViewFact[];
  mustHaves: string[];
  niceToHaves: string[];
  redFlags: string[];
  /** The lists shown, in order. */
  rules: JobBriefRuleKind[];
  /** Role details, target company types, buying personas, interview process, company, then any extra sections; only those with something in them. */
  sections: JobBriefViewSection[];
  previewCount: number;
  /** The lists' names and what one entry of each is called, from `labels`. */
  ruleLabels: JobBriefRuleLabels;
}

const LOCALE = "en-GB";
const plain = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });

const ROLE_DETAILS = ["quota", "equity", "avgDealSize", "biggestDeal", "salesCycle", "motion"] as const;

// A title fits a sidebar row and a card heading alike.
const MAX_TITLE_LENGTH = 72;

// Values a parser returns when a field is absent rather than a real value.
const ABSENT_VALUE =
  /^(?:n\/?a|none|null|nil|unknown|tbd|tbc|not (?:specified|provided|stated|known)|unspecified|confidential|undisclosed|untitled|role|job|position|title|various|multiple(?: roles)?|-+)$/i;

/** Trimmed text; absent, blank and non-text are all undefined. */
function text(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() || undefined : undefined;
}

function finite(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function truncate(value: string, max: number): string {
  const clean = value.trim();
  return clean.length > max ? `${clean.slice(0, max - 3).trimEnd()}…` : clean;
}

/** A title part as display text: whitespace collapsed, quotes and markdown stripped, a placeholder dropped. */
function titleText(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const clean = value
    .replace(/\s+/g, " ")
    .replace(/^[\s"'“”‘’`*#]+|[\s"'“”‘’`*]+$/g, "")
    .trim();
  return clean && !ABSENT_VALUE.test(clean) ? truncate(clean, max) : undefined;
}

function capitalise(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

/** Formats one amount: with the currency's symbol when there is one, else a bare grouped number. */
function amountFormat(currency: unknown): (value: number) => string {
  const code = text(currency);
  if (!code) return (value) => plain.format(value);
  try {
    const money = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (value) => money.format(value);
  } catch {
    // Not an ISO 4217 code: shown as given, a symbol ("£") against the
    // amount and a word apart from it.
    return (value) => (/\p{L}$/u.test(code) ? `${code} ${plain.format(value)}` : `${code}${plain.format(value)}`);
  }
}

function fact(id: string, label: string, value: string | null | undefined): JobBriefViewFact[] {
  return value ? [{ id, label, value }] : [];
}

/**
 * A brief's title: "Role · Company", or the role alone when there is no
 * company, the role already names it, or the pair would run past 72
 * characters (a long role is cut to fit). A placeholder the parser returns
 * for an absent field ("TBD", "N/A", "Role") counts as no value. With no role,
 * `fallback`.
 */
export function jobBriefTitle(
  content: Pick<JobBriefContent, "roleTitle" | "companyName">,
  fallback: string = jobBriefLabels.title,
): string {
  const role = titleText(content.roleTitle, 240);
  if (!role) return fallback;
  const company = titleText(content.companyName, 120);
  if (company && !role.toLowerCase().includes(company.toLowerCase())) {
    const combined = `${role} · ${company}`;
    if (combined.length <= MAX_TITLE_LENGTH) return combined;
  }
  return truncate(role, MAX_TITLE_LENGTH);
}

/**
 * A brief's salary band in full, grouped numbers: "80,000–100,000", one
 * figure when both ends agree, "From 80,000" or "Up to 100,000" with one
 * end. The currency's symbol leads each amount only when `currency` is set
 * ("£80,000"). Null with neither end.
 */
export function formatJobBriefSalary(
  content: Pick<JobBriefContent, "salaryMin" | "salaryMax" | "currency">,
  labels: Partial<Pick<JobBriefLabels, "salaryFrom" | "salaryUpTo">> = {},
): string | null {
  const min = finite(content.salaryMin);
  const max = finite(content.salaryMax);
  const amount = amountFormat(content.currency);
  if (min !== undefined && max !== undefined) {
    return min === max ? amount(min) : `${amount(Math.min(min, max))}–${amount(Math.max(min, max))}`;
  }
  if (min !== undefined) return (labels.salaryFrom ?? jobBriefLabels.salaryFrom)(amount(min));
  if (max !== undefined) return (labels.salaryUpTo ?? jobBriefLabels.salaryUpTo)(amount(max));
  return null;
}

function persona({ role, category, notes }: JobBriefPersona, categories: Readonly<Record<string, string>>): string {
  const who = text(role);
  const key = text(category);
  const kind = key ? (Object.hasOwn(categories, key) ? categories[key] : key.replace(/_/g, " ")) : undefined;
  const name = who ? (kind ? `${who} (${kind})` : who) : kind ? capitalise(kind) : "";
  return [name, text(notes)].filter(Boolean).join(" — ");
}

function interviewSteps(
  steps: readonly JobBriefInterviewStep[],
  named: boolean,
  labels: JobBriefLabels,
): string[] {
  return steps
    .map((step, index) => ({ step, index }))
    .sort(
      (left, right) =>
        (finite(left.step.stepNumber) ?? left.index + 1) - (finite(right.step.stepNumber) ?? right.index + 1) ||
        left.index - right.index,
    )
    .map(({ step }, index) => {
      const label = text(step.label);
      const format = text(step.expectedFormat);
      const interviewer = text(step.interviewerName);
      const name = label ?? format ?? labels.interviewStep(finite(step.stepNumber) ?? index + 1);
      const run = named && interviewer ? labels.interviewWith(name, interviewer) : name;
      return label && format ? `${run} · ${format}` : run;
    });
}

function companyFacts(content: JobBriefContent, labels: JobBriefLabels): JobBriefViewFact[] {
  const company = content.companyOverview ?? {};
  const founded = finite(company.founded);
  const headcount = finite(company.headcount);
  const arr = [...(company.arr ?? [])]
    .filter(({ year, value }) => finite(year) !== undefined && text(value))
    .sort((left, right) => left.year - right.year)
    .map(({ year, value }) => `${year}: ${text(value)}`);
  const team = (company.teamDistribution ?? [])
    .filter(({ region, count }) => text(region) && finite(count) !== undefined)
    .map(({ region, count }) => `${text(region)} ${plain.format(count)}`);
  return [
    ...fact("website", labels.website, text(content.companyWebsite)),
    ...fact("founded", labels.founded, founded === undefined ? null : String(founded)),
    ...fact("headcount", labels.headcount, headcount === undefined ? null : plain.format(headcount)),
    ...fact("hq", labels.hq, text(company.hq)),
    ...fact("arr", labels.arr, arr.join(" · ")),
    ...fact("team", labels.team, team.join(" · ")),
  ];
}

const ALL_RULES: readonly JobBriefRuleKind[] = ["mustHaves", "niceToHaves", "redFlags"];
const PUBLIC_RULES: readonly JobBriefRuleKind[] = ["mustHaves", "niceToHaves"];

/**
 * What a JobBriefCard shows for a brief, so the same brief reads the same
 * wherever it appears: spread the result onto the card and add only the
 * host's own props (presentation, status, editing, footer, open state).
 *
 * - The title follows `jobBriefTitle`, or is `labels.title` with `title:
 *   "generic"`.
 * - The description is the role description, else the summary, whether the
 *   brief is current or not.
 * - The facts are location, salary (`formatJobBriefSalary`) and on-target
 *   earnings, in that order, each only when the brief has it.
 * - The lists are the brief's own, in its order and as written, so an editable
 *   card hands back exactly what it was given.
 * - The sections are the role details, target company types, buying personas,
 *   the interview process in step order and the company, then
 *   `extraSections`; only those with something in them.
 * - A current brief previews three facts and entries, an earlier one none.
 * - The lists are named, and their entries called, by `labels`, so the
 *   card's controls ("Add must-have…") read the same as the brief.
 *
 * With `audience: "public"`, the red flags, on-target earnings, role details,
 * company section and interviewers' names are left out, and the red-flag list
 * isn't among the `rules`.
 */
export function jobBriefView(content: JobBriefContent, options: JobBriefViewOptions = {}): JobBriefView {
  const { current = true, title = "role", audience, extraSections = [] } = options;
  const labels: JobBriefLabels = {
    ...jobBriefLabels,
    ...options.labels,
    personaCategories: { ...jobBriefLabels.personaCategories, ...options.labels?.personaCategories },
  };
  // A public page leaves out what the role's own team may not want seen outside it.
  const internal = audience !== "public";
  const details = content.roleDetails ?? {};
  const sections: JobBriefViewSection[] = [
    {
      id: "role-details",
      title: labels.roleDetails,
      facts: internal ? ROLE_DETAILS.flatMap((key) => fact(key, labels[key], text(details[key]))) : [],
    },
    { id: "target-company-types", title: labels.targetCompanyTypes, items: [...(content.icp ?? [])] },
    {
      id: "buying-personas",
      title: labels.buyingPersonas,
      items: (content.buyingPersonas ?? []).map((entry) => persona(entry, labels.personaCategories)).filter(Boolean),
    },
    {
      id: "interview-process",
      title: labels.interviewProcess,
      ordered: true,
      items: interviewSteps(content.interviewSteps ?? [], internal, labels),
    },
    { id: "company", title: labels.company, facts: internal ? companyFacts(content, labels) : [] },
    ...extraSections,
  ];

  return {
    title: title === "generic" ? labels.title : jobBriefTitle(content, labels.title),
    description: text(content.roleDescription) ?? text(content.summary),
    facts: [
      ...fact("location", labels.location, text(content.location)),
      ...fact("salary", labels.salary, formatJobBriefSalary(content, labels)),
      ...(internal ? fact("ote", labels.ote, text(details.ote)) : []),
    ],
    mustHaves: [...(content.mustHaves ?? [])],
    niceToHaves: [...(content.niceToHaves ?? [])],
    redFlags: internal ? [...(content.redFlags ?? [])] : [],
    rules: [...(internal ? ALL_RULES : PUBLIC_RULES)],
    sections: sections.filter((section) => (section.facts?.length ?? 0) + (section.items?.length ?? 0) > 0),
    previewCount: current ? 3 : 0,
    ruleLabels: {
      mustHaves: labels.mustHaves,
      niceToHaves: labels.niceToHaves,
      redFlags: labels.redFlags,
      mustHaveItem: labels.mustHaveItem,
      niceToHaveItem: labels.niceToHaveItem,
      redFlagItem: labels.redFlagItem,
    },
  };
}

/* ---------- versions ---------- */

/** The words a brief's version reads in, as `jobBriefVersionLabel` puts them together. */
export interface JobBriefVersionLabels {
  /** A version's number as it reads: "v3". */
  number: (number: number) => string;
  /** What marks the version in force now: "Current". */
  current: string;
  /** What marks a version a later one replaced: "Earlier". Empty for the number alone. */
  earlier: string;
  /** Between the number and its mark: " · ". */
  separator: string;
}

/** The default wording of a brief's version. Pass `labels` to `jobBriefVersionLabel` to change any of it. */
export const jobBriefVersionLabels: Readonly<JobBriefVersionLabels> = Object.freeze({
  number: (number: number) => `v${number}`,
  current: "Current",
  earlier: "Earlier",
  separator: " · ",
});

/**
 * Which version of a brief a card shows: JobBriefCard's `version`, which it
 * draws in its status slot.
 */
export interface JobBriefVersion {
  /** The version's number, counted from 1. */
  number: number;
  /** Whether this is the version in force now, rather than one a later version replaced. */
  current: boolean;
  /** The version's whole wording, in place of `jobBriefVersionLabel`'s. */
  label?: string;
  /**
   * A second, neutral badge after the version's, such as the number another
   * system gives the same version ("Partner v48"), so people using either
   * name the same one.
   */
  secondaryLabel?: string;
}

/**
 * A version's wording: its number and whether it is in force, "v3 · Current"
 * for the version in force now and "v2 · Earlier" for one a later version
 * replaced, so the state is always in words and never in a badge's colour
 * alone. A number that isn't a whole number from 1 is left out, leaving the
 * mark ("Current"); an empty `labels.earlier` leaves an earlier version's
 * number alone ("v2"). The version's own `label`, when it has one, wins.
 */
export function jobBriefVersionLabel(
  version: Pick<JobBriefVersion, "number" | "current" | "label">,
  labels: Partial<JobBriefVersionLabels> = {},
): string {
  const own = text(version.label);
  if (own) return own;
  const words = { ...jobBriefVersionLabels, ...labels };
  const number = validVersion(version.number) ? words.number(version.number) : "";
  const mark = version.current ? words.current : words.earlier;
  return [number, mark].filter(Boolean).join(words.separator);
}

function validVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/* ---------- what a version changed ---------- */

/**
 * What one change did: `set` a field's value, `cleared` it, `added` or
 * `removed` a list's entry, `reworded` one, `moved` one, or `replaced` a
 * whole field (a list of steps, say) at once.
 */
export type JobBriefChangeKind = "set" | "cleared" | "added" | "removed" | "reworded" | "moved" | "replaced";

/**
 * A value as a change shows it: text (whitespace collapsed, cut to 80
 * characters), a number (grouped, "80,000", so pass a year as text), or a
 * list, counted ("3 entries").
 */
export type JobBriefChangeValue = string | number | readonly unknown[];

/**
 * One change a version of a brief made, as display values: a host maps its
 * own record of a change onto this, naming the field in its own words.
 *
 * | kind | reads | uses |
 * | --- | --- | --- |
 * | `added` | Added must-have: Python | `item` |
 * | `removed` | Removed red flag: Job hopping | `item` |
 * | `reworded` | Reworded must-have: "Python" → "Python 3" | `from`, `to` |
 * | `moved` | Moved must-have "Python" to position 1 | `item`, `to` (the position) |
 * | `set` | Location: Remote → Hybrid | `fieldTitle`, `from`, `to` |
 * | `cleared` | Removed the location (was Remote) | `from` |
 * | `replaced` | Replaced the interview steps (3 entries) | `to` |
 *
 * With `prose`, the line says only that the field was added, updated or
 * removed ("Updated the role description"), since its text would swamp a line.
 */
export interface JobBriefChange {
  /** Stable key for the line. Defaults to its place in the list. */
  id?: string;
  kind: JobBriefChangeKind;
  /** The field's name as it reads mid-sentence: "must-have", "location", "OTE". */
  field: string;
  /** The field's name where it leads a `set` line: "Location". Defaults to `field` with a capital. */
  fieldTitle?: string;
  /** The list entry an `added`, `removed` or `moved` change is about. */
  item?: string | null;
  /**
   * What it was: a `reworded` entry's old words, a `set` field's old value,
   * a `cleared` field's last value. Left out for a field set for the first time.
   */
  from?: JobBriefChangeValue | null;
  /**
   * What it is now: a `reworded` entry's new words, a `set` field's new
   * value, what a `replaced` field holds now. For `moved`, the entry's new
   * position, counted from 1.
   */
  to?: JobBriefChangeValue | null;
  /**
   * A prose field, such as a role description or a summary: the line says
   * only that it was added (no `from`), updated (a `from`) or removed
   * (`cleared`), never its text.
   */
  prose?: boolean;
}

/**
 * The words a version's changes read in. Each line's wording takes its
 * values already shaped for a line, and an empty string for one that is
 * absent.
 */
export interface JobBriefChangeLabels {
  /** "Added must-have: Python". */
  added: (field: string, item: string) => string;
  /** "Removed red flag: Job hopping". */
  removed: (field: string, item: string) => string;
  /** 'Reworded must-have: "Python" → "Python 3"'. */
  reworded: (field: string, from: string, to: string) => string;
  /** 'Moved must-have "Python" to position 1'; without a position, 'Moved must-have "Python"'. */
  moved: (field: string, item: string, position: string) => string;
  /** "Location: Remote → Hybrid"; without an old value, "Location: Hybrid". */
  set: (fieldTitle: string, from: string, to: string) => string;
  /** "Removed the location (was Remote)"; without its last value, "Removed the location". */
  cleared: (field: string, from: string) => string;
  /** "Replaced the interview steps (3 entries)". */
  replaced: (field: string, to: string) => string;
  /** A prose field set for the first time: "Added a role description". */
  proseAdded: (field: string) => string;
  /** A prose field rewritten: "Updated the role description". */
  proseUpdated: (field: string) => string;
  /** A prose field removed: "Removed the role description". */
  proseCleared: (field: string) => string;
  /** A list as a value, by how many entries it holds: "3 entries". */
  entries: (count: number) => string;
  /** JobBriefChanges' toggle, by how many changes it folds away: "2 more changes". */
  more: (count: number) => string;
  /** JobBriefChanges' name for a screen reader, by the version the changes made: "What changed in v3". */
  groupName: (version?: number) => string;
}

/** The default wording of a version's changes. Pass `labels` to change any of it. */
export const jobBriefChangeLabels: Readonly<JobBriefChangeLabels> = Object.freeze({
  added: (field: string, item: string) => (item ? `Added ${field}: ${item}` : `Added ${field}`),
  removed: (field: string, item: string) => (item ? `Removed ${field}: ${item}` : `Removed ${field}`),
  reworded: (field: string, from: string, to: string) =>
    from && to ? `Reworded ${field}: "${from}" → "${to}"` : to ? `Reworded ${field}: "${to}"` : `Reworded ${field}`,
  moved: (field: string, item: string, position: string) => {
    const moved = item ? `Moved ${field} "${item}"` : `Moved ${field}`;
    return position ? `${moved} to position ${position}` : moved;
  },
  set: (fieldTitle: string, from: string, to: string) =>
    from && to ? `${fieldTitle}: ${from} → ${to}` : to ? `${fieldTitle}: ${to}` : fieldTitle,
  cleared: (field: string, from: string) => (from ? `Removed the ${field} (was ${from})` : `Removed the ${field}`),
  replaced: (field: string, to: string) => (to ? `Replaced the ${field} (${to})` : `Replaced the ${field}`),
  proseAdded: (field: string) => `Added ${/^[aeiou]/i.test(field) ? "an" : "a"} ${field}`,
  proseUpdated: (field: string) => `Updated the ${field}`,
  proseCleared: (field: string) => `Removed the ${field}`,
  entries: (count: number) => `${plain.format(count)} ${count === 1 ? "entry" : "entries"}`,
  more: (count: number) => `${plain.format(count)} more ${count === 1 ? "change" : "changes"}`,
  groupName: (version?: number) =>
    validVersion(version) ? `What changed in ${jobBriefVersionLabels.number(version)}` : "What changed",
});

// A value longer than this is cut, so one change never swamps its line.
const MAX_CHANGE_VALUE_LENGTH = 80;
const grouped = new Intl.NumberFormat(LOCALE);

/** A change's value as a line shows it, or an empty string for none. */
function changeValue(value: unknown, labels: JobBriefChangeLabels): string {
  if (typeof value === "string") {
    // Cut by characters, never through one (a surrogate pair stays whole).
    const characters = Array.from(value.replace(/\s+/g, " ").trim());
    return characters.length > MAX_CHANGE_VALUE_LENGTH
      ? `${characters.slice(0, MAX_CHANGE_VALUE_LENGTH - 3).join("").trimEnd()}…`
      : characters.join("");
  }
  if (typeof value === "number") return Number.isFinite(value) ? grouped.format(value) : "";
  if (Array.isArray(value)) return labels.entries(value.length);
  return "";
}

/**
 * One change as a line: "Added must-have: Python", "Location: Remote →
 * Hybrid", "Removed the location (was Remote)", in the field's own words
 * (`field`, and `fieldTitle` where it leads the line). Each value is shaped
 * for a line: text with its whitespace collapsed and cut to 80 characters
 * with an ellipsis, a number grouped ("80,000"), a list counted ("3
 * entries"). A `set` with nothing new and an old value reads as `cleared`; a
 * `prose` field says only that it was added, updated or removed.
 */
export function jobBriefChangeText(change: JobBriefChange, labels: Partial<JobBriefChangeLabels> = {}): string {
  const words: JobBriefChangeLabels = { ...jobBriefChangeLabels, ...labels };
  const field = text(change.field) ?? "";
  const from = changeValue(change.from, words);
  const to = changeValue(change.to, words);
  const item = changeValue(change.item, words);
  if (change.prose) {
    if (change.kind === "cleared" || change.kind === "removed") return words.proseCleared(field);
    return from ? words.proseUpdated(field) : words.proseAdded(field);
  }
  switch (change.kind) {
    case "added":
      return words.added(field, item);
    case "removed":
      return words.removed(field, item);
    case "reworded":
      return words.reworded(field, from, to);
    case "moved":
      return words.moved(field, item, to);
    case "cleared":
      return words.cleared(field, from);
    case "replaced":
      return words.replaced(field, to);
    case "set":
    default:
      // A kind this release doesn't know reads as a new value, never as nothing.
      if (!to && from) return words.cleared(field, from);
      return words.set(text(change.fieldTitle) ?? capitalise(field), from, to);
  }
}
