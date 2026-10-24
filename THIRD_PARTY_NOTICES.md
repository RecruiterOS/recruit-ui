# Third-party notices

Recruit UI includes source adapted from third-party projects and imports
third-party runtime packages. Those projects retain their own copyright and
license terms.

## shadcn/ui-derived source

The generated core primitives in `vendor/core/` are contributed by their
copyright holder under the Apache License, Version 2.0, and will be replaced
by the public `@epicbagel/saas-kit` package. Provenance review and source
comparison identify shadcn/ui-derived portions in these generated files:

- `vendor/core/files/src/lib/utils.ts` (`cn` helper)
- `vendor/core/files/src/primitives/aspect-ratio.tsx`
- `vendor/core/files/src/primitives/avatar.tsx`
- `vendor/core/files/src/primitives/badge.tsx`
- `vendor/core/files/src/primitives/button.tsx`
- `vendor/core/files/src/primitives/dialog.tsx`
- `vendor/core/files/src/primitives/drawer.tsx`
- `vendor/core/files/src/primitives/input.tsx`
- `vendor/core/files/src/primitives/separator.tsx`
- `vendor/core/files/src/primitives/skeleton.tsx`

shadcn/ui is licensed under the following terms:

```text
MIT License

Copyright (c) 2023 shadcn

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

## External runtime dependencies

The package build keeps the following imports external, and the source
registry declares them as package dependencies. Their implementations are not
vendored into Recruit UI. Each installed package distribution supplies its
own license text.

| Package | License | Attribution recorded by the package distribution |
| --- | --- | --- |
| `@radix-ui/react-*` | MIT | Copyright (c) 2022 WorkOS |
| `class-variance-authority` | Apache-2.0 | Joe Bell |
| `clsx` | MIT | Luke Edwards |
| `lucide-react` | ISC | Feather portions: Cole Bemis, 2013-2022; other portions: Lucide Contributors, 2022 |
| `react-responsive` | MIT | Copyright (c) 2024 Contra |
| `tailwind-merge` | MIT | Copyright (c) 2021 Dany Castillo |
| `vaul` | MIT | Copyright (c) 2023 Emil Kowalski |
