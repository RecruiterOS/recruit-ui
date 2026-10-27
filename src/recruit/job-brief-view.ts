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
