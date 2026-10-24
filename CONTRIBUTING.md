# Contributing

Recruit UI is presentation-only. New components must accept display values, slots, and callbacks rather than application records or service clients.

Before opening a change:

1. Keep data access, authentication, routing, scoring, status mapping, and persistence outside the package.
2. Use semantic theme classes and accessible HTML.
3. Add focused behavior and accessibility tests.
4. Add registry metadata when a new public entry point is introduced.
5. Use only explicitly fictional test content. Never paste production data, private links, screenshots, environment files, or credentials.
6. Run `pnpm verify`.

Files in `dist/` are generated. Workflow registry files point directly at the canonical source in `src/`. `vendor/core/` is a checksum-verified import from the allowlisted core exporter; never patch it directly. Maintainers refresh it with `pnpm import:core --source <core-checkout> --script <export-script>` and must review the complete generated diff before accepting it.

The root `registry.json` is the GitHub source manifest. Keep same-repository dependencies fully qualified (`RecruiterOS/recruit-ui/<item>`) and run both `pnpm validate:registry` and `pnpm validate:shadcn` after changing registry inputs.
