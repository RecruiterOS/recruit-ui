"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import type { ComponentPropsWithoutRef, ElementRef } from "react";

import { cn } from "../lib/utils";
import { forwardRef } from "react";

export interface AvatarProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "square";
  border?: boolean;
  surface?: "default" | "muted";
}

const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "md", shape = "circle", border = false, surface = "default", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden",
      size === "xs" && "size-7",
      size === "sm" && "size-9",
      size === "md" && "size-10",
      size === "lg" && "size-11",
      size === "xl" && "size-12",
      size === "2xl" && "size-16",
      shape === "circle" ? "rounded-full" : "rounded-md",
      border && "border",
      surface === "muted" && "bg-muted",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export interface AvatarImageProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  fit?: "cover" | "contain";
}

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, fit = "cover", ...props }, ref) => (
  // object-cover is critical — without it the underlying <img>
  // defaults to object-fit: fill and stretches portrait/landscape
  // photos to fit the square Avatar container. Crop-to-square is
  // the standard avatar behaviour and what every consumer expects.
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", fit === "cover" ? "object-cover" : "object-contain", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export interface AvatarFallbackProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  shape?: "circle" | "square";
  textSize?: "default" | "micro";
}

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, shape = "circle", textSize = "default", ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-muted",
      shape === "circle" ? "rounded-full" : "rounded-md",
      textSize === "micro" && "text-[10px]",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
