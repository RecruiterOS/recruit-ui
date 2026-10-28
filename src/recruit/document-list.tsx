"use client";

import { Alert } from "@epicbagel/saas-kit/primitives/alert";
import { Badge } from "@epicbagel/saas-kit/primitives/badge";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { DocumentPreview, type DocumentPreviewProps } from "@epicbagel/saas-kit/primitives/document-preview";
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
  SelectValue,
} from "@epicbagel/saas-kit/primitives/select";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { Download, Eye, File, Loader2, RefreshCw, Trash2 } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import type { CandidateEmptyCopy } from "./candidate-empty-copy";
import { usePendingAction } from "./pending-action";

/**
 * How tightly a document list sits: `default` for a page or tab of its own,
 * `compact` for a section inside a pane, such as a person's detail pane.
 */
export type DocumentListDensity = "default" | "compact";

/** The kit Badge variant a document kind's badge takes. */
export type DocumentKindTone = "default" | "info" | "success" | "warning";

/** What kind of document a row holds, such as a CV or a role brief, as a badge. */
export interface DocumentKind {
  label: ReactNode;
  /** The badge's tone. Defaults to `default`. */
  tone?: DocumentKindTone;
}

/**
 * Formats a file size in bytes as "512 B", "180 KB" or "2.4 MB". A missing or
 * zero size reads as `empty` (an em dash by default).
 */
export function formatFileSize(bytes: number | null | undefined, empty = "—"): string {
  if (!bytes) return empty;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** A row action, as `DocumentListItemLabels.actionName` receives it. */
export type DocumentListItemAction = "preview" | "download" | "reanalyse" | "delete";

export interface DocumentListItemLabels {
  /** The preview button's tooltip. */
  preview: string;
  /** The download button's tooltip. */
  download: string;
  /** The re-analyse button's tooltip. */
  reanalyse: string;
  /** The delete button's tooltip. */
  delete: string;
  /** Each action button's accessible name, for the file it acts on. */
  actionName: (action: DocumentListItemAction, name: string) => string;
  /** The button that confirms a delete. */
  confirmDelete: ReactNode;
  /** The button that backs out of a delete. */
  cancelDelete: ReactNode;
  /** Beside the spinner while the document is still being read. */
  processing: ReactNode;
}

const ACTION_VERB: Record<DocumentListItemAction, string> = {
  preview: "Preview",
  download: "Download",
  reanalyse: "Re-analyse",
  delete: "Delete",
};

const ITEM_LABELS: DocumentListItemLabels = {
  preview: "Preview document",
  download: "Download document",
  reanalyse: "Re-analyse document",
  delete: "Delete document",
  actionName: (action, name) => `${ACTION_VERB[action]} ${name}`,
  confirmDelete: "Delete",
  cancelDelete: "Cancel",
  processing: "Processing…",
};

export interface DocumentListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The file name. It is the row's title and names each action for screen readers. */
  name: string;
  /** What kind of document this is, as a badge after the name. */
  kind?: DocumentKind;
  /** A muted line beside the kind, such as the size and when it was added. */
  meta?: ReactNode;
  /** A short summary of what the document says, under the name. */
  summary?: ReactNode;
  /** Still being read: a spinner and `labels.processing` stand in for a missing `summary`. */
  processing?: boolean;
  /** Adds a preview button, such as for a file the host can show inline. */
  onPreview?: () => void;
  /** Adds a download button. A returned promise shows a spinner until it settles. */
  onDownload?: () => void | Promise<unknown>;
  /** Shows the download button's spinner, such as while another control downloads the file. */
  downloading?: boolean;
  /** Adds a re-analyse button. A returned promise shows a spinner until it settles. */
  onReanalyse?: () => void | Promise<unknown>;
  /** Shows the re-analyse button's spinner. */
  reanalysing?: boolean;
  /**
   * Adds a delete button, which asks to confirm in the row before calling
   * this. A returned promise disables the confirm button until it settles.
   */
  onDelete?: () => void | Promise<unknown>;
  density?: DocumentListDensity;
  labels?: Partial<DocumentListItemLabels>;
}

/**
 * One document: a file glyph, the name, its kind as a badge and the host's
 * `meta` line, then a summary or a processing state, with preview, download,
 * re-analyse and delete buttons for the callbacks given. Delete asks to
 * confirm in the row first. `compact` is one dense row for a pane; `default`
 * gives the summary the row's full width.
 *
 * The root is marked `data-slot="document-list-item"`.
 */
export function DocumentListItem({
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
}: DocumentListItemProps) {
  const copy = { ...ITEM_LABELS, ...labels };
  const compact = density === "compact";
  const [confirming, setConfirming] = useState(false);
  const [downloadPending, download] = usePendingAction(onDownload);
  const [reanalysePending, reanalyse] = usePendingAction(onReanalyse);
  const [deletePending, remove] = usePendingAction(onDelete);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmed = useRef(false);

  // Keep focus with the row: on Cancel when the confirm opens, back on the
  // delete button when it closes.
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

  const kindBadge = kind ? (
    <Badge
      as="span"
      variant={kind.tone ?? "default"}
      size="micro-compact"
      shape="rounded"
      transform="uppercase"
    >
      {kind.label}
    </Badge>
  ) : null;
  const metaLine = meta != null && meta !== false && meta !== "" ? (
    <Text variant="micro" as="span" tone="muted">{meta}</Text>
  ) : null;

  const actions = confirming ? (
    <Stack direction="horizontal" gap="xs" align="center" shrink={false}>
      <Button
        type="button"
        size={confirmSize}
        variant="destructive"
        onClick={remove}
        disabled={deletePending}
      >
        {copy.confirmDelete}
      </Button>
      <Button
        ref={cancelRef}
        type="button"
        size={confirmSize}
        variant="ghost"
        onClick={() => setConfirming(false)}
      >
        {copy.cancelDelete}
      </Button>
    </Stack>
  ) : (
    <Stack direction="horizontal" gap={compact ? "lg" : "xs"} align="center" shrink={false}>
      {onPreview && (
        <Button
          type="button"
          size={actionSize}
          variant="ghost"
          onClick={() => onPreview()}
          title={copy.preview}
          aria-label={copy.actionName("preview", name)}
        >
          <Icon icon={Eye} size={iconSize} />
        </Button>
      )}
      {onDownload && (
        <Button
          type="button"
          size={actionSize}
          variant="ghost"
          onClick={download}
          disabled={downloadBusy}
          title={copy.download}
          aria-label={copy.actionName("download", name)}
        >
          {downloadBusy ? <Icon icon={Loader2} size={iconSize} spin /> : <Icon icon={Download} size={iconSize} />}
        </Button>
      )}
      {onReanalyse && (
        <Button
          type="button"
          size={actionSize}
          variant="ghost"
          onClick={reanalyse}
          disabled={reanalyseBusy}
          title={copy.reanalyse}
          aria-label={copy.actionName("reanalyse", name)}
        >
          {reanalyseBusy ? <Icon icon={Loader2} size={iconSize} spin /> : <Icon icon={RefreshCw} size={iconSize} />}
        </Button>
      )}
      {onDelete && (
        <Button
          ref={deleteRef}
          type="button"
          size={actionSize}
          variant="ghost"
          onClick={() => setConfirming(true)}
          title={copy.delete}
          aria-label={copy.actionName("delete", name)}
        >
          <Icon icon={Trash2} size={iconSize} />
        </Button>
      )}
    </Stack>
  );

  if (compact) {
    return (
      <Stack
        data-slot="document-list-item"
        direction="horizontal"
        gap="sm"
        align="start"
        surface="card"
        radius="md"
        padding="compact"
        {...props}
      >
        <Icon icon={File} size="sm" tone="muted" align="start" />
        <FlexItem grow minWidth="zero">
          <Stack direction="horizontal" gap="sm" wrap align="baseline">
            <Text variant="inherit" as="span" size="xs" weight="medium" truncate>{name}</Text>
            {kindBadge}
            {metaLine}
          </Stack>
          {summary ? (
            <Text size="micro" tone="muted" marginTop="tight" leading="snug">{summary}</Text>
          ) : processing ? (
            <Text size="micro" tone="muted" marginTop="tight" leading="snug" display="inline-flex">
              <Icon icon={Loader2} size="xs" spin />
              {copy.processing}
            </Text>
          ) : null}
        </FlexItem>
        {actions}
      </Stack>
    );
  }

  return (
    <Stack data-slot="document-list-item" gap="sm" surface="card" radius="md" padding="compact" {...props}>
      <Stack direction="horizontal" gap="sm" align="start">
        <Icon icon={File} size="md" tone="muted" align="start" />
        <FlexItem grow minWidth="zero">
          <Text variant="inherit" as="p" size="sm" weight="medium" truncate>{name}</Text>
          {kindBadge || metaLine ? (
            <Stack direction="horizontal" gap="sm" wrap align="baseline" marginTop="xs">
              {kindBadge}
              {metaLine}
            </Stack>
          ) : null}
        </FlexItem>
        {actions}
      </Stack>
      {summary ? (
        <Text size="xs" tone="muted">{summary}</Text>
      ) : processing ? (
        <Text size="xs" tone="muted" display="inline-flex">
          <Icon icon={Loader2} size="xs" spin />
          {copy.processing}
        </Text>
      ) : null}
    </Stack>
  );
}

export interface DocumentListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * How many documents there are. Zero shows the empty state in place of the
   * rows. Left out, such as before the first load succeeds, the list shows
   * only what `children` holds.
   */
  count?: number;
  /** A skeleton row in place of the list. */
  loading?: boolean;
  /** The blank slate's wording. Defaults to "No documents yet". */
  empty?: CandidateEmptyCopy;
  density?: DocumentListDensity;
  /** The documents, usually DocumentListItems with the same `density`. */
  children?: ReactNode;
}

/**
 * The documents one after another: a skeleton row while they load, the
 * host's rows, or the kit's empty state when there are none.
 *
 * The root is marked `data-slot="document-list"`.
 */
export function DocumentList({
  count,
  loading = false,
  empty = { title: "No documents yet" },
  density = "default",
  children,
  ...props
}: DocumentListProps) {
  const compact = density === "compact";
  return (
    <Stack data-slot="document-list" direction="vertical" gap={compact ? "xs" : "sm"} {...props}>
      {loading ? (
        <Skeleton preset={compact ? "control" : "row"} />
      ) : count === 0 ? (
        <EmptyState
          variant="empty"
          size="inline"
          icon={File}
          title={empty.title}
          // Without host wording, no description: the kit's generic one
          // ("Get started by creating...") doesn't fit a document list.
          description={empty.description ?? ""}
        />
      ) : (
        children
      )}
    </Stack>
  );
}

/** One kind a new upload can be filed as. */
export interface DocumentKindOption<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
}

/** The kind the next upload is filed as, picked in the panel's header. */
export interface DocumentKindSelect<TValue extends string = string> {
  value: TValue;
  options: readonly DocumentKindOption<TValue>[];
  onValueChange: (value: TValue) => void;
}

export interface DocumentUploadPanelLabels {
  /** The drop zone's main line. */
  dropzone: ReactNode;
  /** A muted line under it, such as what happens to an upload. */
  dropzoneDescription?: ReactNode;
  /** The drop zone's line while `uploading`, such as how many files are on their way. */
  uploading: ReactNode;
  /** The kind select's accessible name. */
  kind: string;
}

const PANEL_LABELS: DocumentUploadPanelLabels = {
  dropzone: "Drop documents, or choose files",
  uploading: "Uploading…",
  kind: "Document kind",
};

export interface DocumentUploadPanelProps<TValue extends string = string>
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** The section heading. Defaults to "Documents". */
  title?: ReactNode;
  /**
   * How many documents there are, as DocumentList takes it. The compact
   * header shows it beside the title while it is above zero.
   */
  count?: number;
  /** A skeleton row in place of the list, and no count yet. */
  loading?: boolean;
  /** A failed load, upload or delete, above the drop zone. */
  error?: ReactNode;
  /** Called with the files a person drops or picks; the host uploads them. */
  onFiles: (files: File[]) => void | Promise<void>;
  /** Shows the drop zone busy, with `labels.uploading`. */
  uploading?: boolean;
  /** The file types the picker offers, as the input's `accept`. */
  accept?: string;
  /** Adds a select to the header for the kind the next upload is filed as. */
  kindSelect?: DocumentKindSelect<TValue>;
  /** The blank slate's wording. Defaults to "No documents yet". */
  empty?: CandidateEmptyCopy;
  density?: DocumentListDensity;
  /** The compact panel's divider, as the kit PanelSection takes it. Defaults to `bottom`. */
  border?: "none" | "top" | "bottom";
  labels?: Partial<DocumentUploadPanelLabels>;
  /** Controlled document preview. The host owns URL loading, authorization and download callbacks. */
  preview?: DocumentPreviewProps;
  /** The documents, usually DocumentListItems with the same `density`. */
  children?: ReactNode;
}

/**
 * A documents section: a heading, an optional select for the kind of the
 * next upload, an error, the kit's drop zone and the DocumentList under it.
 * The host uploads what is dropped, loads the list and renders each row.
 * `compact` is a counted section with a divider for a pane; `default` is a
 * padded section for a page or tab of its own.
 *
 * The root is a section named by its title and marked
 * `data-slot="document-upload-panel"`.
 */
export function DocumentUploadPanel<TValue extends string = string>({
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
}: DocumentUploadPanelProps<TValue>) {
  const copy = { ...PANEL_LABELS, ...labels };
  const compact = density === "compact";
  const titleId = useId();

  const select = kindSelect ? (
    <Select
      value={kindSelect.value}
      onValueChange={(next) => kindSelect.onValueChange(next as TValue)}
    >
      <SelectTrigger
        controlSize="sm"
        textSize="xs"
        width="sm"
        aria-label={copy.kind}
        data-slot="document-kind-select"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {kindSelect.options.map((option) => (
          <SelectItem key={option.value} value={option.value} size="xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : null;

  const dropzone = (
    <FileDropzone
      multiple
      onFiles={onFiles}
      busy={uploading}
      accept={accept}
      label={copy.dropzone}
      busyLabel={copy.uploading}
      description={copy.dropzoneDescription}
    />
  );

  const list = (
    <DocumentList count={count} loading={loading} empty={empty} density={density}>
      {children}
    </DocumentList>
  );

  if (compact) {
    return (
      <PanelSection
        data-slot="document-upload-panel"
        aria-labelledby={titleId}
        border={border}
        {...props}
      >
        <SectionHeader
          id={titleId}
          label={title}
          count={!loading && count ? count : undefined}
          action={select}
        />
        {error ? (
          <Alert variant="destructive" radius="md" padding="compact" textSize="xs" marginBottom="md">
            {error}
          </Alert>
        ) : null}
        {dropzone}
        <Stack marginTop="sm">{list}</Stack>
        {preview && <DocumentPreview {...preview} />}
      </PanelSection>
    );
  }

  return (
    <Stack
      as="section"
      data-slot="document-upload-panel"
      aria-labelledby={titleId}
      gap="md"
      padding="md"
      {...props}
    >
      <Stack direction="horizontal" justify="between" align="center">
        <Text id={titleId} as="h2" variant="inherit" size="sm" weight="semibold">{title}</Text>
        {select}
      </Stack>
      {error ? (
        <Alert variant="destructive" radius="md" padding="compact" textSize="xs">
          {error}
        </Alert>
      ) : null}
      {dropzone}
      {list}
      {preview && <DocumentPreview {...preview} />}
    </Stack>
  );
}
