"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk5E7ZZ5PNcjs = require('./chunk-5E7ZZ5PN.cjs');

// src/recruit/document-list.tsx
var _alert = require('@epicbagel/saas-kit/primitives/alert');
var _badge = require('@epicbagel/saas-kit/primitives/badge');
var _button = require('@epicbagel/saas-kit/primitives/button');
var _emptystate = require('@epicbagel/saas-kit/primitives/empty-state');
var _filedropzone = require('@epicbagel/saas-kit/primitives/file-dropzone');
var _flexitem = require('@epicbagel/saas-kit/primitives/flex-item');
var _icon = require('@epicbagel/saas-kit/primitives/icon');
var _panelsection = require('@epicbagel/saas-kit/primitives/panel-section');
var _sectionheader = require('@epicbagel/saas-kit/primitives/section-header');






var _select = require('@epicbagel/saas-kit/primitives/select');
var _skeleton = require('@epicbagel/saas-kit/primitives/skeleton');
var _stack = require('@epicbagel/saas-kit/primitives/stack');
var _text = require('@epicbagel/saas-kit/primitives/text');
var _lucidereact = require('lucide-react');





var _react = require('react');
var _jsxruntime = require('react/jsx-runtime');
function formatFileSize(bytes, empty = "\u2014") {
  if (!bytes) return empty;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
var ACTION_VERB = {
  preview: "Preview",
  download: "Download",
  reanalyse: "Re-analyse",
  delete: "Delete"
};
var ITEM_LABELS = {
  preview: "Preview document",
  download: "Download document",
  reanalyse: "Re-analyse document",
  delete: "Delete document",
  actionName: (action, name) => `${ACTION_VERB[action]} ${name}`,
  confirmDelete: "Delete",
  cancelDelete: "Cancel",
  processing: "Processing\u2026"
};
function DocumentListItem({
  name,
  kind,
  meta,
  summary,
  processing = false,
  onPreview,
  onDownload,
  downloading = false,
  onReanalyse,
  reanalysing = false,
  onDelete,
  density = "default",
  labels,
  ...props
}) {
  const copy = { ...ITEM_LABELS, ...labels };
  const compact = density === "compact";
  const [confirming, setConfirming] = _react.useState.call(void 0, false);
  const [downloadPending, download] = _chunk5E7ZZ5PNcjs.usePendingAction.call(void 0, onDownload);
  const [reanalysePending, reanalyse] = _chunk5E7ZZ5PNcjs.usePendingAction.call(void 0, onReanalyse);
  const [deletePending, remove] = _chunk5E7ZZ5PNcjs.usePendingAction.call(void 0, onDelete);
  const deleteRef = _react.useRef.call(void 0, null);
  const cancelRef = _react.useRef.call(void 0, null);
  const confirmed = _react.useRef.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (confirming) {
      confirmed.current = true;
      _optionalChain([cancelRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.focus, 'call', _3 => _3()]);
    } else if (confirmed.current) {
      _optionalChain([deleteRef, 'access', _4 => _4.current, 'optionalAccess', _5 => _5.focus, 'call', _6 => _6()]);
    }
  }, [confirming]);
  const downloadBusy = downloading || downloadPending;
  const reanalyseBusy = reanalysing || reanalysePending;
  const iconSize = compact ? "xs" : "sm";
  const actionSize = compact ? "icon-xs" : "icon-compact";
  const confirmSize = compact ? "micro" : "compact";
  const kindBadge = kind ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _badge.Badge,
    {
      as: "span",
      variant: _nullishCoalesce(kind.tone, () => ( "default")),
      size: "micro-compact",
      shape: "rounded",
      transform: "uppercase",
      children: kind.label
    }
  ) : null;
  const metaLine = meta != null && meta !== false && meta !== "" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "micro", as: "span", tone: "muted", children: meta }) : null;
  const actions = confirming ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "xs", align: "center", shrink: false, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        type: "button",
        size: confirmSize,
        variant: "destructive",
        onClick: remove,
        disabled: deletePending,
        children: copy.confirmDelete
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        ref: cancelRef,
        type: "button",
        size: confirmSize,
        variant: "ghost",
        onClick: () => setConfirming(false),
        children: copy.cancelDelete
      }
    )
  ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: compact ? "lg" : "xs", align: "center", shrink: false, children: [
    onPreview && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: () => onPreview(),
        title: copy.preview,
        "aria-label": copy.actionName("preview", name),
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Eye, size: iconSize })
      }
    ),
    onDownload && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: download,
        disabled: downloadBusy,
        title: copy.download,
        "aria-label": copy.actionName("download", name),
        children: downloadBusy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: iconSize, spin: true }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Download, size: iconSize })
      }
    ),
    onReanalyse && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: reanalyse,
        disabled: reanalyseBusy,
        title: copy.reanalyse,
        "aria-label": copy.actionName("reanalyse", name),
        children: reanalyseBusy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: iconSize, spin: true }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.RefreshCw, size: iconSize })
      }
    ),
    onDelete && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _button.Button,
      {
        ref: deleteRef,
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: () => setConfirming(true),
        title: copy.delete,
        "aria-label": copy.actionName("delete", name),
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Trash2, size: iconSize })
      }
    )
  ] });
  if (compact) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _stack.Stack,
      {
        "data-slot": "document-list-item",
        direction: "horizontal",
        gap: "sm",
        align: "start",
        surface: "card",
        radius: "md",
        padding: "compact",
        ...props,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.File, size: "sm", tone: "muted", align: "start" }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, align: "baseline", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "span", size: "xs", weight: "medium", truncate: true, children: name }),
              kindBadge,
              metaLine
            ] }),
            summary ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "micro", tone: "muted", marginTop: "tight", leading: "snug", children: summary }) : processing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "micro", tone: "muted", marginTop: "tight", leading: "snug", display: "inline-flex", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "xs", spin: true }),
              copy.processing
            ] }) : null
          ] }),
          actions
        ]
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { "data-slot": "document-list-item", gap: "sm", surface: "card", radius: "md", padding: "compact", ...props, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", align: "start", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.File, size: "md", tone: "muted", align: "start" }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _flexitem.FlexItem, { grow: true, minWidth: "zero", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { variant: "inherit", as: "p", size: "sm", weight: "medium", truncate: true, children: name }),
        kindBadge || metaLine ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", gap: "sm", wrap: true, align: "baseline", marginTop: "xs", children: [
          kindBadge,
          metaLine
        ] }) : null
      ] }),
      actions
    ] }),
    summary ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { size: "xs", tone: "muted", children: summary }) : processing ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _text.Text, { size: "xs", tone: "muted", display: "inline-flex", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _icon.Icon, { icon: _lucidereact.Loader2, size: "xs", spin: true }),
      copy.processing
    ] }) : null
  ] });
}
function DocumentList({
  count,
  loading = false,
  empty = { title: "No documents yet" },
  density = "default",
  children,
  ...props
}) {
  const compact = density === "compact";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { "data-slot": "document-list", direction: "vertical", gap: compact ? "xs" : "sm", ...props, children: loading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _skeleton.Skeleton, { preset: compact ? "control" : "row" }) : count === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _emptystate.EmptyState,
    {
      variant: "empty",
      size: "inline",
      icon: _lucidereact.File,
      title: empty.title,
      description: _nullishCoalesce(empty.description, () => ( ""))
    }
  ) : children });
}
var PANEL_LABELS = {
  dropzone: "Drop documents, or choose files",
  uploading: "Uploading\u2026",
  kind: "Document kind"
};
function DocumentUploadPanel({
  title = "Documents",
  count,
  loading = false,
  error,
  onFiles,
  uploading = false,
  accept,
  kindSelect,
  empty,
  density = "default",
  border = "bottom",
  labels,
  children,
  ...props
}) {
  const copy = { ...PANEL_LABELS, ...labels };
  const compact = density === "compact";
  const titleId = _react.useId.call(void 0, );
  const select = kindSelect ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _select.Select,
    {
      value: kindSelect.value,
      onValueChange: (next) => kindSelect.onValueChange(next),
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _select.SelectTrigger,
          {
            controlSize: "sm",
            textSize: "xs",
            width: "sm",
            "aria-label": copy.kind,
            "data-slot": "document-kind-select",
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectValue, {})
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectContent, { children: kindSelect.options.map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _select.SelectItem, { value: option.value, size: "xs", children: option.label }, option.value)) })
      ]
    }
  ) : null;
  const dropzone = /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _filedropzone.FileDropzone,
    {
      multiple: true,
      onFiles,
      busy: uploading,
      accept,
      label: copy.dropzone,
      busyLabel: copy.uploading,
      description: copy.dropzoneDescription
    }
  );
  const list = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DocumentList, { count, loading, empty, density, children });
  if (compact) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      _panelsection.PanelSection,
      {
        "data-slot": "document-upload-panel",
        "aria-labelledby": titleId,
        border,
        ...props,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _sectionheader.SectionHeader,
            {
              id: titleId,
              label: title,
              count: !loading && count ? count : void 0,
              action: select
            }
          ),
          error ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.Alert, { variant: "destructive", radius: "md", padding: "compact", textSize: "xs", marginBottom: "md", children: error }) : null,
          dropzone,
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _stack.Stack, { marginTop: "sm", children: list })
        ]
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _stack.Stack,
    {
      as: "section",
      "data-slot": "document-upload-panel",
      "aria-labelledby": titleId,
      gap: "md",
      padding: "md",
      ...props,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _stack.Stack, { direction: "horizontal", justify: "between", align: "center", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _text.Text, { id: titleId, as: "h2", variant: "inherit", size: "sm", weight: "semibold", children: title }),
          select
        ] }),
        error ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _alert.Alert, { variant: "destructive", radius: "md", padding: "compact", textSize: "xs", children: error }) : null,
        dropzone,
        list
      ]
    }
  );
}






exports.formatFileSize = formatFileSize; exports.DocumentListItem = DocumentListItem; exports.DocumentList = DocumentList; exports.DocumentUploadPanel = DocumentUploadPanel;
