import * as react from 'react';
import { ReactNode, HTMLAttributes } from 'react';
import { DocumentPreviewProps } from '@epicbagel/saas-kit/primitives/document-preview';
import { C as CandidateEmptyCopy } from '../candidate-empty-copy-CZmg2ZoX.cjs';

/**
 * How tightly a document list sits: `default` for a page or tab of its own,
 * `compact` for a section inside a pane, such as a person's detail pane.
 */
type DocumentListDensity = "default" | "compact";
/** The kit Badge variant a document kind's badge takes. */
type DocumentKindTone = "default" | "info" | "success" | "warning";
/** What kind of document a row holds, such as a CV or a role brief, as a badge. */
interface DocumentKind {
    label: ReactNode;
    /** The badge's tone. Defaults to `default`. */
    tone?: DocumentKindTone;
}
/**
 * Formats a file size in bytes as "512 B", "180 KB" or "2.4 MB". A missing or
 * zero size reads as `empty` (an em dash by default).
 */
declare function formatFileSize(bytes: number | null | undefined, empty?: string): string;
/** A row action, as `DocumentListItemLabels.actionName` receives it. */
type DocumentListItemAction = "preview" | "download" | "reanalyse" | "delete";
interface DocumentListItemLabels {
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
interface DocumentListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
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
declare function DocumentListItem({ name, kind, meta, summary, processing, onPreview, onDownload, downloading, onReanalyse, reanalysing, onDelete, density, labels, ...props }: DocumentListItemProps): react.JSX.Element;
interface DocumentListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
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
declare function DocumentList({ count, loading, empty, density, children, ...props }: DocumentListProps): react.JSX.Element;
/** One kind a new upload can be filed as. */
interface DocumentKindOption<TValue extends string = string> {
    value: TValue;
    label: ReactNode;
}
/** The kind the next upload is filed as, picked in the panel's header. */
interface DocumentKindSelect<TValue extends string = string> {
    value: TValue;
    options: readonly DocumentKindOption<TValue>[];
    onValueChange: (value: TValue) => void;
}
interface DocumentUploadPanelLabels {
    /** The drop zone's main line. */
    dropzone: ReactNode;
    /** A muted line under it, such as what happens to an upload. */
    dropzoneDescription?: ReactNode;
    /** The drop zone's line while `uploading`, such as how many files are on their way. */
    uploading: ReactNode;
    /** The kind select's accessible name. */
    kind: string;
}
interface DocumentUploadPanelProps<TValue extends string = string> extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
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
declare function DocumentUploadPanel<TValue extends string = string>({ title, count, loading, error, onFiles, uploading, accept, kindSelect, empty, density, border, labels, preview, children, ...props }: DocumentUploadPanelProps<TValue>): react.JSX.Element;

export { type DocumentKind, type DocumentKindOption, type DocumentKindSelect, type DocumentKindTone, DocumentList, type DocumentListDensity, DocumentListItem, type DocumentListItemAction, type DocumentListItemLabels, type DocumentListItemProps, type DocumentListProps, DocumentUploadPanel, type DocumentUploadPanelLabels, type DocumentUploadPanelProps, formatFileSize };
