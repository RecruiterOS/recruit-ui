"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "../lib/utils";
import { X } from "lucide-react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "wide";
  height?: "auto" | "viewport-md" | "viewport-lg";
  layout?: "grid" | "column";
  padding?: "none" | "default";
  overflow?: "visible" | "hidden" | "auto";
  mobile?: "inset" | "fullscreen";
  hideClose?: boolean;
  maxHeight?: "none" | "viewport";
  frame?: "default" | "none";
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size = "md", height = "auto", layout = "grid", padding = "default", overflow = "visible", mobile = "inset", hideClose = false, maxHeight = "none", frame = "default", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        // `w-[calc(100%-2rem)]` keeps a 1rem gutter down each side on mobile
        // (instead of edge-to-edge `w-full`); `max-w-lg` still caps it on
        // desktop. Rounded on every breakpoint now there's always a margin.
        "fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border bg-background shadow-xl outline-none duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        size === "sm" && "max-w-md",
        size === "md" && "max-w-lg",
        size === "lg" && "max-w-xl",
        size === "xl" && "max-w-2xl",
        size === "2xl" && "max-w-3xl",
        size === "wide" && "w-[min(96vw,1100px)] max-w-5xl",
        height === "viewport-md" && "h-[85vh]",
        height === "viewport-lg" && "h-[90dvh]",
        layout === "grid" ? "grid" : "flex flex-col",
        padding === "default" && "p-6",
        overflow === "hidden" && "overflow-hidden",
        overflow === "auto" && "overflow-auto",
        mobile === "fullscreen" && "inset-0 left-0 top-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 rounded-none sm:inset-auto sm:left-[50%] sm:top-[50%] sm:h-auto sm:w-[calc(100%-2rem)] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-xl",
        maxHeight === "viewport" && "max-h-[calc(100dvh-2rem)]",
        frame === "none" && "border-0 bg-transparent shadow-none",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={cn("absolute right-2 top-2 inline-flex h-[44px] w-[44px] items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent", hideClose && "hidden")}>
        <X className="h-[20px] w-[20px]" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "responsive" | "start" | "center";
}

const DialogHeader = ({
  className,
  align = "responsive",
  ...props
}: DialogHeaderProps) => (
  <div
    data-slot="dialog-header"
    className={cn(
      "flex flex-col space-y-1.5",
      align === "responsive" && "text-center sm:text-left",
      align === "start" && "text-left",
      align === "center" && "text-center",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  visuallyHidden?: boolean;
  size?: "default" | "base";
  display?: "block" | "inline-flex";
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, visuallyHidden = false, size = "default", display = "block", ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(
      "font-semibold leading-none tracking-tight",
      size === "default" ? "text-lg" : "text-base",
      display === "inline-flex" && "inline-flex items-center gap-2",
      visuallyHidden && "sr-only",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  visuallyHidden?: boolean;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, visuallyHidden = false, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-sm text-muted-foreground", visuallyHidden && "sr-only", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
