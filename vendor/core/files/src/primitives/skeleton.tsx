"use client";

import { cn } from "../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: "blank" | "line" | "line-short" | "line-full" | "line-wide" | "title" | "title-full" | "heading" | "heading-wide" | "bar" | "control-sm" | "control" | "row-compact" | "row" | "row-lg" | "panel" | "panel-lg" | "article" | "card-sm" | "card-md";
  radius?: "md" | "xl";
  width?: "preset" | "full" | "three-quarter" | "two-third" | "half" | "two-fifth" | "one-third" | "three-fifth" | "four-fifth" | "sm" | "md";
  height?: "preset" | "dot" | "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "rounded" | "circle";
  centered?: boolean;
  shrink?: boolean;
  marginTop?: "none" | "xs";
}

const presets = {
  blank: "",
  line: "h-4 w-1/3",
  "line-short": "h-4 w-32",
  "line-full": "h-4 w-full",
  "line-wide": "h-4 w-2/3",
  title: "h-9 w-2/3",
  "title-full": "h-9 w-full",
  heading: "h-8 w-48",
  "heading-wide": "h-8 w-64",
  bar: "h-6 w-full",
  "control-sm": "h-10 w-full",
  control: "h-12 w-full",
  "row-compact": "h-12 w-full",
  row: "h-16 w-full",
  "row-lg": "h-20 w-full",
  panel: "h-32 w-full",
  "panel-lg": "h-40 w-full",
  article: "h-48 w-full",
  "card-sm": "h-24 w-full",
  "card-md": "h-44 w-full",
} as const;

function Skeleton({ className, preset = "line", radius = "md", width = "preset", height = "preset", shape = "rounded", centered = false, shrink = true, marginTop = "none", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        shape === "circle" ? "rounded-full" : radius === "md" ? "rounded-md" : "rounded-xl",
        presets[preset],
        width === "full" && "w-full", width === "three-quarter" && "w-3/4", width === "two-third" && "w-2/3",
        width === "half" && "w-1/2", width === "two-fifth" && "w-2/5", width === "one-third" && "w-1/3",
        width === "three-fifth" && "w-3/5", width === "four-fifth" && "w-4/5", width === "sm" && "w-20", width === "md" && "w-24",
        height === "dot" && "h-2", height === "xs" && "h-2.5", height === "sm" && "h-3", height === "md" && "h-7",
        height === "lg" && "h-8", height === "xl" && "h-10",
        centered && "mx-auto", !shrink && "shrink-0", marginTop === "xs" && "mt-1",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
