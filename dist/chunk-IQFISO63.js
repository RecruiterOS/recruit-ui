// src/recruit/candidate-cover-header.tsx
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { AspectRatio } from "@epicbagel/saas-kit/primitives/aspect-ratio";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { jsx, jsxs } from "react/jsx-runtime";
function CandidateCoverImage({
  children,
  softenUntilHover = false,
  className,
  ...props
}) {
  if (children == null) return null;
  return /* @__PURE__ */ jsx(
    AspectRatio,
    {
      ratio: 4,
      "data-slot": "candidate-cover-image",
      className: cn(
        "w-full overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
        softenUntilHover && "[&_img]:opacity-75 [&_img]:grayscale-[0.2] group-hover:[&_img]:opacity-100 group-hover:[&_img]:grayscale-0",
        className
      ),
      ...props,
      children
    }
  );
}
function CandidateCoverHeader({
  cover,
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
        /* @__PURE__ */ jsx(CandidateCoverImage, { softenUntilHover: softenCoverUntilHover, children: cover }),
        /* @__PURE__ */ jsx(
          PanelSection,
          {
            as: "div",
            padding: padding === "none" ? "none" : padding === "compact" ? "compact" : "default",
            className: cn(padding === "card-header" && "pb-3 pt-5"),
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
