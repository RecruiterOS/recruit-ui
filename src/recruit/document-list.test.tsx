import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  DocumentList,
  DocumentListItem,
  DocumentUploadPanel,
  formatFileSize,
} from "./document-list";

// Fictional files, organisations and roles only.

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("formatFileSize", () => {
  it("reads bytes, kilobytes and megabytes, and a missing size as a dash", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(184_320)).toBe("180 KB");
    expect(formatFileSize(2_516_582)).toBe("2.4 MB");
    expect(formatFileSize(null)).toBe("—");
    expect(formatFileSize(0, "Unknown size")).toBe("Unknown size");
  });
});

describe("document list item", () => {
  it("shows the name, kind, meta and summary, and names each action after the file", () => {
    const { container } = render(
      <DocumentListItem
        name="harbourline-role-brief.pdf"
        kind={{ label: "Role brief", tone: "info" }}
        meta="242 KB · 6 days ago"
        summary="Senior platform engineer, hybrid in Leeds."
        onPreview={() => undefined}
        onDownload={() => undefined}
        onReanalyse={() => undefined}
        onDelete={() => undefined}
      />,
    );

    const row = container.firstElementChild as HTMLElement;
    expect(row).toHaveAttribute("data-slot", "document-list-item");
    expect(screen.getByText("harbourline-role-brief.pdf")).toBeInTheDocument();
    expect(screen.getByText("Role brief")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("242 KB · 6 days ago")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button").map((button) => button.getAttribute("aria-label")),
    ).toEqual([
      "Preview harbourline-role-brief.pdf",
      "Download harbourline-role-brief.pdf",
      "Re-analyse harbourline-role-brief.pdf",
      "Delete harbourline-role-brief.pdf",
    ]);
    expect(screen.getByRole("button", { name: "Preview harbourline-role-brief.pdf" })).toHaveAttribute(
      "title",
      "Preview document",
    );

    // The default row gives the summary the card's full width.
    const summary = screen.getByText("Senior platform engineer, hybrid in Leeds.");
    expect(summary.parentElement).toBe(row);
    expect(row.className).toContain("flex-col");
  });

  it("offers only the actions it is given", () => {
    render(<DocumentListItem name="notes.txt" onDelete={() => undefined} />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Delete notes.txt" })).toBeInTheDocument();
  });

  it("stands a processing line in for a missing summary", () => {
    const { rerender } = render(<DocumentListItem name="intake-call.md" processing labels={{ processing: "Reading it…" }} />);
    expect(screen.getByText("Reading it…")).toBeInTheDocument();

    rerender(<DocumentListItem name="intake-call.md" processing summary="Wants a hands-on lead." />);
    expect(screen.queryByText("Reading it…")).toBeNull();
    expect(screen.getByText("Wants a hands-on lead.")).toBeInTheDocument();

    rerender(<DocumentListItem name="intake-call.md" />);
    expect(screen.queryByText("Processing…")).toBeNull();
  });

  it("confirms a delete in the row and keeps focus with it", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<DocumentListItem name="old-cv.docx" onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete old-cv.docx" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: "Delete old-cv.docx" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Delete old-cv.docx" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("spins a button while the promise its callback returns is pending", async () => {
    const user = userEvent.setup();
    const work = deferred();
    render(<DocumentListItem name="cv.pdf" onReanalyse={() => work.promise} />);

    const button = screen.getByRole("button", { name: "Re-analyse cv.pdf" });
    await user.click(button);
    expect(button).toBeDisabled();

    work.resolve();
    await waitFor(() => expect(button).toBeEnabled());
  });

  it("shows a download in progress that the host started elsewhere", () => {
    render(<DocumentListItem name="cv.pdf" onDownload={() => undefined} downloading />);

    expect(screen.getByRole("button", { name: "Download cv.pdf" })).toBeDisabled();
  });

  it("is one dense row in compact density", () => {
    const { container } = render(
      <DocumentListItem name="cv.pdf" density="compact" summary="Eight years in platform teams." onDelete={() => undefined} />,
    );

    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain("flex-row");
    expect(screen.getByText("Eight years in platform teams.").className).toContain("leading-snug");
  });
});

describe("document list", () => {
  it("shows a skeleton while loading, the empty state at zero, and the rows otherwise", () => {
    const { container, rerender } = render(
      <DocumentList loading count={2}>
        <DocumentListItem name="a.pdf" />
      </DocumentList>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-slot", "document-list");
    expect(screen.queryByText("a.pdf")).toBeNull();

    rerender(
      <DocumentList count={0} empty={{ title: "No documents yet", description: "Drop a brief above." }}>
        {null}
      </DocumentList>,
    );
    expect(screen.getByText("No documents yet")).toBeInTheDocument();
    expect(screen.getByText("Drop a brief above.")).toBeInTheDocument();

    rerender(
      <DocumentList count={1}>
        <DocumentListItem name="a.pdf" />
      </DocumentList>,
    );
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
  });

  it("shows no empty state while the count is unknown", () => {
    render(<DocumentList>{null}</DocumentList>);

    expect(screen.queryByText("No documents yet")).toBeNull();
  });
});

describe("document upload panel", () => {
  it("is a section named by its title, with the drop zone, an error and the list", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const { container } = render(
      <DocumentUploadPanel
        title="Role documents"
        count={1}
        error="Upload failed"
        onFiles={onFiles}
        accept=".pdf"
        labels={{ dropzone: "Drop role documents", dropzoneDescription: "Each one adds to the brief." }}
      >
        <DocumentListItem name="brief.pdf" />
      </DocumentUploadPanel>,
    );

    const section = screen.getByRole("region", { name: "Role documents" });
    expect(section).toHaveAttribute("data-slot", "document-upload-panel");
    expect(screen.getByRole("heading", { name: "Role documents", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Upload failed")).toBeInTheDocument();
    expect(screen.getByText("Each one adds to the brief.")).toBeInTheDocument();
    expect(within(section).getByText("brief.pdf")).toBeInTheDocument();

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute("accept", ".pdf");
    expect(input.multiple).toBe(true);
    const file = new File(["fictional"], "scorecard.pdf", { type: "application/pdf" });
    await user.upload(input, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it("shows the uploading label while busy", () => {
    render(<DocumentUploadPanel onFiles={() => undefined} uploading labels={{ uploading: "Uploading 2 files…" }} />);

    expect(screen.getByText("Uploading 2 files…")).toBeInTheDocument();
    expect(screen.getByText("Uploading 2 files…").closest("button")).toBeDisabled();
  });

  it("offers a named select for the next upload's kind", () => {
    render(
      <DocumentUploadPanel
        onFiles={() => undefined}
        kindSelect={{
          value: "brief",
          options: [
            { value: "brief", label: "Role brief" },
            { value: "notes", label: "Intake notes" },
          ],
          onValueChange: () => undefined,
        }}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Document kind" });
    expect(trigger).toHaveAttribute("data-slot", "document-kind-select");
    expect(trigger).toHaveTextContent("Role brief");
  });

  it("counts the documents beside the title in compact density, never zero", () => {
    const { container, rerender } = render(
      <DocumentUploadPanel density="compact" count={2} onFiles={() => undefined}>
        <DocumentListItem name="a.pdf" density="compact" />
        <DocumentListItem name="b.pdf" density="compact" />
      </DocumentUploadPanel>,
    );

    const heading = screen.getByRole("heading", { name: /Documents/, level: 3 });
    expect(heading).toHaveTextContent("2");
    expect(container.firstElementChild?.className).toContain("border-b");

    rerender(<DocumentUploadPanel density="compact" count={0} onFiles={() => undefined} />);
    // Exactly "Documents": no count badge over an empty list.
    expect(screen.getByRole("heading", { name: "Documents", level: 3 })).toHaveTextContent(/^Documents$/);
    expect(screen.getByText("No documents yet")).toBeInTheDocument();
  });
});
