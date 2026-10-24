"use client";

import * as React from "react";
import { useMediaQuery } from "react-responsive";

import { cn } from "../lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

/**
 * ResponsiveDialog — one API, two presentations.
 *
 * Renders a centered `Dialog` on desktop (≥1024px) and a bottom-sheet
 * `Drawer` on mobile, so consumers stop re-implementing the breakpoint
 * branch by hand.
 *
 * Sub-components read the active mode from context so Title/Description
 * bind to the correct (Radix vs vaul) accessibility root.
 */

const DesktopContext = React.createContext(false);
const useIsDesktop = () => React.useContext(DesktopContext);

// Desktop starts at 1024px; narrower viewports get the drawer.
const DESKTOP_QUERY = { minWidth: 1024 };

type RootProps = React.ComponentProps<typeof Dialog> &
  React.ComponentProps<typeof Drawer>;

const ResponsiveDialog = ({ children, ...props }: RootProps) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const Root = isDesktop ? Dialog : Drawer;
  return (
    <DesktopContext.Provider value={isDesktop}>
      <Root {...props}>{children}</Root>
    </DesktopContext.Provider>
  );
};
ResponsiveDialog.displayName = "ResponsiveDialog";

const ResponsiveDialogTrigger = ({
  children,
  ...props
}: React.ComponentProps<typeof DialogTrigger>) => {
  const Trigger = useIsDesktop() ? DialogTrigger : DrawerTrigger;
  return <Trigger {...props}>{children}</Trigger>;
};
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

const ResponsiveDialogClose = ({
  children,
  ...props
}: React.ComponentProps<typeof DialogClose>) => {
  const Close = useIsDesktop() ? DialogClose : DrawerClose;
  return <Close {...props}>{children}</Close>;
};
ResponsiveDialogClose.displayName = "ResponsiveDialogClose";

/**
 * Content. Desktop is a compact centered card (`max-w-md`); mobile is a
 * tall bottom sheet. Both clamp height and own no inner padding — pad via
 * <ResponsiveDialogHeader> (p-4) and <ResponsiveDialogBody> so the two
 * presentations line up. The desktop card keeps the Dialog's built-in
 * close "X"; mobile keeps the drawer grabber.
 */
interface ResponsiveDialogContentProps extends React.ComponentProps<typeof DialogContent> {
  presentation?: "default" | "preview";
}

const ResponsiveDialogContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogContentProps
>(({ className, children, presentation = "default", ...props }, ref) => {
  if (useIsDesktop()) {
    return (
      <DialogContent
        ref={ref}
        className={cn(
          "flex max-h-[85vh] max-w-md flex-col gap-0 overflow-hidden p-0",
          presentation === "preview" && "max-w-2xl sm:h-[85vh] [&>button:last-child]:hidden",
          className
        )}
        {...props}
      >
        {children}
      </DialogContent>
    );
  }
  return (
    <DrawerContent
      ref={ref}
      className={cn("max-h-[92vh]", className)}
      {...(props as React.ComponentProps<typeof DrawerContent>)}
    >
      {children}
    </DrawerContent>
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

interface ResponsiveDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  visibility?: "visible" | "screen-reader";
}

const ResponsiveDialogHeader = ({
  className,
  visibility = "visible",
  ...props
}: ResponsiveDialogHeaderProps) => {
  // DrawerHeader is already p-4; pad the dialog branch to match.
  const Header = useIsDesktop() ? DialogHeader : DrawerHeader;
  return (
    <Header
      className={cn(useIsDesktop() && "p-4", visibility === "screen-reader" && "sr-only", className)}
      {...props}
    />
  );
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

/** Padded, scrollable body — identical markup in both presentations. */
const ResponsiveDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("min-h-0 flex-1 overflow-y-auto px-4 pb-6", className)} {...props} />
);
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

interface ResponsiveDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `fill` mirrors a review action dock: direct children share the full row. */
  layout?: "auto" | "fill";
}

/** Persistent action row outside the scrollable body. */
const ResponsiveDialogFooter = ({
  className,
  layout = "auto",
  ...props
}: ResponsiveDialogFooterProps) => {
  const isDesktop = useIsDesktop();
  const Footer = isDesktop ? DialogFooter : DrawerFooter;
  return (
    <Footer
      className={cn(
        "mt-0 shrink-0 gap-2 border-t bg-background p-4",
        layout === "fill"
          ? "flex-row space-x-0 [&>*]:min-w-0 [&>*]:flex-1"
          : isDesktop
            ? "flex-row justify-end space-x-0 [&>*]:flex-none"
            : "grid grid-cols-2 [&>*]:w-full",
        className,
      )}
      {...props}
    />
  );
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

const ResponsiveDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof DialogTitle>
>(({ className, visuallyHidden = false, ...props }, ref) => {
  const Title = useIsDesktop() ? DialogTitle : DrawerTitle;
  return <Title ref={ref} className={cn(visuallyHidden && "sr-only", className)} {...props} />;
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

const ResponsiveDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof DialogDescription>
>(({ className, visuallyHidden = false, ...props }, ref) => {
  const Description = useIsDesktop() ? DialogDescription : DrawerDescription;
  return <Description ref={ref} className={cn(visuallyHidden && "sr-only", className)} {...props} />;
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
