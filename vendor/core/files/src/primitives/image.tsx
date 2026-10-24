"use client";

import { forwardRef, useEffect, useState, type ImgHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fit?: "cover" | "contain";
  /** Fixed media-frame height. Use when an image must reserve a stable layout slot. */
  frameHeight?: "sm" | "md";
  radius?: "none" | "sm" | "md" | "xl" | "full";
  width?: "auto" | "full" | "preview" | "preview-lg";
  align?: "start" | "center";
  border?: boolean;
  shadow?: "none" | "subtle";
  /** Soften supporting media until its parent interactive surface is hovered. Desktop only. */
  emphasis?: "full" | "soft-until-parent-hover";
  /** Show a subtle reserved-frame pulse while a remote image is loading. */
  loadingIndicator?: "none" | "pulse";
}

const fitStyles = { cover: "object-cover", contain: "object-contain" } as const;
const radiusStyles = { none: "", sm: "rounded-sm", md: "rounded-md", xl: "rounded-xl", full: "rounded-full" } as const;

/** Design-system image with controlled fit and radius behavior. */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { fit = "cover", frameHeight, radius = "none", width = "auto", align = "start", border = false, shadow = "none", emphasis = "full", loadingIndicator = "none", className, onLoad, onError, src, ...props },
  ref,
) {
  const [loaded, setLoaded] = useState(loadingIndicator === "none" || !src);

  useEffect(() => {
    setLoaded(loadingIndicator === "none" || !src);
  }, [loadingIndicator, src]);

  const loading = loadingIndicator === "pulse" && !loaded;

  return <img ref={ref} className={cn(
    fitStyles[fit], radiusStyles[radius],
    frameHeight === "sm" && "h-16",
    frameHeight === "md" && "h-28",
    width === "full" && "w-full",
    width === "preview" && "w-full max-w-[380px]",
    width === "preview-lg" && "w-full max-w-[440px]",
    align === "center" && "mx-auto",
    border && "border",
    shadow === "subtle" && "shadow-xs",
    loading && "animate-pulse bg-muted",
    emphasis === "soft-until-parent-hover" && "transition-opacity duration-200 md:opacity-70 md:group-hover:opacity-100",
    className,
  )} src={src} {...props}
    aria-busy={loading || undefined}
    onLoad={(event) => {
      setLoaded(true);
      onLoad?.(event);
    }}
    onError={(event) => {
      setLoaded(true);
      onError?.(event);
    }}
  />;
});
