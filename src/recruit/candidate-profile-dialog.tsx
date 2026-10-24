"use client";

import { Button } from "@/components/recruit-ui/core/primitives/button";
import { Icon } from "@/components/recruit-ui/core/primitives/icon";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/recruit-ui/core/primitives/responsive-dialog";
import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

export interface CandidateProfileDialogProps {
  accessibleTitle: ReactNode;
  accessibleDescription?: ReactNode;
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  footerLayout?: "auto" | "fill";
  /** Disable only when a composed header or footer supplies its own dialog close. */
  showClose?: boolean;
  closeLabel?: string;
  contentClassName?: string;
  bodyClassName?: string;
}

/** Responsive profile shell with explicit accessibility and composition slots. */
export function CandidateProfileDialog({
  accessibleTitle,
  accessibleDescription,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  header,
  children,
  footer,
  footerLayout = "auto",
  showClose = true,
  closeLabel = "Close candidate profile",
  contentClassName,
  bodyClassName,
}: CandidateProfileDialogProps) {
  return (
    <ResponsiveDialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger ? (
        <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
      ) : null}
      <ResponsiveDialogContent
        data-slot="candidate-profile-dialog"
        presentation="preview"
        className={contentClassName}
      >
        {showClose ? (
          <ResponsiveDialogClose asChild>
            <Button
              type="button"
              variant="quiet"
              size="icon"
              aria-label={closeLabel}
              data-slot="candidate-profile-dialog-close"
              className="absolute right-2 top-2 z-10"
            >
              <Icon icon={X} size="lg" />
            </Button>
          </ResponsiveDialogClose>
        ) : null}
        <ResponsiveDialogHeader visibility="screen-reader">
          <ResponsiveDialogTitle>{accessibleTitle}</ResponsiveDialogTitle>
          {accessibleDescription != null ? (
            <ResponsiveDialogDescription>
              {accessibleDescription}
            </ResponsiveDialogDescription>
          ) : null}
        </ResponsiveDialogHeader>
        {header}
        <ResponsiveDialogBody className={bodyClassName}>
          {children}
        </ResponsiveDialogBody>
        {footer != null ? (
          <ResponsiveDialogFooter layout={footerLayout}>
            {footer}
          </ResponsiveDialogFooter>
        ) : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
