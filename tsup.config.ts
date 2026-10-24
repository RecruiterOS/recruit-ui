import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const coreSourceRoot = fileURLToPath(
  new URL("./vendor/core/files/src", import.meta.url),
);

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/core/index.ts",
    "src/core/calendar-date.ts",
    "src/recruit/index.ts",
    "src/recruit/candidate-assessment.tsx",
    "src/recruit/candidate-career-history-timeline.tsx",
    "src/recruit/candidate-cover-header.tsx",
    "src/recruit/candidate-decision-bar.tsx",
    "src/recruit/candidate-destination-status.tsx",
    "src/recruit/candidate-grade.tsx",
    "src/recruit/candidate-inline-card.tsx",
    "src/recruit/candidate-profile.tsx",
    "src/recruit/candidate-profile-dialog.tsx",
    "src/recruit/candidate-quote.tsx",
    "src/recruit/candidate-review-card.tsx",
    "src/recruit/current-company-label.tsx"
  ],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      baseUrl: ".",
      paths: {
        "@/components/recruit-ui/core/*": [`${coreSourceRoot}/*`],
      },
    },
  },
  splitting: true,
  clean: true,
  sourcemap: false,
  target: "es2022",
  esbuildOptions(options) {
    options.alias = {
      ...options.alias,
      "@/components/recruit-ui/core": coreSourceRoot,
    };
  },
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    /^@radix-ui\//,
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "react-responsive",
    "tailwind-merge",
    "vaul"
  ]
});
