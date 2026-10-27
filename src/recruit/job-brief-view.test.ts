import { describe, expect, it } from "vitest";

import {
  formatJobBriefSalary,
  jobBriefChangeLabels,
  jobBriefChangeText,
  jobBriefLabels,
  jobBriefTitle,
  jobBriefVersionLabel,
  jobBriefVersionLabels,
  jobBriefView,
  type JobBriefChange,
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

describe("jobBriefVersionLabel", () => {
  it("words the version in force now as current, and one a later version replaced as earlier", () => {
    expect(jobBriefVersionLabel({ number: 3, current: true })).toBe("v3 · Current");
    expect(jobBriefVersionLabel({ number: 2, current: false })).toBe("v2 · Earlier");
    expect(jobBriefVersionLabel({ number: 1, current: false })).toBe("v1 · Earlier");
  });

  it("leaves out a number that isn't a whole number from 1, keeping the mark", () => {
    for (const number of [0, -2, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(jobBriefVersionLabel({ number, current: true })).toBe("Current");
      expect(jobBriefVersionLabel({ number, current: false })).toBe("Earlier");
    }
  });

  it("takes the host's words, and an empty earlier mark leaves the number alone", () => {
    const labels = { number: (number: number) => `Version ${number}`, current: "Live", separator: " – " };
    expect(jobBriefVersionLabel({ number: 4, current: true }, labels)).toBe("Version 4 – Live");
    expect(jobBriefVersionLabel({ number: 2, current: false }, { earlier: "" })).toBe("v2");
    expect(jobBriefVersionLabel({ number: 0, current: false }, { earlier: "" })).toBe("");
  });

  it("uses the version's own label when it has one", () => {
    expect(jobBriefVersionLabel({ number: 3, current: true, label: "Draft" })).toBe("Draft");
    // A blank label is no label.
    expect(jobBriefVersionLabel({ number: 3, current: true, label: "  " })).toBe("v3 · Current");
  });

  it("can't be changed by a host", () => {
    expect(Object.isFrozen(jobBriefVersionLabels)).toBe(true);
  });
});

describe("jobBriefChangeText", () => {
  it("words each of the seven kinds of change", () => {
    const lines: [JobBriefChange, string][] = [
      [{ kind: "added", field: "must-have", item: "Python" }, "Added must-have: Python"],
      [{ kind: "removed", field: "red flag", item: "Job hopping" }, "Removed red flag: Job hopping"],
      [{ kind: "reworded", field: "must-have", from: "Python", to: "Python 3" }, 'Reworded must-have: "Python" → "Python 3"'],
      [{ kind: "moved", field: "must-have", item: "Python", to: 1 }, 'Moved must-have "Python" to position 1'],
      [{ kind: "set", field: "location", from: "Example City", to: "Example Town" }, "Location: Example City → Example Town"],
      [{ kind: "cleared", field: "location", from: "Example City" }, "Removed the location (was Example City)"],
      [{ kind: "replaced", field: "interview steps", to: [{}, {}, {}] }, "Replaced the interview steps (3 entries)"],
    ];
    for (const [change, line] of lines) expect(jobBriefChangeText(change)).toBe(line);
  });

  it("words a change with a value missing without leaving a dangling colon or arrow", () => {
    expect(jobBriefChangeText({ kind: "set", field: "location", to: "Example Town" })).toBe("Location: Example Town");
    expect(jobBriefChangeText({ kind: "set", field: "location", from: "", to: "Example Town" })).toBe("Location: Example Town");
    expect(jobBriefChangeText({ kind: "cleared", field: "location" })).toBe("Removed the location");
    expect(jobBriefChangeText({ kind: "replaced", field: "interview steps" })).toBe("Replaced the interview steps");
    expect(jobBriefChangeText({ kind: "moved", field: "must-have", item: "Python" })).toBe('Moved must-have "Python"');
    expect(jobBriefChangeText({ kind: "added", field: "document" })).toBe("Added document");
    expect(jobBriefChangeText({ kind: "removed", field: "document", item: null })).toBe("Removed document");
    expect(jobBriefChangeText({ kind: "reworded", field: "must-have", to: "Python 3" })).toBe('Reworded must-have: "Python 3"');
    expect(jobBriefChangeText({ kind: "reworded", field: "must-have" })).toBe("Reworded must-have");
    expect(jobBriefChangeText({ kind: "set", field: "location" })).toBe("Location");
  });

  it("reads a set to nothing from a value as that value cleared", () => {
    expect(jobBriefChangeText({ kind: "set", field: "location", from: "Example City" })).toBe(
      "Removed the location (was Example City)",
    );
    expect(jobBriefChangeText({ kind: "set", field: "location", from: "Example City", to: "  " })).toBe(
      "Removed the location (was Example City)",
    );
  });

  it("leads a set line with the field's title, or the field with a capital", () => {
    // A year is text: a number is grouped.
    expect(jobBriefChangeText({ kind: "set", field: "founding year", fieldTitle: "Founded", to: "2015" })).toBe("Founded: 2015");
    expect(jobBriefChangeText({ kind: "set", field: "founding year", fieldTitle: "Founded", to: 2015 })).toBe("Founded: 2,015");
    expect(jobBriefChangeText({ kind: "set", field: "minimum salary", to: 80000 })).toBe("Minimum salary: 80,000");
    expect(jobBriefChangeText({ kind: "set", field: "OTE", from: "120k", to: "150k" })).toBe("OTE: 120k → 150k");
  });

  it("groups numbers and counts lists", () => {
    expect(jobBriefChangeText({ kind: "set", field: "headcount", from: 1250, to: 12500.5 })).toBe("Headcount: 1,250 → 12,500.5");
    expect(jobBriefChangeText({ kind: "set", field: "headcount", to: Number.NaN })).toBe("Headcount");
    expect(jobBriefChangeText({ kind: "replaced", field: "buying personas", to: [{}] })).toBe("Replaced the buying personas (1 entry)");
    expect(jobBriefChangeText({ kind: "replaced", field: "buying personas", to: [] })).toBe("Replaced the buying personas (0 entries)");
    expect(jobBriefChangeText({ kind: "set", field: "ARR history", from: ["2023"], to: ["2023", "2024"] })).toBe(
      "ARR history: 1 entry → 2 entries",
    );
  });

  it("collapses whitespace and cuts a long value to 80 characters, never through a character", () => {
    expect(jobBriefChangeText({ kind: "added", field: "must-have", item: "  Example\n  tooling  " })).toBe(
      "Added must-have: Example tooling",
    );
    expect(jobBriefChangeText({ kind: "added", field: "must-have", item: "x".repeat(80) })).toBe(`Added must-have: ${"x".repeat(80)}`);
    expect(jobBriefChangeText({ kind: "added", field: "must-have", item: "x".repeat(90) })).toBe(`Added must-have: ${"x".repeat(77)}…`);
    // The cut drops trailing space before the ellipsis.
    expect(jobBriefChangeText({ kind: "added", field: "must-have", item: `${"x".repeat(76)} ${"y".repeat(10)}` })).toBe(
      `Added must-have: ${"x".repeat(76)}…`,
    );
    // An emoji is two UTF-16 units but one character: the cut counts characters.
    const cut = jobBriefChangeText({ kind: "added", field: "must-have", item: "😀".repeat(90) });
    expect(cut).toBe(`Added must-have: ${"😀".repeat(77)}…`);
    // Both values of a reworded entry are cut.
    expect(jobBriefChangeText({ kind: "reworded", field: "must-have", from: "a".repeat(81), to: "b".repeat(81) })).toBe(
      `Reworded must-have: "${"a".repeat(77)}…" → "${"b".repeat(77)}…"`,
    );
  });

  it("says only that a prose field was added, updated or removed", () => {
    expect(jobBriefChangeText({ kind: "set", field: "role description", to: "New words", prose: true })).toBe(
      "Added a role description",
    );
    expect(jobBriefChangeText({ kind: "set", field: "role description", from: "Old", to: "New", prose: true })).toBe(
      "Updated the role description",
    );
    expect(jobBriefChangeText({ kind: "cleared", field: "role description", from: "Old", prose: true })).toBe(
      "Removed the role description",
    );
    expect(jobBriefChangeText({ kind: "removed", field: "summary", prose: true })).toBe("Removed the summary");
    expect(jobBriefChangeText({ kind: "set", field: "overview", to: "New", prose: true })).toBe("Added an overview");
  });

  it("reads a kind it doesn't know as a new value", () => {
    const change = { kind: "renamed", field: "location", from: "Example City", to: "Example Town" } as unknown as JobBriefChange;
    expect(jobBriefChangeText(change)).toBe("Location: Example City → Example Town");
  });

  it("takes the host's words for any line", () => {
    const labels = {
      added: (field: string, item: string) => `${field} +${item}`,
      set: (title: string, from: string, to: string) => `${title} ${from}=>${to}`,
      entries: (count: number) => `${count} items`,
    };
    expect(jobBriefChangeText({ kind: "added", field: "must-have", item: "Python" }, labels)).toBe("must-have +Python");
    expect(jobBriefChangeText({ kind: "set", field: "steps", from: [1], to: [1, 2] }, labels)).toBe("Steps 1 items=>2 items");
    expect(jobBriefChangeText({ kind: "removed", field: "must-have", item: "Python" }, labels)).toBe("Removed must-have: Python");
  });
});

describe("jobBriefChangeLabels", () => {
  it("words the fold and the group, and can't be changed by a host", () => {
    expect(jobBriefChangeLabels.more(1)).toBe("1 more change");
    expect(jobBriefChangeLabels.more(4)).toBe("4 more changes");
    expect(jobBriefChangeLabels.groupName(3)).toBe("What changed in v3");
    expect(jobBriefChangeLabels.groupName()).toBe("What changed");
    expect(jobBriefChangeLabels.groupName(0)).toBe("What changed");
    expect(Object.isFrozen(jobBriefChangeLabels)).toBe(true);
  });
});
