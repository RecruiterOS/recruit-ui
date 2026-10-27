import { describe, expect, it } from "vitest";

import {
  formatJobBriefSalary,
  jobBriefLabels,
  jobBriefTitle,
  jobBriefView,
  type JobBriefContent,
} from "./job-brief-view";

// A fictional role at a fictional company only.

const brief: JobBriefContent = {
  roleTitle: "Account Executive",
  companyName: "Fernhill Example Co",
  roleDescription: "Fernhill Example Co is hiring its first fictional account executive.",
  summary: "A fictional summary of the brief.",
  location: "Example City · hybrid",
  salaryMin: 60000,
  salaryMax: 80000,
  mustHaves: ["Fictional sales experience", "Example tooling", "A closed example deal", "Travel"],
  niceToHaves: ["Example certification"],
  redFlags: ["Fictional red flag"],
  icp: ["Example retailers", "Fictional wholesalers"],
  roleDetails: {
    ote: "120,000",
    quota: "500k a year",
    equity: "Some",
    avgDealSize: "40k",
    biggestDeal: "200k",
    salesCycle: "Three months",
    motion: "Outbound",
  },
  buyingPersonas: [
    { role: "Head of Example Operations", category: "economic_buyer", notes: "Signs off the budget" },
    { category: "champion" },
    { role: "Example Lead", category: "end_user" },
    {},
  ],
  interviewSteps: [
    { stepNumber: 3, label: "Final panel", interviewerName: "Sam Example", expectedFormat: "On site" },
    { stepNumber: 1, label: "Intro call", interviewerName: "Alex Example" },
    { stepNumber: 2, expectedFormat: "Case study" },
    {},
  ],
  companyOverview: {
    founded: 2015,
    headcount: 1250,
    hq: "Example City",
    arr: [
      { year: 2024, value: "2m" },
      { year: 2023, value: "1m" },
    ],
    teamDistribution: [
      { region: "Example North", count: 12 },
      { region: "Fictional South", count: 1200 },
    ],
  },
  companyWebsite: "https://fernhill.example.com",
};

describe("jobBriefTitle", () => {
  it("names the role and company, or the role alone when it names the company already", () => {
    expect(jobBriefTitle(brief)).toBe("Account Executive · Fernhill Example Co");
    expect(jobBriefTitle({ roleTitle: "Account Executive" })).toBe("Account Executive");
    expect(jobBriefTitle({ roleTitle: "Fernhill Example Co Account Executive", companyName: "fernhill example co" })).toBe(
      "Fernhill Example Co Account Executive",
    );
  });

  it("reads a parser's placeholder as no value, and cleans quotes, markdown and whitespace", () => {
    expect(jobBriefTitle({ roleTitle: "TBD", companyName: "Fernhill Example Co" })).toBe("Job brief");
    expect(jobBriefTitle({ roleTitle: "n/a" })).toBe("Job brief");
    expect(jobBriefTitle({ roleTitle: "Role" })).toBe("Job brief");
    expect(jobBriefTitle({ roleTitle: "   " })).toBe("Job brief");
    expect(jobBriefTitle({ roleTitle: null })).toBe("Job brief");
    expect(jobBriefTitle({ roleTitle: "Account Executive", companyName: "Unknown" })).toBe("Account Executive");
    expect(jobBriefTitle({ roleTitle: "**“Account   Executive”**", companyName: "# Fernhill Example Co" })).toBe(
      "Account Executive · Fernhill Example Co",
    );
  });

  it("drops a company that would take the title past 72 characters, and cuts a longer role", () => {
    const role = "Senior Fictional Enterprise Account Executive, Example Markets";
    expect(`${role} · Fernhill Example Co`.length).toBeGreaterThan(72);
    expect(jobBriefTitle({ roleTitle: role, companyName: "Fernhill Example Co" })).toBe(role);

    const fits = jobBriefTitle({ roleTitle: "A".repeat(50), companyName: "Fernhill Example Co" });
    expect(fits).toBe(`${"A".repeat(50)} · Fernhill Example Co`);
    expect(fits).toHaveLength(72);

    const long = `${"Fictional ".repeat(10)}Executive`;
    const cut = jobBriefTitle({ roleTitle: long });
    expect(cut).toBe(`${long.slice(0, 69).trimEnd()}…`);
    expect(cut.length).toBeLessThanOrEqual(72);
  });

  it("falls back to the host's title with no role", () => {
    expect(jobBriefTitle({ companyName: "Fernhill Example Co" })).toBe("Job brief");
    expect(jobBriefTitle({}, "Fictional brief")).toBe("Fictional brief");
  });
});

describe("formatJobBriefSalary", () => {
  it("shows full grouped numbers, ordered, with one figure when both ends agree", () => {
    expect(formatJobBriefSalary({ salaryMin: 60000, salaryMax: 80000 })).toBe("60,000–80,000");
    expect(formatJobBriefSalary({ salaryMin: 80000, salaryMax: 60000 })).toBe("60,000–80,000");
    expect(formatJobBriefSalary({ salaryMin: 70000, salaryMax: 70000 })).toBe("70,000");
  });

  it("words a band with one end", () => {
    expect(formatJobBriefSalary({ salaryMin: 60000 })).toBe("From 60,000");
    expect(formatJobBriefSalary({ salaryMax: 80000, salaryMin: null })).toBe("Up to 80,000");
    expect(formatJobBriefSalary({ salaryMin: 60000 }, { salaryFrom: (amount) => `${amount}+` })).toBe("60,000+");
  });

  it("is null with neither end, or with ends that aren't numbers", () => {
    expect(formatJobBriefSalary({})).toBeNull();
    expect(formatJobBriefSalary({ salaryMin: Number.NaN, salaryMax: null })).toBeNull();
  });

  it("shows a currency only when one is given, never a guessed one", () => {
    expect(formatJobBriefSalary({ salaryMin: 60000, salaryMax: 80000, currency: "GBP" })).toBe("£60,000–£80,000");
    expect(formatJobBriefSalary({ salaryMax: 80000, currency: "usd" })).toBe("Up to $80,000");
    expect(formatJobBriefSalary({ salaryMin: 60000, currency: "€" })).toBe("From €60,000");
    expect(formatJobBriefSalary({ salaryMin: 60000, currency: "  " })).toBe("From 60,000");
    expect(formatJobBriefSalary({ salaryMin: 60000, currency: null })).toBe("From 60,000");
  });
});

describe("jobBriefView", () => {
  it("titles the brief by its role, or plainly for a page whose header already names it", () => {
    expect(jobBriefView(brief).title).toBe("Account Executive · Fernhill Example Co");
    expect(jobBriefView(brief, { title: "generic" }).title).toBe("Job brief");
    expect(jobBriefView({ companyName: "Fernhill Example Co" }).title).toBe("Job brief");
  });

  it("lays out the facts and sections in one order, each only when the brief has it", () => {
    const view = jobBriefView(brief);
    expect(view.facts).toEqual([
      { id: "location", label: "Location", value: "Example City · hybrid" },
      { id: "salary", label: "Salary", value: "60,000–80,000" },
      { id: "ote", label: "OTE", value: "120,000" },
    ]);
    expect(view.sections.map((section) => [section.id, section.title])).toEqual([
      ["role-details", "Role details"],
      ["target-company-types", "Target company types"],
      ["buying-personas", "Buying personas"],
      ["interview-process", "Interview process"],
      ["company", "Company"],
    ]);
    expect(view.sections[0]!.facts).toEqual([
      { id: "quota", label: "Quota", value: "500k a year" },
      { id: "equity", label: "Equity", value: "Some" },
      { id: "avgDealSize", label: "Average deal size", value: "40k" },
      { id: "biggestDeal", label: "Biggest deal", value: "200k" },
      { id: "salesCycle", label: "Sales cycle", value: "Three months" },
      { id: "motion", label: "Sales motion", value: "Outbound" },
    ]);
    expect(view.sections[1]!.items).toEqual(["Example retailers", "Fictional wholesalers"]);
    expect(view.sections[4]!.facts).toEqual([
      { id: "website", label: "Website", value: "https://fernhill.example.com" },
      { id: "founded", label: "Founded", value: "2015" },
      { id: "headcount", label: "Headcount", value: "1,250" },
      { id: "hq", label: "HQ", value: "Example City" },
      { id: "arr", label: "ARR", value: "2023: 1m · 2024: 2m" },
      { id: "team", label: "Team", value: "Example North 12 · Fictional South 1,200" },
    ]);

    const sparse = jobBriefView({ roleTitle: "Account Executive", location: " ", salaryMax: 80000, mustHaves: ["Travel"] });
    expect(sparse.facts).toEqual([{ id: "salary", label: "Salary", value: "Up to 80,000" }]);
    expect(sparse.sections).toEqual([]);
  });

  it("words each buying persona by its role and category", () => {
    const personas = jobBriefView(brief).sections.find((section) => section.id === "buying-personas");
    expect(personas?.items).toEqual([
      "Head of Example Operations (economic buyer) — Signs off the budget",
      "Champion",
      "Example Lead (end user)",
    ]);
  });

  it("numbers the interview steps in their order, keeping unnumbered ones in place", () => {
    const steps = jobBriefView(brief).sections.find((section) => section.id === "interview-process");
    expect(steps?.ordered).toBe(true);
    expect(steps?.items).toEqual([
      "Intro call with Alex Example",
      "Case study",
      "Final panel with Sam Example · On site",
      "Step 4",
    ]);

    // Equal numbers keep the brief's order; a step without one sorts as if
    // numbered by its place in the list.
    const tied = jobBriefView({
      interviewSteps: [
        { stepNumber: 2, label: "Case study" },
        { stepNumber: 2, label: "Team lunch" },
        { label: "Final panel" },
        { stepNumber: 1, label: "Intro call" },
      ],
    }).sections[0]!;
    expect(tied.items).toEqual(["Intro call", "Case study", "Team lunch", "Final panel"]);
  });

  it("previews three facts and entries of the current brief, and only the title and description of an earlier one", () => {
    const now = jobBriefView(brief);
    expect(now.previewCount).toBe(3);
    expect(now.description).toBe(brief.roleDescription);

    const earlier = jobBriefView(brief, { current: false });
    expect(earlier.previewCount).toBe(0);
    // An earlier brief keeps its description, so opening it shows the whole brief.
    expect(earlier.description).toBe(brief.roleDescription);
    expect(jobBriefView({ ...brief, roleDescription: null }, { current: false }).description).toBe(brief.summary);
    // Everything else is the same brief.
    expect({ ...earlier, previewCount: 3 }).toEqual(now);
  });

  it("describes the role by its description, else the brief's summary", () => {
    expect(jobBriefView({ ...brief, roleDescription: "  " }).description).toBe("A fictional summary of the brief.");
    expect(jobBriefView({ roleTitle: "Account Executive" }).description).toBeUndefined();
  });

  it("hands the lists over as written, so an editable card saves exactly what it showed", () => {
    const mustHaves = ["Travel", "travel", " Example tooling "];
    const view = jobBriefView({ mustHaves, redFlags: null });
    expect(view.mustHaves).toEqual(mustHaves);
    expect(view.mustHaves).not.toBe(mustHaves);
    expect(view.niceToHaves).toEqual([]);
    expect(view.redFlags).toEqual([]);
    expect(view.rules).toEqual(["mustHaves", "niceToHaves", "redFlags"]);
  });

  it("leaves out what a public page mustn't show", () => {
    expect(jobBriefView(brief, { audience: "public" })).toEqual({
      title: "Account Executive · Fernhill Example Co",
      description: brief.roleDescription,
      facts: [
        { id: "location", label: "Location", value: "Example City · hybrid" },
        { id: "salary", label: "Salary", value: "60,000–80,000" },
      ],
      mustHaves: brief.mustHaves,
      niceToHaves: brief.niceToHaves,
      redFlags: [],
      rules: ["mustHaves", "niceToHaves"],
      sections: [
        { id: "target-company-types", title: "Target company types", items: brief.icp },
        {
          id: "buying-personas",
          title: "Buying personas",
          items: [
            "Head of Example Operations (economic buyer) — Signs off the budget",
            "Champion",
            "Example Lead (end user)",
          ],
        },
        {
          id: "interview-process",
          title: "Interview process",
          ordered: true,
          items: ["Intro call", "Case study", "Final panel · On site", "Step 4"],
        },
      ],
      previewCount: 3,
      ruleLabels: {
        mustHaves: "Must-haves",
        niceToHaves: "Nice-to-haves",
        redFlags: "Red flags",
        mustHaveItem: "must-have",
        niceToHaveItem: "nice-to-have",
        redFlagItem: "red flag",
      },
    });
  });

  it("appends the host's extra sections, dropping empty ones", () => {
    const view = jobBriefView(brief, {
      extraSections: [
        { id: "target-accounts", title: "Target companies", items: ["Example Retail Group (direct competitor)"] },
        { id: "nothing", title: "Nothing yet", items: [] },
      ],
    });
    expect(view.sections.map((section) => section.id)).toEqual([
      "role-details",
      "target-company-types",
      "buying-personas",
      "interview-process",
      "company",
      "target-accounts",
    ]);
    expect(view.sections.at(-1)?.items).toEqual(["Example Retail Group (direct competitor)"]);
  });

  it("takes the host's wording for any label, keeping the rest", () => {
    const view = jobBriefView(
      { ...brief, roleTitle: null, salaryMax: null },
      {
        labels: {
          title: "Fictional brief",
          salary: "Pay",
          salaryFrom: (amount) => `${amount} and up`,
          roleDetails: "The numbers",
          personaCategories: { champion: "advocate" },
          interviewStep: (number) => `Stage ${number}`,
          interviewWith: (step, interviewer) => `${step} (${interviewer})`,
        },
      },
    );
    expect(view.title).toBe("Fictional brief");
    expect(view.facts[1]).toEqual({ id: "salary", label: "Pay", value: "60,000 and up" });
    expect(view.sections.map((section) => section.title)).toEqual([
      "The numbers",
      "Target company types",
      "Buying personas",
      "Interview process",
      "Company",
    ]);
    expect(view.sections[2]!.items).toEqual([
      "Head of Example Operations (economic buyer) — Signs off the budget",
      "Advocate",
      "Example Lead (end user)",
    ]);
    expect(view.sections[3]!.items).toEqual([
      "Intro call (Alex Example)",
      "Case study",
      "Final panel (Sam Example) · On site",
      "Stage 4",
    ]);
  });

  it("names the lists and their entries by the same wording, so the card's controls read as the brief does", () => {
    expect(jobBriefView(brief).ruleLabels).toEqual({
      mustHaves: jobBriefLabels.mustHaves,
      niceToHaves: jobBriefLabels.niceToHaves,
      redFlags: jobBriefLabels.redFlags,
      mustHaveItem: jobBriefLabels.mustHaveItem,
      niceToHaveItem: jobBriefLabels.niceToHaveItem,
      redFlagItem: jobBriefLabels.redFlagItem,
    });
    const view = jobBriefView(brief, { labels: { mustHaves: "Essentials", mustHaveItem: "essential" } });
    expect(view.ruleLabels).toEqual({
      mustHaves: "Essentials",
      niceToHaves: "Nice-to-haves",
      redFlags: "Red flags",
      mustHaveItem: "essential",
      niceToHaveItem: "nice-to-have",
      redFlagItem: "red flag",
    });
  });

  it("reads a persona category that is an object's own key, never one it inherits", () => {
    const view = jobBriefView({ buyingPersonas: [{ role: "Example Lead", category: "constructor" }] });
    expect(view.sections[0]!.items).toEqual(["Example Lead (constructor)"]);
  });
});

describe("jobBriefLabels", () => {
  it("names the lists hyphenated, and can't be changed by a host", () => {
    expect(jobBriefLabels.mustHaves).toBe("Must-haves");
    expect(jobBriefLabels.niceToHaves).toBe("Nice-to-haves");
    expect(jobBriefLabels.redFlags).toBe("Red flags");
    expect([jobBriefLabels.mustHaveItem, jobBriefLabels.niceToHaveItem, jobBriefLabels.redFlagItem]).toEqual([
      "must-have",
      "nice-to-have",
      "red flag",
    ]);
    expect(Object.isFrozen(jobBriefLabels)).toBe(true);
    expect(Object.isFrozen(jobBriefLabels.personaCategories)).toBe(true);
  });
});
