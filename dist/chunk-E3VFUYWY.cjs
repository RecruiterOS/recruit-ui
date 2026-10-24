"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _chunkJ5RZWWAWcjs = require('./chunk-J5RZWWAW.cjs');


var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/icon.tsx
var _react = require('react'); var React3 = _interopRequireWildcard(_react); var React = _interopRequireWildcard(_react); var React2 = _interopRequireWildcard(_react);
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
  return _react.createElement.call(void 0, icon, {
    "aria-hidden": true,
    className: _chunk42BCVSWNcjs.cn.call(void 0, "shrink-0", typeof size === "number" ? void 0 : sizes[size], tones[tone], spin && "animate-spin", align === "start" && "mt-0.5", filled && "fill-current", visibility === "hidden" && "opacity-0", visibility === "parent-hover" && "opacity-0 transition-opacity group-hover:opacity-100", marginEnd === "md" && "mr-2", marginStart === "sm" && "ml-1", motion === "parent-nudge" && "transition-transform duration-200 ease-out group-hover:translate-x-1", rotation === "half" && "rotate-180 transition-transform", marginBottom === "sm" && "mb-2", marginBottom === "md" && "mb-3", className),
    ...typeof size === "number" ? { size } : {},
    ...props
  });
}

// vendor/core/files/src/primitives/responsive-dialog.tsx

var _reactresponsive = require('react-responsive');

// vendor/core/files/src/primitives/dialog.tsx
var _reactdialog = require('@radix-ui/react-dialog'); var DialogPrimitive = _interopRequireWildcard(_reactdialog);

var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  DialogPrimitive.Overlay,
  {
    ref,
    "data-slot": "dialog-overlay",
    className: _chunk42BCVSWNcjs.cn.call(void 0,
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, size = "md", height = "auto", layout = "grid", padding = "default", overflow = "visible", mobile = "inset", hideClose = false, maxHeight = "none", frame = "default", ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, DialogPortal, { children: [
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DialogOverlay, {}),
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    DialogPrimitive.Content,
    {
      ref,
      "data-slot": "dialog-content",
      className: _chunk42BCVSWNcjs.cn.call(void 0,
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
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, DialogPrimitive.Close, { className: _chunk42BCVSWNcjs.cn.call(void 0, "absolute right-2 top-2 inline-flex h-[44px] w-[44px] items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent", hideClose && "hidden"), children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _lucidereact.X, { className: "h-[20px] w-[20px]" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "sr-only", children: "Close" })
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
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  "div",
  {
    "data-slot": "dialog-header",
    className: _chunk42BCVSWNcjs.cn.call(void 0,
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
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  "div",
  {
    "data-slot": "dialog-footer",
    className: _chunk42BCVSWNcjs.cn.call(void 0,
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, visuallyHidden = false, size = "default", display = "block", ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  DialogPrimitive.Title,
  {
    ref,
    "data-slot": "dialog-title",
    className: _chunk42BCVSWNcjs.cn.call(void 0,
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
var DialogDescription = React.forwardRef(({ className, visuallyHidden = false, ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  DialogPrimitive.Description,
  {
    ref,
    "data-slot": "dialog-description",
    className: _chunk42BCVSWNcjs.cn.call(void 0, "text-sm text-muted-foreground", visuallyHidden && "sr-only", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// vendor/core/files/src/primitives/drawer.tsx

var _vaul = require('vaul');

var Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  _vaul.Drawer.Root,
  {
    shouldScaleBackground,
    ...props
  }
);
Drawer.displayName = "Drawer";
var DrawerTrigger = _vaul.Drawer.Trigger;
var DrawerPortal = _vaul.Drawer.Portal;
var DrawerClose = _vaul.Drawer.Close;
var DrawerOverlay = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  _vaul.Drawer.Overlay,
  {
    ref,
    "data-slot": "drawer-overlay",
    className: _chunk42BCVSWNcjs.cn.call(void 0, "fixed inset-0 z-50 bg-black/80", className),
    ...props
  }
));
DrawerOverlay.displayName = _vaul.Drawer.Overlay.displayName;
var DrawerContent = React2.forwardRef(({ className, children, height = "auto", overflow = "visible", ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, DrawerPortal, { children: [
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DrawerOverlay, {}),
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _vaul.Drawer.Content,
    {
      ref,
      "data-slot": "drawer-content",
      className: _chunk42BCVSWNcjs.cn.call(void 0,
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        height === "viewport-lg" && "h-[90dvh]",
        overflow === "hidden" && "overflow-hidden",
        overflow === "auto" && "overflow-auto",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }),
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
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  "div",
  {
    "data-slot": "drawer-header",
    className: _chunk42BCVSWNcjs.cn.call(void 0, "grid gap-1.5 p-4", align === "responsive" ? "text-center sm:text-left" : "text-left", className),
    ...props
  }
);
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  "div",
  {
    "data-slot": "drawer-footer",
    className: _chunk42BCVSWNcjs.cn.call(void 0, "mt-auto flex flex-col gap-2 p-4", className),
    ...props
  }
);
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  _vaul.Drawer.Title,
  {
    ref,
    "data-slot": "drawer-title",
    className: _chunk42BCVSWNcjs.cn.call(void 0,
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DrawerTitle.displayName = _vaul.Drawer.Title.displayName;
var DrawerDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
  _vaul.Drawer.Description,
  {
    ref,
    "data-slot": "drawer-description",
    className: _chunk42BCVSWNcjs.cn.call(void 0, "text-sm text-muted-foreground", className),
    ...props
  }
));
DrawerDescription.displayName = _vaul.Drawer.Description.displayName;

// vendor/core/files/src/primitives/responsive-dialog.tsx

var DesktopContext = React3.createContext(false);
var useIsDesktop = () => React3.useContext(DesktopContext);
var DESKTOP_QUERY = { minWidth: 1024 };
var ResponsiveDialog = ({ children, ...props }) => {
  const isDesktop = _reactresponsive.useMediaQuery.call(void 0, DESKTOP_QUERY);
  const Root2 = isDesktop ? Dialog : Drawer;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DesktopContext.Provider, { value: isDesktop, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Root2, { ...props, children }) });
};
ResponsiveDialog.displayName = "ResponsiveDialog";
var ResponsiveDialogTrigger = ({
  children,
  ...props
}) => {
  const Trigger2 = useIsDesktop() ? DialogTrigger : DrawerTrigger;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Trigger2, { ...props, children });
};
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";
var ResponsiveDialogClose = ({
  children,
  ...props
}) => {
  const Close2 = useIsDesktop() ? DialogClose : DrawerClose;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Close2, { ...props, children });
};
ResponsiveDialogClose.displayName = "ResponsiveDialogClose";
var ResponsiveDialogContent = React3.forwardRef(({ className, children, presentation = "default", ...props }, ref) => {
  if (useIsDesktop()) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      DialogContent,
      {
        ref,
        className: _chunk42BCVSWNcjs.cn.call(void 0,
          "flex max-h-[85vh] max-w-md flex-col gap-0 overflow-hidden p-0",
          presentation === "preview" && "max-w-2xl sm:h-[85vh] [&>button:last-child]:hidden",
          className
        ),
        ...props,
        children
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    DrawerContent,
    {
      ref,
      className: _chunk42BCVSWNcjs.cn.call(void 0, "max-h-[92vh]", className),
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Header,
    {
      className: _chunk42BCVSWNcjs.cn.call(void 0, useIsDesktop() && "p-4", visibility === "screen-reader" && "sr-only", className),
      ...props
    }
  );
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";
var ResponsiveDialogBody = ({
  className,
  ...props
}) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: _chunk42BCVSWNcjs.cn.call(void 0, "min-h-0 flex-1 overflow-y-auto px-4 pb-6", className), ...props });
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";
var ResponsiveDialogFooter = ({
  className,
  layout = "auto",
  ...props
}) => {
  const isDesktop = useIsDesktop();
  const Footer = isDesktop ? DialogFooter : DrawerFooter;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Footer,
    {
      className: _chunk42BCVSWNcjs.cn.call(void 0,
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Title2, { ref, className: _chunk42BCVSWNcjs.cn.call(void 0, visuallyHidden && "sr-only", className), ...props });
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";
var ResponsiveDialogDescription = React3.forwardRef(({ className, visuallyHidden = false, ...props }, ref) => {
  const Description2 = useIsDesktop() ? DialogDescription : DrawerDescription;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Description2, { ref, className: _chunk42BCVSWNcjs.cn.call(void 0, visuallyHidden && "sr-only", className), ...props });
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

// src/recruit/candidate-profile-dialog.tsx


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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    ResponsiveDialog,
    {
      open,
      defaultOpen,
      onOpenChange,
      children: [
        trigger ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ResponsiveDialogTrigger, { asChild: true, children: trigger }) : null,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          ResponsiveDialogContent,
          {
            "data-slot": "candidate-profile-dialog",
            presentation: "preview",
            className: contentClassName,
            children: [
              showClose ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ResponsiveDialogClose, { asChild: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chunkJ5RZWWAWcjs.Button,
                {
                  type: "button",
                  variant: "quiet",
                  size: "icon",
                  "aria-label": closeLabel,
                  "data-slot": "candidate-profile-dialog-close",
                  className: "absolute right-2 top-2 z-10",
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Icon, { icon: _lucidereact.X, size: "lg" })
                }
              ) }) : null,
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, ResponsiveDialogHeader, { visibility: "screen-reader", children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ResponsiveDialogTitle, { children: accessibleTitle }),
                accessibleDescription != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ResponsiveDialogDescription, { children: accessibleDescription }) : null
              ] }),
              header,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ResponsiveDialogBody, { className: bodyClassName, children }),
              footer != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ResponsiveDialogFooter, { layout: footerLayout, children: footer }) : null
            ]
          }
        )
      ]
    }
  );
}



exports.CandidateProfileDialog = CandidateProfileDialog;
