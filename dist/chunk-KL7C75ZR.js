// src/recruit/candidate-cover-header.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { AspectRatio } from "@epicbagel/saas-kit/primitives/aspect-ratio";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateCoverImage({
  children,
  size = "default",
  softenUntilHover = false,
  className,
  ...props
}) {
  if (children == null) return null;
  const frameProps = {
    "data-slot": "candidate-cover-image",
    className: cn(
      "w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-center",
      size === "compact" && "relative aspect-[4/1] max-h-[96px]",
      softenUntilHover && "[&_img]:opacity-75 [&_img]:grayscale-[0.2] group-hover:[&_img]:opacity-100 group-hover:[&_img]:grayscale-0",
      className
    ),
    ...props
  };
  return size === "compact" ? /* @__PURE__ */ jsx("div", { ...frameProps, children }) : /* @__PURE__ */ jsx(AspectRatio, { ratio: 4, ...frameProps, children });
}
var DIALOG_PADDING = "p-4";
function CandidateCoverHeader({
  cover,
  coverSize = "default",
  children,
  padding = "card-header",
  softenCoverUntilHover = false,
  className,
  ...props
}) {
  const clip = cover != null || padding !== "none";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "candidate-cover-header",
      className: cn(clip && "overflow-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(CandidateCoverImage, { size: coverSize, softenUntilHover: softenCoverUntilHover, children: cover }),
        /* @__PURE__ */ jsx(
          PanelSection,
          {
            as: "div",
            padding: padding === "none" || padding === "dialog" ? "none" : padding === "compact" ? "compact" : "default",
            className: cn(padding === "card-header" && "pb-3 pt-5", padding === "dialog" && DIALOG_PADDING),
            children
          }
        )
      ]
    }
  );
}

export {
  CandidateCoverImage,
  CandidateCoverHeader
};
