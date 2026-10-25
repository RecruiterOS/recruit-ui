import {
  COARSE_POINTER_TOUCH_TARGET
} from "./chunk-YKEE5RQG.js";

// src/recruit/candidate-channel-actions.tsx
import { Anchor } from "@epicbagel/saas-kit/primitives/anchor";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { jsx, jsxs } from "react/jsx-runtime";
var isWebLink = (href) => /^https?:\/\//i.test(href);
var BAR_LABEL_VISIBILITY = "hidden @min-[4.5rem]:inline";
function CandidateChannelActions({
  channels,
  presentation = "icons",
  size = "default",
  label = "Contact",
  ...props
}) {
  if (channels.length === 0) return null;
  const bar = presentation === "bar";
  return /* @__PURE__ */ jsx(
    Stack,
    {
      "data-slot": "candidate-channel-actions",
      "data-presentation": presentation,
      role: "group",
      "aria-label": label,
      direction: "horizontal",
      gap: bar ? "sm" : "xs",
      align: "center",
      justify: bar ? "center" : "start",
      width: bar ? "full" : "auto",
      ...props,
      children: channels.map((channel, index) => {
        const key = `${index}:${channel.kind}`;
        const external = channel.external ?? isWebLink(channel.href);
        const link = /* @__PURE__ */ jsxs(
          Anchor,
          {
            href: channel.href,
            "data-channel": channel.kind,
            title: channel.label,
            "aria-label": channel.label,
            ...external ? { target: "_blank", rel: "noopener noreferrer" } : {},
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(Icon, { icon: channel.icon, size: "md" }),
              bar ? /* @__PURE__ */ jsx(
                Text,
                {
                  variant: "inherit",
                  as: "span",
                  truncate: true,
                  minWidth: "zero",
                  className: BAR_LABEL_VISIBILITY,
                  children: channel.label
                }
              ) : null
            ]
          }
        );
        return bar ? (
          // A size container, so its label can query the link's own width;
          // that also makes the links share the row equally.
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              size: "sm",
              grow: true,
              minWidth: "zero",
              className: `@container ${COARSE_POINTER_TOUCH_TARGET}`,
              children: link
            },
            key
          )
        ) : /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            shape: "circle",
            size: size === "compact" ? "icon-compact" : "icon-sm",
            shrink: true,
            className: COARSE_POINTER_TOUCH_TARGET,
            children: link
          },
          key
        );
      })
    }
  );
}

export {
  CandidateChannelActions
};
