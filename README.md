# Recruit UI

Recruit UI is an open-source shadcn registry containing production-quality recruitment workflows—not merely buttons and cards. It also ships the same components as an installable React package, without owning application data, scoring, authentication, integrations, or persistence.

## Two delivery modes, one implementation

The installable package and shadcn registry are generated from the same workflow files in `src/` and the same checksum-verified core artifact in `vendor/core/`.

- Package consumers currently pin `@recruiteros/recruit-ui` to an immutable GitHub commit and import from the root, `core`, or direct `recruit` subpaths. The generated core is bundled; no private registry access is required.
- Registry consumers install source under `components/recruit-ui`. The `recruit-core` item supplies support primitives and `recruit-workflows` supplies the candidate workflows.

`vendor/core/` is produced by an explicit allowlist exporter and guarded by `SHA256SUMS`; do not edit it. Workflow registry entries point directly at the canonical files in `src/`; their install-ready core alias is resolved to `vendor/core/` for package builds and to the installed core item for registry consumers. Static payloads in `dist/registry` are optional build artifacts. None is a separately maintained implementation.

## Package setup

```bash
pnpm add github:RecruiterOS/recruit-ui#FULL_COMMIT_SHA react react-dom
```

Use the full commit SHA from the first public release; do not depend on a moving branch. A protected, immutable release tag may be used after one exists. The package is not published to npm; install it from GitHub as shown above.

The components use semantic Tailwind classes compatible with a standard shadcn theme. Tailwind v4 package consumers should add the built package to their stylesheet scan:

```css
@source "../node_modules/@recruiteros/recruit-ui/dist";
```

```tsx
import {
  CandidateAssessment,
  CandidateDecisionBar,
  CandidateProfile,
} from "@recruiteros/recruit-ui/recruit";
```

The root and `recruit` barrels are explicit client entry points. The build
also preserves each interactive component subpath as its own client boundary,
and fails if any generated ESM or CommonJS entry loses the `"use client"`
directive prologue.

Public workflow exports include:

- review and compact surfaces: `CandidateReviewCard`, `CandidateInlineCard`, `CandidateCoverHeader`, `CandidateCoverImage`, and `CandidateQuote`;
- profile composition: `CandidateProfile`, `CandidateProfileHeader`, `CandidateProfileBody`, `CandidateProfileFooter`, and `CandidateProfileDialog`;
- review details: `CandidateCareerHistoryTimeline`, `CareerDateRange`, `CurrentCompanyLabel`, and presentation-only candidate grade helpers/badge (host applications supply grade labels and tones);
- decisions and delivery: `CandidateAssessment`, `CandidateDecisionBar`, and `CandidateDestinationStatus`.

All candidate identity, media, assessment, actions, and destination values enter through explicit display slots and callbacks. `CareerHistoryItem.dateRange` accepts host-formatted date text; raw dates are formatted as absolute calendar dates when that slot is omitted.

## Registry setup

This repository is a native GitHub source registry. Install both namespaces with the official CLI:

```bash
pnpm dlx shadcn@latest add RecruiterOS/recruit-ui/recruit-core
pnpm dlx shadcn@latest add RecruiterOS/recruit-ui/recruit-workflows
```

Installing `recruit-workflows` also resolves `RecruiterOS/recruit-ui/recruit-core`. The root `registry.json` points only to files committed in this repository:

- `recruit-core` reads the generated, allowlisted artifact under `vendor/core`
  and installs its license and third-party notices alongside the source;
- `recruit-workflows` reads the canonical workflow files under `src/` directly.

Every registry item installs into an isolated `components/recruit-ui` directory. It does not replace an application's existing shadcn primitives.
The core item includes `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`, so
the applicable terms travel with registry-installed source.

## Boundary

Recruit UI accepts display values, React nodes, and callbacks. The host application owns:

- data fetching, caching, authentication, and authorization;
- record identifiers, links, media resolution, and navigation;
- score calculation, grade assignment, and decision policy;
- workflow states, status mapping, and persistence;
- product wording, brand assets, and analytics.

Do not add application records, customer material, screenshots, production payloads, private endpoints, or environment configuration to this repository. Public examples and tests use explicitly fictional labels only.

## License and provenance

RecruiterOS-authored portions are licensed under the Apache License, Version
2.0. `vendor/core/` holds generated core primitives contributed by their
copyright holder under the Apache License, Version 2.0; it will be replaced by
the public `@epicbagel/saas-kit` package. Identified shadcn/ui-derived portions
remain subject to the shadcn/ui MIT license. Runtime dependencies are external
and retain their own licenses. See `LICENSE`, `NOTICE`, and
`THIRD_PARTY_NOTICES.md` for details.

## Development

```bash
pnpm install --frozen-lockfile
pnpm verify
```

Focused commands:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm check:dist
pnpm validate:registry
pnpm validate:shadcn
pnpm check:registry
pnpm check:public
```

Maintainers with access to the core source can refresh the allowlisted artifact with `pnpm import:core --source <core-checkout> --script <export-script>`, review the diff and checksums, then run `pnpm verify`. Git dependencies consume committed, verified ESM, CommonJS, and declaration artifacts without running install-time build scripts. `pnpm check:dist` rebuilds those artifacts and fails if they differ from the committed distribution. Package builds resolve the install-facing registry alias explicitly, rather than depending on a consumer's package-manager or TypeScript path-discovery behavior.

See `CONTRIBUTING.md` for the public-source workflow and `SECURITY.md` for private vulnerability reporting.
