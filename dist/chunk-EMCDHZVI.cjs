"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/recruit/job-brief-view.ts
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
  } catch (e) {
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
  if (min !== void 0) return (_nullishCoalesce(labels.salaryFrom, () => ( jobBriefLabels.salaryFrom)))(amount(min));
  if (max !== void 0) return (_nullishCoalesce(labels.salaryUpTo, () => ( jobBriefLabels.salaryUpTo)))(amount(max));
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
    (left, right) => (_nullishCoalesce(finite(left.step.stepNumber), () => ( left.index + 1))) - (_nullishCoalesce(finite(right.step.stepNumber), () => ( right.index + 1))) || left.index - right.index
  ).map(({ step }, index) => {
    const label = text(step.label);
    const format = text(step.expectedFormat);
    const interviewer = text(step.interviewerName);
    const name = _nullishCoalesce(_nullishCoalesce(label, () => ( format)), () => ( labels.interviewStep(_nullishCoalesce(finite(step.stepNumber), () => ( index + 1)))));
    const run = named && interviewer ? labels.interviewWith(name, interviewer) : name;
    return label && format ? `${run} \xB7 ${format}` : run;
  });
}
function companyFacts(content, labels) {
  const company = _nullishCoalesce(content.companyOverview, () => ( {}));
  const founded = finite(company.founded);
  const headcount = finite(company.headcount);
  const arr = [..._nullishCoalesce(company.arr, () => ( []))].filter(({ year, value }) => finite(year) !== void 0 && text(value)).sort((left, right) => left.year - right.year).map(({ year, value }) => `${year}: ${text(value)}`);
  const team = (_nullishCoalesce(company.teamDistribution, () => ( []))).filter(({ region, count }) => text(region) && finite(count) !== void 0).map(({ region, count }) => `${text(region)} ${plain.format(count)}`);
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
    personaCategories: { ...jobBriefLabels.personaCategories, ..._optionalChain([options, 'access', _ => _.labels, 'optionalAccess', _2 => _2.personaCategories]) }
  };
  const internal = audience !== "public";
  const details = _nullishCoalesce(content.roleDetails, () => ( {}));
  const sections = [
    {
      id: "role-details",
      title: labels.roleDetails,
      facts: internal ? ROLE_DETAILS.flatMap((key) => fact(key, labels[key], text(details[key]))) : []
    },
    { id: "target-company-types", title: labels.targetCompanyTypes, items: [..._nullishCoalesce(content.icp, () => ( []))] },
    {
      id: "buying-personas",
      title: labels.buyingPersonas,
      items: (_nullishCoalesce(content.buyingPersonas, () => ( []))).map((entry) => persona(entry, labels.personaCategories)).filter(Boolean)
    },
    {
      id: "interview-process",
      title: labels.interviewProcess,
      ordered: true,
      items: interviewSteps(_nullishCoalesce(content.interviewSteps, () => ( [])), internal, labels)
    },
    { id: "company", title: labels.company, facts: internal ? companyFacts(content, labels) : [] },
    ...extraSections
  ];
  return {
    title: title === "generic" ? labels.title : jobBriefTitle(content, labels.title),
    description: _nullishCoalesce(text(content.roleDescription), () => ( text(content.summary))),
    facts: [
      ...fact("location", labels.location, text(content.location)),
      ...fact("salary", labels.salary, formatJobBriefSalary(content, labels)),
      ...internal ? fact("ote", labels.ote, text(details.ote)) : []
    ],
    mustHaves: [..._nullishCoalesce(content.mustHaves, () => ( []))],
    niceToHaves: [..._nullishCoalesce(content.niceToHaves, () => ( []))],
    redFlags: internal ? [..._nullishCoalesce(content.redFlags, () => ( []))] : [],
    rules: [...internal ? ALL_RULES : PUBLIC_RULES],
    sections: sections.filter((section) => (_nullishCoalesce(_optionalChain([section, 'access', _3 => _3.facts, 'optionalAccess', _4 => _4.length]), () => ( 0))) + (_nullishCoalesce(_optionalChain([section, 'access', _5 => _5.items, 'optionalAccess', _6 => _6.length]), () => ( 0))) > 0),
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
var jobBriefVersionLabels = Object.freeze({
  number: (number) => `v${number}`,
  current: "Current",
  earlier: "Earlier",
  separator: " \xB7 "
});
function jobBriefVersionLabel(version, labels = {}) {
  const own = text(version.label);
  if (own) return own;
  const words = { ...jobBriefVersionLabels, ...labels };
  const number = validVersion(version.number) ? words.number(version.number) : "";
  const mark = version.current ? words.current : words.earlier;
  return [number, mark].filter(Boolean).join(words.separator);
}
function validVersion(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}
var jobBriefChangeLabels = Object.freeze({
  added: (field, item) => item ? `Added ${field}: ${item}` : `Added ${field}`,
  removed: (field, item) => item ? `Removed ${field}: ${item}` : `Removed ${field}`,
  reworded: (field, from, to) => from && to ? `Reworded ${field}: "${from}" \u2192 "${to}"` : to ? `Reworded ${field}: "${to}"` : `Reworded ${field}`,
  moved: (field, item, position) => {
    const moved = item ? `Moved ${field} "${item}"` : `Moved ${field}`;
    return position ? `${moved} to position ${position}` : moved;
  },
  set: (fieldTitle, from, to) => from && to ? `${fieldTitle}: ${from} \u2192 ${to}` : to ? `${fieldTitle}: ${to}` : fieldTitle,
  cleared: (field, from) => from ? `Removed the ${field} (was ${from})` : `Removed the ${field}`,
  replaced: (field, to) => to ? `Replaced the ${field} (${to})` : `Replaced the ${field}`,
  proseAdded: (field) => `Added ${/^[aeiou]/i.test(field) ? "an" : "a"} ${field}`,
  proseUpdated: (field) => `Updated the ${field}`,
  proseCleared: (field) => `Removed the ${field}`,
  entries: (count) => `${plain.format(count)} ${count === 1 ? "entry" : "entries"}`,
  more: (count) => `${plain.format(count)} more ${count === 1 ? "change" : "changes"}`,
  groupName: (version) => validVersion(version) ? `What changed in ${jobBriefVersionLabels.number(version)}` : "What changed"
});
var MAX_CHANGE_VALUE_LENGTH = 80;
var grouped = new Intl.NumberFormat(LOCALE);
function changeValue(value, labels) {
  if (typeof value === "string") {
    const characters = Array.from(value.replace(/\s+/g, " ").trim());
    return characters.length > MAX_CHANGE_VALUE_LENGTH ? `${characters.slice(0, MAX_CHANGE_VALUE_LENGTH - 3).join("").trimEnd()}\u2026` : characters.join("");
  }
  if (typeof value === "number") return Number.isFinite(value) ? grouped.format(value) : "";
  if (Array.isArray(value)) return labels.entries(value.length);
  return "";
}
function jobBriefChangeText(change, labels = {}) {
  const words = { ...jobBriefChangeLabels, ...labels };
  const field = _nullishCoalesce(text(change.field), () => ( ""));
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
      if (!to && from) return words.cleared(field, from);
      return words.set(_nullishCoalesce(text(change.fieldTitle), () => ( capitalise(field))), from, to);
  }
}










exports.jobBriefLabels = jobBriefLabels; exports.jobBriefTitle = jobBriefTitle; exports.formatJobBriefSalary = formatJobBriefSalary; exports.jobBriefView = jobBriefView; exports.jobBriefVersionLabels = jobBriefVersionLabels; exports.jobBriefVersionLabel = jobBriefVersionLabel; exports.jobBriefChangeLabels = jobBriefChangeLabels; exports.jobBriefChangeText = jobBriefChangeText;
