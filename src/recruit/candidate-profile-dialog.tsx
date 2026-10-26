"use client";

import { useIsMobile } from "@epicbagel/saas-kit/hooks/use-mobile";
import { cn } from "@epicbagel/saas-kit/lib/utils";
import { Button, type ButtonProps } from "@epicbagel/saas-kit/primitives/button";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
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
} from "@epicbagel/saas-kit/primitives/responsive-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@epicbagel/saas-kit/primitives/sheet";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { X } from "lucide-react";
import { forwardRef, type ReactElement, type ReactNode } from "react";

/**
 * How the profile opens. `dialog` is a centred dialog, and a bottom drawer
 * below the kit dialog's 1024px breakpoint. `sheet` slides in from the right,
 * beside the list it was opened from, and up from the bottom below the kit's
 * 768px mobile breakpoint, so between the two a dialog is already a drawer
 * while a sheet is still at the side.
 *
 * The footer differs on a phone too: a dialog's (`footerLayout="auto"`)
 * becomes a two-column grid, while a sheet's stays one right-aligned row.
 */
export type CandidateProfileDialogPresentation = "dialog" | "sheet";

/**
 * The centred dialog's height on desktop. `viewport` fixes it at 85% of the
 * viewport, so a profile doesn't change height as its sections load or as a
 * person moves between profiles. `content` sizes it to what it holds, up to
 * the same cap, for a short profile such as an example. A drawer and a sheet
 * already fit their content, so this applies to the desktop dialog only.
 */
export type CandidateProfileDialogHeight = "viewport" | "content";

export interface CandidateProfileDialogProps {
  accessibleTitle: ReactNode;
  accessibleDescription?: ReactNode;
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `dialog` (the default) or `sheet`. */
  presentation?: CandidateProfileDialogPresentation;
  /** `viewport` (the default) or `content`; the desktop dialog's only. */
  height?: CandidateProfileDialogHeight;
  /**
   * The visible head, such as a CandidateProfileHeader. It keeps its natural
   * height and only the body scrolls, also in a drawer or bottom sheet, whose
   * height is capped rather than fixed. A CandidateProfileHeader with
   * `padding="dialog"` starts at the body's left edge.
   */
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  footerLayout?: "auto" | "fill";
  /**
   * Disable only when a composed header or footer supplies its own close: the
   * kit's ResponsiveDialogClose in a dialog, its SheetClose in a sheet.
   */
  showClose?: boolean;
  closeLabel?: string;
  /**
   * Class for the dialog or sheet surface. A sheet is as wide as the centred
   * dialog by default; widen it here, for example for a two-column profile.
   */
  contentClassName?: string;
  bodyClassName?: string;
}

const DEFAULT_CLOSE_LABEL = "Close candidate profile";

/**
 * The header slot. It never shrinks: a drawer or bottom sheet only caps its
 * height, so a tall body makes the column shrink its items, and a header that
 * clips its content (a cover header does) has no minimum height and would lose
 * its last lines. The body scrolls, so it takes the shrinking instead.
 */
function ProfileHeaderSlot({ children }: { children: ReactNode }) {
  if (children == null || typeof children === "boolean") return null;
  return (
    <FlexItem data-slot="candidate-profile-dialog-header" shrink={false}>
      {children}
    </FlexItem>
  );
}

/** The close control both presentations pin to the top-right corner. */
const CloseButton = forwardRef<HTMLButtonElement, ButtonProps>(function CloseButton(props, ref) {
  return (
    <Button
      ref={ref}
      type="button"
      variant="quiet"
      size="icon"
      data-slot="candidate-profile-dialog-close"
      className="absolute right-2 top-2 z-10"
      {...props}
    >
      <Icon icon={X} size="lg" />
    </Button>
  );
});

/**
 * Responsive profile shell with explicit accessibility and composition slots,
 * presented as a centred dialog or as a side sheet.
 *
 * The surface is marked `data-slot="candidate-profile-dialog"`, with
 * `data-presentation` naming the presentation and, for a dialog,
 * `data-height` its height; for a sheet, `data-side` names the edge it opens
 * from. A `header` sits in an element marked
 * `data-slot="candidate-profile-dialog-header"`.
 */
export function CandidateProfileDialog({
  presentation = "dialog",
  height = "viewport",
  ...props
}: CandidateProfileDialogProps) {
  return presentation === "sheet" ? (
    <CandidateProfileSheet {...props} />
  ) : (
    <CandidateProfileCentredDialog height={height} {...props} />
  );
}

type PresentationProps = Omit<CandidateProfileDialogProps, "presentation" | "height">;

/**
 * The kit's preview dialog is `sm:h-[85vh]`; `content` lets it shrink to fit,
 * keeping the kit's max-h-[85vh] cap (the class merge drops the fixed height).
 */
const CONTENT_HEIGHT = "sm:h-auto";

function CandidateProfileCentredDialog({
  accessibleTitle,
  accessibleDescription,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  height,
  header,
  children,
  footer,
  footerLayout = "auto",
  showClose = true,
  closeLabel = DEFAULT_CLOSE_LABEL,
  contentClassName,
  bodyClassName,
}: PresentationProps & { height: CandidateProfileDialogHeight }) {
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
        data-presentation="dialog"
        data-height={height}
        presentation="preview"
        className={cn(height === "content" && CONTENT_HEIGHT, contentClassName)}
      >
        {showClose ? (
          <ResponsiveDialogClose asChild>
            <CloseButton aria-label={closeLabel} />
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
        <ProfileHeaderSlot>{header}</ProfileHeaderSlot>
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

/**
 * The kit's Sheet, from the right on desktop and from the bottom below the
 * kit's mobile breakpoint. The body is the dialog's own, so a profile reads
 * the same in either presentation; the footer is the same bordered action
 * row.
 */
function CandidateProfileSheet({
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
  closeLabel = DEFAULT_CLOSE_LABEL,
  contentClassName,
  bodyClassName,
}: PresentationProps) {
  const isMobile = useIsMobile();
  const side = isMobile ? "bottom" : "right";
  const surfaceClassName = [
    "gap-0",
    // As tall as the dialog's drawer on a phone; as wide as the dialog on desktop.
    isMobile ? "max-h-[92dvh] rounded-t-xl" : "w-full sm:max-w-2xl",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent
        data-slot="candidate-profile-dialog"
        data-presentation="sheet"
        data-side={side}
        side={side}
        padding="none"
        hideClose
        // With no description, tell Radix so rather than point at nothing.
        {...(accessibleDescription == null ? { "aria-describedby": undefined } : {})}
        className={surfaceClassName}
      >
        {showClose ? (
          <SheetClose asChild>
            <CloseButton aria-label={closeLabel} />
          </SheetClose>
        ) : null}
        <SheetHeader className="sr-only">
          <SheetTitle>{accessibleTitle}</SheetTitle>
          {accessibleDescription != null ? (
            <SheetDescription>{accessibleDescription}</SheetDescription>
          ) : null}
        </SheetHeader>
        <ProfileHeaderSlot>{header}</ProfileHeaderSlot>
        <ResponsiveDialogBody className={bodyClassName}>
          {children}
        </ResponsiveDialogBody>
        {footer != null ? (
          <Stack
            data-slot="candidate-profile-dialog-footer"
            direction="horizontal"
            gap="sm"
            align="center"
            justify="end"
            shrink={false}
            border="top"
            surface="background"
            padding="action-row"
            className={footerLayout === "fill" ? "[&>*]:min-w-0 [&>*]:flex-1" : undefined}
          >
            {footer}
          </Stack>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
