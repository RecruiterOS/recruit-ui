import {
  usePendingAction
} from "./chunk-SBRXJRL4.js";

// src/recruit/document-list.tsx
import { Alert } from "@epicbagel/saas-kit/primitives/alert";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { DocumentPreview } from "@epicbagel/saas-kit/primitives/document-preview";
import { EmptyState } from "@epicbagel/saas-kit/primitives/empty-state";
import { FileDropzone } from "@epicbagel/saas-kit/primitives/file-dropzone";
import { FlexItem } from "@epicbagel/saas-kit/primitives/flex-item";
import { Icon } from "@epicbagel/saas-kit/primitives/icon";
import { PanelSection } from "@epicbagel/saas-kit/primitives/panel-section";
import { SectionHeader } from "@epicbagel/saas-kit/primitives/section-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@epicbagel/saas-kit/primitives/select";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Download, Eye, File, Loader2, RefreshCw, Trash2 } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const [confirming, setConfirming] = useState(false);
  const [downloadPending, download] = usePendingAction(onDownload);
  const [reanalysePending, reanalyse] = usePendingAction(onReanalyse);
  const [deletePending, remove] = usePendingAction(onDelete);
  const deleteRef = useRef(null);
  const cancelRef = useRef(null);
  const confirmed = useRef(false);
  useEffect(() => {
    if (confirming) {
      confirmed.current = true;
      cancelRef.current?.focus();
    } else if (confirmed.current) {
      deleteRef.current?.focus();
    }
  }, [confirming]);
  const downloadBusy = downloading || downloadPending;
  const reanalyseBusy = reanalysing || reanalysePending;
  const iconSize = compact ? "xs" : "sm";
  const actionSize = compact ? "icon-xs" : "icon-compact";
  const confirmSize = compact ? "micro" : "compact";
  const kindBadge = kind ? /* @__PURE__ */ jsx(
    Badge,
    {
      as: "span",
      variant: kind.tone ?? "default",
      size: "micro-compact",
      shape: "rounded",
      transform: "uppercase",
      children: kind.label
    }
  ) : null;
  const metaLine = meta != null && meta !== false && meta !== "" ? /* @__PURE__ */ jsx(Text, { variant: "micro", as: "span", tone: "muted", children: meta }) : null;
  const actions = confirming ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "xs", align: "center", shrink: false, children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        size: confirmSize,
        variant: "destructive",
        onClick: remove,
        disabled: deletePending,
        children: copy.confirmDelete
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        ref: cancelRef,
        type: "button",
        size: confirmSize,
        variant: "ghost",
        onClick: () => setConfirming(false),
        children: copy.cancelDelete
      }
    )
  ] }) : /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: compact ? "lg" : "xs", align: "center", shrink: false, children: [
    onPreview && /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: () => onPreview(),
        title: copy.preview,
        "aria-label": copy.actionName("preview", name),
        children: /* @__PURE__ */ jsx(Icon, { icon: Eye, size: iconSize })
      }
    ),
    onDownload && /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: download,
        disabled: downloadBusy,
        title: copy.download,
        "aria-label": copy.actionName("download", name),
        children: downloadBusy ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: iconSize, spin: true }) : /* @__PURE__ */ jsx(Icon, { icon: Download, size: iconSize })
      }
    ),
    onReanalyse && /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: reanalyse,
        disabled: reanalyseBusy,
        title: copy.reanalyse,
        "aria-label": copy.actionName("reanalyse", name),
        children: reanalyseBusy ? /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: iconSize, spin: true }) : /* @__PURE__ */ jsx(Icon, { icon: RefreshCw, size: iconSize })
      }
    ),
    onDelete && /* @__PURE__ */ jsx(
      Button,
      {
        ref: deleteRef,
        type: "button",
        size: actionSize,
        variant: "ghost",
        onClick: () => setConfirming(true),
        title: copy.delete,
        "aria-label": copy.actionName("delete", name),
        children: /* @__PURE__ */ jsx(Icon, { icon: Trash2, size: iconSize })
      }
    )
  ] });
  if (compact) {
    return /* @__PURE__ */ jsxs(
      Stack,
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
          /* @__PURE__ */ jsx(Icon, { icon: File, size: "sm", tone: "muted", align: "start" }),
          /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
            /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", wrap: true, align: "baseline", children: [
              /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "span", size: "xs", weight: "medium", truncate: true, children: name }),
              kindBadge,
              metaLine
            ] }),
            summary ? /* @__PURE__ */ jsx(Text, { size: "micro", tone: "muted", marginTop: "tight", leading: "snug", children: summary }) : processing ? /* @__PURE__ */ jsxs(Text, { size: "micro", tone: "muted", marginTop: "tight", leading: "snug", display: "inline-flex", children: [
              /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "xs", spin: true }),
              copy.processing
            ] }) : null
          ] }),
          actions
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(Stack, { "data-slot": "document-list-item", gap: "sm", surface: "card", radius: "md", padding: "compact", ...props, children: [
    /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", align: "start", children: [
      /* @__PURE__ */ jsx(Icon, { icon: File, size: "md", tone: "muted", align: "start" }),
      /* @__PURE__ */ jsxs(FlexItem, { grow: true, minWidth: "zero", children: [
        /* @__PURE__ */ jsx(Text, { variant: "inherit", as: "p", size: "sm", weight: "medium", truncate: true, children: name }),
        kindBadge || metaLine ? /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", gap: "sm", wrap: true, align: "baseline", marginTop: "xs", children: [
          kindBadge,
          metaLine
        ] }) : null
      ] }),
      actions
    ] }),
    summary ? /* @__PURE__ */ jsx(Text, { size: "xs", tone: "muted", children: summary }) : processing ? /* @__PURE__ */ jsxs(Text, { size: "xs", tone: "muted", display: "inline-flex", children: [
      /* @__PURE__ */ jsx(Icon, { icon: Loader2, size: "xs", spin: true }),
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
  return /* @__PURE__ */ jsx(Stack, { "data-slot": "document-list", direction: "vertical", gap: compact ? "xs" : "sm", ...props, children: loading ? /* @__PURE__ */ jsx(Skeleton, { preset: compact ? "control" : "row" }) : count === 0 ? /* @__PURE__ */ jsx(
    EmptyState,
    {
      variant: "empty",
      size: "inline",
      icon: File,
      title: empty.title,
      description: empty.description ?? ""
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
  preview,
  children,
  ...props
}) {
  const copy = { ...PANEL_LABELS, ...labels };
  const compact = density === "compact";
  const titleId = useId();
  const select = kindSelect ? /* @__PURE__ */ jsxs(
    Select,
    {
      value: kindSelect.value,
      onValueChange: (next) => kindSelect.onValueChange(next),
      children: [
        /* @__PURE__ */ jsx(
          SelectTrigger,
          {
            controlSize: "sm",
            textSize: "xs",
            width: "sm",
            "aria-label": copy.kind,
            "data-slot": "document-kind-select",
            children: /* @__PURE__ */ jsx(SelectValue, {})
          }
        ),
        /* @__PURE__ */ jsx(SelectContent, { children: kindSelect.options.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, size: "xs", children: option.label }, option.value)) })
      ]
    }
  ) : null;
  const dropzone = /* @__PURE__ */ jsx(
    FileDropzone,
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
  const list = /* @__PURE__ */ jsx(DocumentList, { count, loading, empty, density, children });
  if (compact) {
    return /* @__PURE__ */ jsxs(
      PanelSection,
      {
        "data-slot": "document-upload-panel",
        "aria-labelledby": titleId,
        border,
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            SectionHeader,
            {
              id: titleId,
              label: title,
              count: !loading && count ? count : void 0,
              action: select
            }
          ),
          error ? /* @__PURE__ */ jsx(Alert, { variant: "destructive", radius: "md", padding: "compact", textSize: "xs", marginBottom: "md", children: error }) : null,
          dropzone,
          /* @__PURE__ */ jsx(Stack, { marginTop: "sm", children: list }),
          preview && /* @__PURE__ */ jsx(DocumentPreview, { ...preview })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      as: "section",
      "data-slot": "document-upload-panel",
      "aria-labelledby": titleId,
      gap: "md",
      padding: "md",
      ...props,
      children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "horizontal", justify: "between", align: "center", children: [
          /* @__PURE__ */ jsx(Text, { id: titleId, as: "h2", variant: "inherit", size: "sm", weight: "semibold", children: title }),
          select
        ] }),
        error ? /* @__PURE__ */ jsx(Alert, { variant: "destructive", radius: "md", padding: "compact", textSize: "xs", children: error }) : null,
        dropzone,
        list,
        preview && /* @__PURE__ */ jsx(DocumentPreview, { ...preview })
      ]
    }
  );
}

export {
  formatFileSize,
  DocumentListItem,
  DocumentList,
  DocumentUploadPanel
};
