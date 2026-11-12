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

## Adapted source

`src/recruit/chain-of-thought.tsx`, the timeline `SourcingTrace` draws, is
adapted from [Prompt Kit](https://github.com/ibelick/prompt-kit)'s
ChainOfThought, commit `5a9496635cc0e1bf7679fe2a9e35d9b36b99c08a`. The
vertical timeline, per-step collapsible, trigger and content composition come
from that source. The adaptations: it uses the kit's Collapsible; steps keep
their supplied keys, so an update that inserts or reorders steps keeps what
the reader opened; a trigger takes a `status` (a running shimmer, a dimmed
pending state, an error colour) and a short `description`; a step with no
detail is a static row with no toggle; and titles wrap, with visible keyboard
focus and 44px targets on coarse pointers. It is not exported from the
package.

```
MIT License

Copyright (c) 2025 Julien Thibeaut

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
