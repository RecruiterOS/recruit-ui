"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/recruit/candidate-card-columns-toggle.tsx
var _uselayoutpreference = require('@epicbagel/saas-kit/hooks/use-layout-preference');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _responsiveview = require('@epicbagel/saas-kit/primitives/responsive-view');
var _togglegroup = require('@epicbagel/saas-kit/primitives/toggle-group');
var _lucidereact = require('lucide-react');
var _jsxruntime = require('react/jsx-runtime');
function useCandidateCardColumns(viewId) {
  const { layout, setLayout } = _uselayoutpreference.useLayoutPreference.call(void 0, viewId);
  const columns = layout === "comfortable" ? 1 : 2;
  return {
    columns,
    setColumns: (next) => setLayout(next === 1 ? "comfortable" : "compact")
  };
}
var DEFAULT_LABELS = {
  group: "Cards per row",
  one: "One card per row",
  two: "Two cards per row"
};
function CandidateCardColumnsToggle({
  columns,
  onChange,
  roomy = false,
  labels,
  className
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const value = columns === 1 ? "one" : "two";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _responsiveview.ResponsiveView,
    {
      mobile: null,
      desktop: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _togglegroup.ToggleGroup,
        {
          type: "single",
          value,
          onValueChange: (next) => {
            if (next === "one") onChange(1);
            if (next === "two") onChange(2);
          },
          variant: "outline",
          size: roomy ? "icon-lg" : "icon",
          "aria-label": text.group,
          "data-slot": "candidate-card-columns-toggle",
          className,
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _togglegroup.ToggleGroupItem, { value: "one", "aria-label": text.one, title: text.one, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Rows3, size: "sm" }) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _togglegroup.ToggleGroupItem, { value: "two", "aria-label": text.two, title: text.two, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Columns2, size: "sm" }) })
          ]
        }
      )
    }
  );
}




exports.useCandidateCardColumns = useCandidateCardColumns; exports.CandidateCardColumnsToggle = CandidateCardColumnsToggle;
