// src/recruit/job-brief-view.ts
var jobBriefLabels = Object.freeze({
  title: "Job brief",
  mustHaves: "Must-haves",
  niceToHaves: "Nice-to-haves",
  redFlags: "Red flags",
  mustHaveItem: "must-have",
  niceToHaveItem: "nice-to-have",
  redFlagItem: "red flag",
  location: "Location",
  salary: "Salary",
  salaryFrom: (amount) => `From ${amount}`,
  salaryUpTo: (amount) => `Up to ${amount}`,
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
    influencer: "influencer"
  }),
  interviewProcess: "Interview process",
  interviewStep: (number) => `Step ${number}`,
  interviewWith: (step, interviewer) => `${step} with ${interviewer}`,
  company: "Company",
  website: "Website",
  founded: "Founded",
  headcount: "Headcount",
  hq: "HQ",
  arr: "ARR",
  team: "Team"
});
var LOCALE = "en-GB";
var plain = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
var ROLE_DETAILS = ["quota", "equity", "avgDealSize", "biggestDeal", "salesCycle", "motion"];
var MAX_TITLE_LENGTH = 72;
var ABSENT_VALUE = /^(?:n\/?a|none|null|nil|unknown|tbd|tbc|not (?:specified|provided|stated|known)|unspecified|confidential|undisclosed|untitled|role|job|position|title|various|multiple(?: roles)?|-+)$/i;
function text(value) {
  return typeof value === "string" ? value.trim() || void 0 : void 0;
}
function finite(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function truncate(value, max) {
  const clean = value.trim();
  return clean.length > max ? `${clean.slice(0, max - 3).trimEnd()}\u2026` : clean;
}
function titleText(value, max) {
  if (typeof value !== "string") return void 0;
  const clean = value.replace(/\s+/g, " ").replace(/^[\s"'“”‘’`*#]+|[\s"'“”‘’`*]+$/g, "").trim();
  return clean && !ABSENT_VALUE.test(clean) ? truncate(clean, max) : void 0;
}
function capitalise(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
function amountFormat(currency) {
  const code = text(currency);
  if (!code) return (value) => plain.format(value);
  try {
    const money = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return (value) => money.format(value);
  } catch {
    return (value) => /\p{L}$/u.test(code) ? `${code} ${plain.format(value)}` : `${code}${plain.format(value)}`;
  }
}
function fact(id, label, value) {
  return value ? [{ id, label, value }] : [];
}
function jobBriefTitle(content, fallback = jobBriefLabels.title) {
  const role = titleText(content.roleTitle, 240);
  if (!role) return fallback;
  const company = titleText(content.companyName, 120);
  if (company && !role.toLowerCase().includes(company.toLowerCase())) {
    const combined = `${role} \xB7 ${company}`;
    if (combined.length <= MAX_TITLE_LENGTH) return combined;
  }
  return truncate(role, MAX_TITLE_LENGTH);
}
function formatJobBriefSalary(content, labels = {}) {
  const min = finite(content.salaryMin);
  const max = finite(content.salaryMax);
  const amount = amountFormat(content.currency);
  if (min !== void 0 && max !== void 0) {
    return min === max ? amount(min) : `${amount(Math.min(min, max))}\u2013${amount(Math.max(min, max))}`;
  }
  if (min !== void 0) return (labels.salaryFrom ?? jobBriefLabels.salaryFrom)(amount(min));
  if (max !== void 0) return (labels.salaryUpTo ?? jobBriefLabels.salaryUpTo)(amount(max));
  return null;
}
function persona({ role, category, notes }, categories) {
  const who = text(role);
  const key = text(category);
  const kind = key ? Object.hasOwn(categories, key) ? categories[key] : key.replace(/_/g, " ") : void 0;
  const name = who ? kind ? `${who} (${kind})` : who : kind ? capitalise(kind) : "";
  return [name, text(notes)].filter(Boolean).join(" \u2014 ");
}
function interviewSteps(steps, named, labels) {
  return steps.map((step, index) => ({ step, index })).sort(
    (left, right) => (finite(left.step.stepNumber) ?? left.index + 1) - (finite(right.step.stepNumber) ?? right.index + 1) || left.index - right.index
  ).map(({ step }, index) => {
    const label = text(step.label);
    const format = text(step.expectedFormat);
    const interviewer = text(step.interviewerName);
    const name = label ?? format ?? labels.interviewStep(finite(step.stepNumber) ?? index + 1);
    const run = named && interviewer ? labels.interviewWith(name, interviewer) : name;
    return label && format ? `${run} \xB7 ${format}` : run;
  });
}
function companyFacts(content, labels) {
  const company = content.companyOverview ?? {};
  const founded = finite(company.founded);
  const headcount = finite(company.headcount);
  const arr = [...company.arr ?? []].filter(({ year, value }) => finite(year) !== void 0 && text(value)).sort((left, right) => left.year - right.year).map(({ year, value }) => `${year}: ${text(value)}`);
  const team = (company.teamDistribution ?? []).filter(({ region, count }) => text(region) && finite(count) !== void 0).map(({ region, count }) => `${text(region)} ${plain.format(count)}`);
  return [
    ...fact("website", labels.website, text(content.companyWebsite)),
    ...fact("founded", labels.founded, founded === void 0 ? null : String(founded)),
    ...fact("headcount", labels.headcount, headcount === void 0 ? null : plain.format(headcount)),
    ...fact("hq", labels.hq, text(company.hq)),
    ...fact("arr", labels.arr, arr.join(" \xB7 ")),
    ...fact("team", labels.team, team.join(" \xB7 "))
  ];
}
var ALL_RULES = ["mustHaves", "niceToHaves", "redFlags"];
var PUBLIC_RULES = ["mustHaves", "niceToHaves"];
function jobBriefView(content, options = {}) {
  const { current = true, title = "role", audience, extraSections = [] } = options;
  const labels = {
    ...jobBriefLabels,
    ...options.labels,
    personaCategories: { ...jobBriefLabels.personaCategories, ...options.labels?.personaCategories }
  };
  const internal = audience !== "public";
  const details = content.roleDetails ?? {};
  const sections = [
    {
      id: "role-details",
      title: labels.roleDetails,
      facts: internal ? ROLE_DETAILS.flatMap((key) => fact(key, labels[key], text(details[key]))) : []
    },
    { id: "target-company-types", title: labels.targetCompanyTypes, items: [...content.icp ?? []] },
    {
      id: "buying-personas",
      title: labels.buyingPersonas,
      items: (content.buyingPersonas ?? []).map((entry) => persona(entry, labels.personaCategories)).filter(Boolean)
    },
    {
      id: "interview-process",
      title: labels.interviewProcess,
      ordered: true,
      items: interviewSteps(content.interviewSteps ?? [], internal, labels)
    },
    { id: "company", title: labels.company, facts: internal ? companyFacts(content, labels) : [] },
    ...extraSections
  ];
  return {
    title: title === "generic" ? labels.title : jobBriefTitle(content, labels.title),
    description: text(content.roleDescription) ?? text(content.summary),
    facts: [
      ...fact("location", labels.location, text(content.location)),
      ...fact("salary", labels.salary, formatJobBriefSalary(content, labels)),
      ...internal ? fact("ote", labels.ote, text(details.ote)) : []
    ],
    mustHaves: [...content.mustHaves ?? []],
    niceToHaves: [...content.niceToHaves ?? []],
    redFlags: internal ? [...content.redFlags ?? []] : [],
    rules: [...internal ? ALL_RULES : PUBLIC_RULES],
    sections: sections.filter((section) => (section.facts?.length ?? 0) + (section.items?.length ?? 0) > 0),
    previewCount: current ? 3 : 0,
    ruleLabels: {
      mustHaves: labels.mustHaves,
      niceToHaves: labels.niceToHaves,
      redFlags: labels.redFlags,
      mustHaveItem: labels.mustHaveItem,
      niceToHaveItem: labels.niceToHaveItem,
      redFlagItem: labels.redFlagItem
    }
  };
}

export {
  jobBriefLabels,
  jobBriefTitle,
  formatJobBriefSalary,
  jobBriefView
};
