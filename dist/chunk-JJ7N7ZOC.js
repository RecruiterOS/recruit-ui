import {
  Button
} from "./chunk-A7XOSQ7J.js";
import {
  cn
} from "./chunk-WTFE3OMU.js";

// vendor/core/files/src/primitives/icon.tsx
import { createElement } from "react";
var sizes = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6"
};
var tones = {
  inherit: "text-current",
  muted: "text-muted-foreground",
  primary: "text-primary",
  info: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  destructive: "text-destructive",
  disabled: "text-muted-foreground/40"
};
function Icon({ icon, size = "md", tone = "inherit", spin = false, align = "center", filled = false, visibility = "visible", marginEnd = "none", marginStart = "none", motion = "none", rotation = "none", marginBottom = "none", className, ...props }) {
  return createElement(icon, {
    "aria-hidden": true,
    className: cn("shrink-0", typeof size === "number" ? void 0 : sizes[size], tones[tone], spin && "animate-spin", align === "start" && "mt-0.5", filled && "fill-current", visibility === "hidden" && "opacity-0", visibility === "parent-hover" && "opacity-0 transition-opacity group-hover:opacity-100", marginEnd === "md" && "mr-2", marginStart === "sm" && "ml-1", motion === "parent-nudge" && "transition-transform duration-200 ease-out group-hover:translate-x-1", rotation === "half" && "rotate-180 transition-transform", marginBottom === "sm" && "mb-2", marginBottom === "md" && "mb-3", className),
    ...typeof size === "number" ? { size } : {},
    ...props
  });
}

// vendor/core/files/src/primitives/responsive-dialog.tsx
import * as React3 from "react";
import { useMediaQuery } from "react-responsive";

// vendor/core/files/src/primitives/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    "data-slot": "dialog-overlay",
    className: cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, size = "md", height = "auto", layout = "grid", padding = "default", overflow = "visible", mobile = "inset", hideClose = false, maxHeight = "none", frame = "default", ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      "data-slot": "dialog-content",
      className: cn(
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
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: cn("absolute right-2 top-2 inline-flex h-[44px] w-[44px] items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent", hideClose && "hidden"), children: [
          /* @__PURE__ */ jsx(X, { className: "h-[20px] w-[20px]" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  align = "responsive",
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-slot": "dialog-header",
    className: cn(
      "flex flex-col space-y-1.5",
      align === "responsive" && "text-center sm:text-left",
      align === "start" && "text-left",
      align === "center" && "text-center",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    "data-slot": "dialog-footer",
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, visuallyHidden = false, size = "default", display = "block", ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    "data-slot": "dialog-title",
    className: cn(
      "font-semibold leading-none tracking-tight",
      size === "default" ? "text-lg" : "text-base",
      display === "inline-flex" && "inline-flex items-center gap-2",
      visuallyHidden && "sr-only",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, visuallyHidden = false, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    "data-slot": "dialog-description",
    className: cn("text-sm text-muted-foreground", visuallyHidden && "sr-only", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// vendor/core/files/src/primitives/drawer.tsx
import * as React2 from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => /* @__PURE__ */ jsx2(
  DrawerPrimitive.Root,
  {
    shouldScaleBackground,
    ...props
  }
);
Drawer.displayName = "Drawer";
var DrawerTrigger = DrawerPrimitive.Trigger;
var DrawerPortal = DrawerPrimitive.Portal;
var DrawerClose = DrawerPrimitive.Close;
var DrawerOverlay = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  DrawerPrimitive.Overlay,
  {
    ref,
    "data-slot": "drawer-overlay",
    className: cn("fixed inset-0 z-50 bg-black/80", className),
    ...props
  }
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;
var DrawerContent = React2.forwardRef(({ className, children, height = "auto", overflow = "visible", ...props }, ref) => /* @__PURE__ */ jsxs2(DrawerPortal, { children: [
  /* @__PURE__ */ jsx2(DrawerOverlay, {}),
  /* @__PURE__ */ jsxs2(
    DrawerPrimitive.Content,
    {
      ref,
      "data-slot": "drawer-content",
      className: cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        height === "viewport-lg" && "h-[90dvh]",
        overflow === "hidden" && "overflow-hidden",
        overflow === "auto" && "overflow-auto",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx2("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }),
        children
      ]
    }
  )
] }));
DrawerContent.displayName = "DrawerContent";
var DrawerHeader = ({
  className,
  align = "responsive",
  ...props
}) => /* @__PURE__ */ jsx2(
  "div",
  {
    "data-slot": "drawer-header",
    className: cn("grid gap-1.5 p-4", align === "responsive" ? "text-center sm:text-left" : "text-left", className),
    ...props
  }
);
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx2(
  "div",
  {
    "data-slot": "drawer-footer",
    className: cn("mt-auto flex flex-col gap-2 p-4", className),
    ...props
  }
);
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  DrawerPrimitive.Title,
  {
    ref,
    "data-slot": "drawer-title",
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;
var DrawerDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  DrawerPrimitive.Description,
  {
    ref,
    "data-slot": "drawer-description",
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// vendor/core/files/src/primitives/responsive-dialog.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var DesktopContext = React3.createContext(false);
var useIsDesktop = () => React3.useContext(DesktopContext);
var DESKTOP_QUERY = { minWidth: 1024 };
var ResponsiveDialog = ({ children, ...props }) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const Root2 = isDesktop ? Dialog : Drawer;
  return /* @__PURE__ */ jsx3(DesktopContext.Provider, { value: isDesktop, children: /* @__PURE__ */ jsx3(Root2, { ...props, children }) });
};
ResponsiveDialog.displayName = "ResponsiveDialog";
var ResponsiveDialogTrigger = ({
  children,
  ...props
}) => {
  const Trigger2 = useIsDesktop() ? DialogTrigger : DrawerTrigger;
  return /* @__PURE__ */ jsx3(Trigger2, { ...props, children });
};
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";
var ResponsiveDialogClose = ({
  children,
  ...props
}) => {
  const Close2 = useIsDesktop() ? DialogClose : DrawerClose;
  return /* @__PURE__ */ jsx3(Close2, { ...props, children });
};
ResponsiveDialogClose.displayName = "ResponsiveDialogClose";
var ResponsiveDialogContent = React3.forwardRef(({ className, children, presentation = "default", ...props }, ref) => {
  if (useIsDesktop()) {
    return /* @__PURE__ */ jsx3(
      DialogContent,
      {
        ref,
        className: cn(
          "flex max-h-[85vh] max-w-md flex-col gap-0 overflow-hidden p-0",
          presentation === "preview" && "max-w-2xl sm:h-[85vh] [&>button:last-child]:hidden",
          className
        ),
        ...props,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx3(
    DrawerContent,
    {
      ref,
      className: cn("max-h-[92vh]", className),
      ...props,
      children
    }
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";
var ResponsiveDialogHeader = ({
  className,
  visibility = "visible",
  ...props
}) => {
  const Header = useIsDesktop() ? DialogHeader : DrawerHeader;
  return /* @__PURE__ */ jsx3(
    Header,
    {
      className: cn(useIsDesktop() && "p-4", visibility === "screen-reader" && "sr-only", className),
      ...props
    }
  );
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";
var ResponsiveDialogBody = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx3("div", { className: cn("min-h-0 flex-1 overflow-y-auto px-4 pb-6", className), ...props });
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";
var ResponsiveDialogFooter = ({
  className,
  layout = "auto",
  ...props
}) => {
  const isDesktop = useIsDesktop();
  const Footer = isDesktop ? DialogFooter : DrawerFooter;
  return /* @__PURE__ */ jsx3(
    Footer,
    {
      className: cn(
        "mt-0 shrink-0 gap-2 border-t bg-background p-4",
        layout === "fill" ? "flex-row space-x-0 [&>*]:min-w-0 [&>*]:flex-1" : isDesktop ? "flex-row justify-end space-x-0 [&>*]:flex-none" : "grid grid-cols-2 [&>*]:w-full",
        className
      ),
      ...props
    }
  );
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";
var ResponsiveDialogTitle = React3.forwardRef(({ className, visuallyHidden = false, ...props }, ref) => {
  const Title2 = useIsDesktop() ? DialogTitle : DrawerTitle;
  return /* @__PURE__ */ jsx3(Title2, { ref, className: cn(visuallyHidden && "sr-only", className), ...props });
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";
var ResponsiveDialogDescription = React3.forwardRef(({ className, visuallyHidden = false, ...props }, ref) => {
  const Description2 = useIsDesktop() ? DialogDescription : DrawerDescription;
  return /* @__PURE__ */ jsx3(Description2, { ref, className: cn(visuallyHidden && "sr-only", className), ...props });
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

// src/recruit/candidate-profile-dialog.tsx
import { X as X2 } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function CandidateProfileDialog({
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
  bodyClassName
}) {
  return /* @__PURE__ */ jsxs3(
    ResponsiveDialog,
    {
      open,
      defaultOpen,
      onOpenChange,
      children: [
        trigger ? /* @__PURE__ */ jsx4(ResponsiveDialogTrigger, { asChild: true, children: trigger }) : null,
        /* @__PURE__ */ jsxs3(
          ResponsiveDialogContent,
          {
            "data-slot": "candidate-profile-dialog",
            presentation: "preview",
            className: contentClassName,
            children: [
              showClose ? /* @__PURE__ */ jsx4(ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ jsx4(
                Button,
                {
                  type: "button",
                  variant: "quiet",
                  size: "icon",
                  "aria-label": closeLabel,
                  "data-slot": "candidate-profile-dialog-close",
                  className: "absolute right-2 top-2 z-10",
                  children: /* @__PURE__ */ jsx4(Icon, { icon: X2, size: "lg" })
                }
              ) }) : null,
              /* @__PURE__ */ jsxs3(ResponsiveDialogHeader, { visibility: "screen-reader", children: [
                /* @__PURE__ */ jsx4(ResponsiveDialogTitle, { children: accessibleTitle }),
                accessibleDescription != null ? /* @__PURE__ */ jsx4(ResponsiveDialogDescription, { children: accessibleDescription }) : null
              ] }),
              header,
              /* @__PURE__ */ jsx4(ResponsiveDialogBody, { className: bodyClassName, children }),
              footer != null ? /* @__PURE__ */ jsx4(ResponsiveDialogFooter, { layout: footerLayout, children: footer }) : null
            ]
          }
        )
      ]
    }
  );
}

export {
  CandidateProfileDialog
};
