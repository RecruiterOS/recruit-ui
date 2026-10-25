// src/recruit/current-company-label.tsx
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CurrentCompanyLabel({
  company,
  tenure,
  suffix,
  size = "sm",
  tone = "muted",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Text,
    {
      as: "span",
      "data-slot": "current-company-label",
      variant: "inherit",
      size,
      tone,
      ...props,
      children: [
        company,
        tenure != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: " \xB7 " }),
          tenure
        ] }) : null,
        suffix
      ]
    }
  );
}

export {
  CurrentCompanyLabel
};
