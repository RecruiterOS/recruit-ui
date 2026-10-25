import {
  CurrentCompanyLabel
} from "./chunk-XTAH2XJR.js";

// src/recruit/current-company-popover.tsx
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Popover, PopoverContent, PopoverTrigger } from "@epicbagel/saas-kit/primitives/popover";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CurrentCompanyPopover({
  company,
  triggerTitle,
  renderContent,
  closeDelayMs = 180,
  size = "sm",
  tone = "muted",
  ...props
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelayMs);
  }, [cancelClose, closeDelayMs]);
  useEffect(() => () => cancelClose(), [cancelClose]);
  const openOnMouse = (event) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };
  return /* @__PURE__ */ jsx(
    CurrentCompanyLabel,
    {
      size,
      tone,
      ...props,
      company: /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "link",
            size: "bare",
            title: triggerTitle,
            onPointerEnter: openOnMouse,
            onPointerLeave: scheduleClose,
            onClick: (event) => event.stopPropagation(),
            children: /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", size, tone, truncate: true, children: company })
          }
        ) }),
        open && /* @__PURE__ */ jsx(
          PopoverContent,
          {
            width: "lg",
            "data-slot": "current-company-popover",
            onPointerEnter: cancelClose,
            onPointerLeave: scheduleClose,
            onClick: (event) => event.stopPropagation(),
            children: renderContent()
          }
        )
      ] })
    }
  );
}

export {
  CurrentCompanyPopover
};
