"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

var _chunk42BCVSWNcjs = require('./chunk-42BCVSWN.cjs');

// vendor/core/files/src/primitives/button.tsx
var _reactslot = require('@radix-ui/react-slot');
var _classvarianceauthority = require('class-variance-authority');
var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
var buttonVariants = _classvarianceauthority.cva.call(void 0,
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "outline-muted": "border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        quiet: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        "ghost-destructive": "text-destructive hover:bg-destructive/10 hover:text-destructive",
        link: "text-primary underline-offset-4 hover:underline",
        "link-muted": "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
        inverted: "bg-background text-foreground hover:bg-background/90",
        "status-error": "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300",
        "status-warning": "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
        "status-muted": "bg-muted text-muted-foreground hover:bg-muted/80"
      },
      size: {
        // Standard text buttons are intentionally roomy: small is the 44px
        // minimum control, while default and larger actions step up from it.
        // Dense utility controls keep their explicit compact/filter variants.
        default: "min-h-12 px-6 py-3",
        sm: "min-h-11 rounded-md px-5 py-2.5",
        lg: "min-h-14 rounded-md px-8 py-4",
        hero: "min-h-14 rounded-md px-8 py-4",
        toolbar: "min-h-12 px-5 py-3",
        // Normal icon controls share a 44px minimum target. The icon stays
        // visually small; the button supplies the comfortable click/tap area.
        icon: "h-11 w-11",
        "icon-lg": "h-12 w-12",
        "icon-sm": "h-11 w-11",
        "icon-md": "h-11 w-11",
        "icon-xs": "h-6 w-6",
        "icon-compact": "h-7 w-7",
        "icon-micro": "h-5 w-5",
        compact: "h-7 px-2 text-xs",
        filter: "h-8 px-3 text-xs",
        micro: "h-6 px-2 text-[11px]",
        bare: "h-auto justify-start p-0",
        status: "h-auto rounded-full px-3 py-1 text-xs",
        "voice-sm": "h-16 w-16 rounded-full border-2",
        voice: "h-20 w-20 rounded-full border-2",
        suggestion: "h-auto rounded-full border-dashed px-2.5 py-1 text-[11px]",
        tone: "h-auto w-full justify-start gap-1.5 px-2 py-1"
      },
      width: {
        auto: "",
        full: "w-full",
        responsive: "w-full sm:w-auto"
      },
      align: {
        center: "justify-center",
        start: "justify-start"
      },
      shrink: {
        true: "shrink-0",
        false: ""
      },
      shape: {
        default: "",
        circle: "rounded-full"
      },
      ring: {
        none: "",
        surface: "ring-2 ring-background"
      },
      grow: {
        true: "flex-1",
        false: ""
      },
      minWidth: {
        auto: "",
        zero: "min-w-0"
      },
      textAlign: {
        center: "text-center",
        start: "text-left"
      },
      marginTop: {
        none: "",
        xs: "mt-1",
        sm: "mt-2"
      },
      marginStart: {
        none: "",
        sm: "ml-1",
        "negative-sm": "-ml-2",
        auto: "ml-auto"
      },
      reveal: {
        always: "",
        "parent-hover": "opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
        "parent-hover-responsive": "opacity-60 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
      },
      interaction: {
        none: "",
        group: "group"
      },
      position: {
        static: "",
        relative: "relative",
        "viewport-top-end": "fixed right-4 top-4 z-10"
      },
      transform: {
        none: "",
        capitalize: "capitalize"
      },
      marginEnd: {
        none: "",
        "negative-xs": "-mr-1"
      },
      gap: {
        default: "",
        xs: "gap-1"
      },
      numeric: {
        normal: "",
        tabular: "tabular-nums"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "auto",
      align: "center",
      shrink: false,
      shape: "default",
      ring: "none",
      grow: false,
      minWidth: "auto",
      textAlign: "center",
      marginTop: "none",
      marginStart: "none",
      reveal: "always",
      interaction: "none",
      position: "static",
      transform: "none",
      marginEnd: "none",
      gap: "default",
      numeric: "normal"
    }
  }
);
var Button = _react.forwardRef.call(void 0,
  ({ className, variant, size, width, align, shrink, shape, ring, grow, minWidth, textAlign, marginTop, marginStart, reveal, interaction, position, transform, marginEnd, gap, numeric, asChild = false, ...props }, ref) => {
    const Comp = asChild ? _reactslot.Slot : "button";
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      Comp,
      {
        "data-slot": "button",
        "data-variant": _nullishCoalesce(variant, () => ( "default")),
        "data-size": _nullishCoalesce(size, () => ( "default")),
        "data-shape": _nullishCoalesce(shape, () => ( "default")),
        className: _chunk42BCVSWNcjs.cn.call(void 0, buttonVariants({ variant, size, width, align, shrink, shape, ring, grow, minWidth, textAlign, marginTop, marginStart, reveal, interaction, position, transform, marginEnd, gap, numeric, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";



exports.Button = Button;
