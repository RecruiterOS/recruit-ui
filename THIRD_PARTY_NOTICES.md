# Third-party notices

Recruit UI imports third-party runtime packages. Those projects retain their
own copyright and license terms.

## External runtime dependencies

The package build keeps the following imports external: the package takes
them as peer dependencies, and the source registry declares them as package
dependencies. Their implementations are not vendored into Recruit UI. Each installed package distribution supplies its
own license text.

| Package | License | Attribution recorded by the package distribution |
| --- | --- | --- |
| `@epicbagel/saas-kit` | MIT | Copyright (c) 2026 epicbagel |
| `lucide-react` | ISC | Feather portions: Cole Bemis, 2013-2022; other portions: Lucide Contributors, 2022 |

`@epicbagel/saas-kit` supplies the UI primitives (layout, typography, buttons,
badges, dialogs and drawers) that the workflow components compose. Parts of it
are adapted from shadcn/ui (MIT); its own `THIRD_PARTY_NOTICES.md` reproduces
those notices and lists the runtime packages it depends on, such as Radix UI.
