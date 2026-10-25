// src/recruit/job-client-badge.tsx
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx } from "react/jsx-runtime";
function JobClientBadge({ name, title, ...props }) {
  return /* @__PURE__ */ jsx(
    Badge,
    {
      as: "span",
      variant: "secondary",
      title: title ?? (typeof name === "string" ? name : void 0),
      ...props,
      children: /* @__PURE__ */ jsx(Text, { as: "span", variant: "inherit", truncate: true, minWidth: "zero", children: name })
    }
  );
}

export {
  JobClientBadge
};
