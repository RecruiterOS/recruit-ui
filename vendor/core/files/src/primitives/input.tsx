"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * When true, the input selects its existing text on focus — useful
   * for popover/drawer editors where the user opens the field to
   * replace the value, not append to it.
   */
  selectOnFocus?: boolean;
  font?: "sans" | "mono";
  textSize?: "default" | "xs";
  controlSize?: "default" | "sm" | "lg";
  surface?: "default" | "ghost";
  grow?: boolean;
  marginTop?: "none" | "xs";
  tone?: "default" | "muted";
  controlWidth?: "full" | "compact";
  shrink?: boolean;
  weight?: "normal" | "medium";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, selectOnFocus, font = "sans", textSize = "default", controlSize = "default", surface = "default", grow = false, marginTop = "none", tone = "default", controlWidth = "full", shrink = true, weight = "normal", onFocus, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex w-full rounded-md px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          surface === "default" && "border border-input bg-background enabled:hover:border-muted-foreground/30 enabled:hover:bg-accent/10",
          surface === "ghost" && "border-0 bg-transparent shadow-none",
          controlSize === "default" && "h-11 px-4",
          controlSize === "sm" && "h-9",
          controlSize === "lg" && "h-12 px-4 py-3",
          font === "mono" && "font-mono",
          textSize === "default" && "text-[16px] md:text-sm",
          // iOS Safari zooms focused form controls below 16px. Keep every
          // input at the base size on mobile, even when a compact desktop
          // treatment is requested.
          textSize === "xs" && "text-[16px] md:text-xs",
          grow && "flex-1",
          marginTop === "xs" && "mt-1",
          tone === "muted" && "text-muted-foreground",
          controlWidth === "compact" && "w-32",
          !shrink && "shrink-0",
          weight === "medium" && "font-medium",
          className
        )}
        ref={ref}
        onFocus={(e) => {
          if (selectOnFocus) e.currentTarget.select();
          onFocus?.(e);
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
