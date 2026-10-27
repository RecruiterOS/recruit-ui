/**
 * One of a brief's three lists about the people a role wants: what they must
 * have, what would be nice, and what rules them out.
 */
type JobBriefRuleKind = "mustHaves" | "niceToHaves" | "redFlags";
/** A role's sales figures, each as the brief words it ("£400k ARR", say). */
interface JobBriefRoleDetails {
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
interface JobBriefPersona {
    role?: string | null;
    /** `champion`, `economic_buyer`, `gatekeeper`, `influencer`, or the brief's own word. */
    category?: string | null;
    notes?: string | null;
}
/** One step of the interview process. */
interface JobBriefInterviewStep {
    /** Where the step falls. Steps without one keep their place in the list. */
    stepNumber?: number | null;
    label?: string | null;
    interviewerName?: string | null;
    expectedFormat?: string | null;
}
/** The hiring company's figures. */
interface JobBriefCompanyOverview {
    founded?: number | null;
    headcount?: number | null;
    hq?: string | null;
    arr?: readonly {
        year: number;
        value: string;
    }[] | null;
    teamDistribution?: readonly {
        region: string;
        count: number;
    }[] | null;
}
/**
 * A job brief as display values, under the parsed brief's own field names.
 * Every field is optional; a host maps its own record onto this shape (its
 * stored brief, a job row, a message's snapshot) and `jobBriefView` does the
 * rest, so the same brief reads the same wherever it is shown.
 */
interface JobBriefContent {
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
interface JobBriefViewFact {
    id: string;
    label: string;
    value: string;
}
/** A titled part of the brief after its lists, as text. */
interface JobBriefViewSection {
    id: string;
    title: string;
    facts?: readonly JobBriefViewFact[];
    items?: readonly string[];
    /** Number the items, as for the steps of an interview process. */
    ordered?: boolean;
}
/** The fixed words of a brief, wherever it is shown. */
interface JobBriefLabels {
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
type JobBriefRuleLabels = Pick<JobBriefLabels, "mustHaves" | "niceToHaves" | "redFlags" | "mustHaveItem" | "niceToHaveItem" | "redFlagItem">;
/** The default wording of a brief. Pass `labels` to `jobBriefView` to change any of it. */
declare const jobBriefLabels: Readonly<JobBriefLabels>;
/**
 * How `jobBriefView` titles a brief. `role` names it after the role and
 * company ("Account Executive · Example Co"); `generic` is the plain title
 * ("Job brief"), for a page whose own header already names the role.
 */
type JobBriefTitleStyle = "role" | "generic";
interface JobBriefViewOptions {
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
interface JobBriefView {
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
/**
 * A brief's title: "Role · Company", or the role alone when there is no
 * company, the role already names it, or the pair would run past 72
 * characters (a long role is cut to fit). A placeholder the parser returns
 * for an absent field ("TBD", "N/A", "Role") counts as no value. With no role,
 * `fallback`.
 */
declare function jobBriefTitle(content: Pick<JobBriefContent, "roleTitle" | "companyName">, fallback?: string): string;
/**
 * A brief's salary band in full, grouped numbers: "80,000–100,000", one
 * figure when both ends agree, "From 80,000" or "Up to 100,000" with one
 * end. The currency's symbol leads each amount only when `currency` is set
 * ("£80,000"). Null with neither end.
 */
declare function formatJobBriefSalary(content: Pick<JobBriefContent, "salaryMin" | "salaryMax" | "currency">, labels?: Partial<Pick<JobBriefLabels, "salaryFrom" | "salaryUpTo">>): string | null;
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
declare function jobBriefView(content: JobBriefContent, options?: JobBriefViewOptions): JobBriefView;

export { type JobBriefCompanyOverview, type JobBriefContent, type JobBriefInterviewStep, type JobBriefLabels, type JobBriefPersona, type JobBriefRoleDetails, type JobBriefRuleKind, type JobBriefRuleLabels, type JobBriefTitleStyle, type JobBriefView, type JobBriefViewFact, type JobBriefViewOptions, type JobBriefViewSection, formatJobBriefSalary, jobBriefLabels, jobBriefTitle, jobBriefView };
