import * as react from 'react';
import { ReactNode } from 'react';

/** Someone a link can be made for, as the dialog offers them. */
interface CandidateShareAudience {
    /** Tells the audience from the others, and tells the host which was picked. */
    id: string;
    /** Its name on the picker, such as "The client". */
    label: string;
    /** What that audience sees when they open the link, under the picker. */
    description?: ReactNode;
    /**
     * Further fields this audience's link needs, such as where they book a
     * call, under the description. The host draws them and holds what is
     * typed in them: the dialog passes none of it to `onShare`.
     */
    fields?: ReactNode;
    /** `false` holds the share button until the audience's own fields are filled in. */
    ready?: boolean;
    /**
     * A link for this audience is already live. Its chip says so. Unless the
     * host also passes that link as `url`, the dialog says so in place of
     * everything it would ask for that audience, and makes no second one.
     */
    live?: boolean;
    /** What to say about the live link, in place of `labels.live`. */
    liveDescription?: ReactNode;
}
/** The two sides of the note: a recording, or typed words. */
type CandidateShareNoteFormat = "voice" | "written";
/** What the person sharing chose, as `onShare` is given it. */
interface CandidateShareChoices {
    /** Who the link is for: the `id` of one of `audiences`, or nothing when the dialog offers none. */
    audience?: string;
    /** The page hides who the person is. Always `false` unless the dialog is `anonymisable`. */
    anonymised: boolean;
    /** The typed note for whoever opens the link, trimmed, or an empty string. */
    note: string;
}
/** The fixed words of the share dialog. Pass `labels` to change any. */
interface CandidateShareDialogLabels {
    /**
     * The dialog's title, given who is being shared. It is where the person
     * is named: the summary beside it is their face and `headline`, and says
     * the name no second time.
     */
    title: (name: string) => ReactNode;
    /** A line under the title, which also describes the dialog to a screen reader. None by default. */
    description: ReactNode;
    /** Over the sharer's own reason, under the summary. */
    reason: ReactNode;
    /** Over the audiences, and their group's accessible name. */
    audience: string;
    /** On the chip of an audience with a live link. */
    liveBadge: ReactNode;
    /** Under the picker, for an audience whose live link the dialog wasn't given. */
    live: ReactNode;
    /** Over the choice between a named page and an anonymised one, and its accessible name. */
    visibility: string;
    /** The named choice, and the line under it. */
    named: ReactNode;
    namedDescription: ReactNode;
    /** The anonymised choice, and the line under it. */
    anonymised: ReactNode;
    anonymisedDescription: ReactNode;
    /** Over the note, and the note field's accessible name. */
    note: string;
    /** Under the note field. */
    noteDescription: ReactNode;
    /** The note field, while it is empty. */
    notePlaceholder: string;
    /** The accessible name of the switch between a spoken note and a written one. */
    noteFormat: string;
    /** That switch's two sides. */
    voiceNote: ReactNode;
    writtenNote: ReactNode;
    /** Over the link, and the link field's accessible name. */
    link: string;
    /** The share button before there is a link, given whether sharing also copies it. */
    create: (copies: boolean) => ReactNode;
    /** The share button where the host already has a link for these choices. */
    update: (copies: boolean) => ReactNode;
    /** The share button while the host makes the link. */
    sharing: ReactNode;
    /** Said once the link is made. */
    ready: string;
    /** The copy button. */
    copy: ReactNode;
    /** The copy button once the link is on the clipboard. */
    copied: ReactNode;
    /** Said once the link is on the clipboard. */
    linkCopied: string;
    /** Said when the browser wouldn't take the link, which is then selected to copy by hand. */
    copyFailed: string;
    /** Closes the dialog once the link is made. */
    done: ReactNode;
    /** A link that couldn't be made, given what the host's promise rejected with. */
    failed: (cause: unknown) => string;
}
/** The default wording of the share dialog. Pass `labels` to change any of it. */
declare const candidateShareDialogLabels: Readonly<CandidateShareDialogLabels>;
/**
 * A link as a person reads it: without its scheme, a leading "www." or a
 * trailing slash, and cut with an ellipsis once it runs past `maxLength`
 * characters. The whole link is what is copied.
 */
declare function candidateShareLinkText(url: string, maxLength?: number): string;
interface CandidateShareDialogProps {
    open: boolean;
    /** Called when the dialog should close: from its close control, Done, or a share that made no link to show. */
    onOpenChange: (open: boolean) => void;
    /** Who is being shared, for the title. */
    candidateName: string;
    /** Their face beside the title, usually the kit's PersonAvatar at 44px. */
    avatar?: ReactNode;
    /** Under the title, such as their title and company. */
    headline?: ReactNode;
    /** The sharer's own reason for putting them forward, under the title. */
    reason?: ReactNode;
    /**
     * Who the link can be for. With none, the dialog doesn't ask, and
     * `onShare` gets no `audience`.
     */
    audiences?: readonly CandidateShareAudience[];
    /** Offers the choice between a page that names the person and one that doesn't. */
    anonymisable?: boolean;
    /** Offers a typed note for whoever opens the link. */
    note?: boolean;
    /** The longest note the field takes. */
    noteMaxLength?: number;
    /**
     * A recorder for a spoken note, such as `CandidatePresentationRecorder`.
     * The host owns the recording and what happens to it. With `note` as
     * well, the two sit behind a switch, the recorder first, and the one not
     * showing stays mounted, so a take is never lost to the switch. A side
     * shows when its tab is pressed, with a pointer, Enter or Space; the
     * arrow keys move between the two tabs and change nothing.
     */
    recorder?: ReactNode;
    /**
     * Which side of that switch shows as the dialog opens: `voice` (the
     * default), or `written` for a link that already has a typed note and no
     * recording. It is read as each opening starts; a host that learns the
     * side later holds it as `noteFormat`.
     */
    defaultNoteFormat?: CandidateShareNoteFormat;
    /**
     * Which side of that switch shows, for a host that holds it, such as one
     * that learns which side a link's note is on only once it has read its
     * links, or as the person sharing changes who the link names. Changing it
     * remounts neither side, so a take in the recorder is kept, and leaves
     * focus where it is.
     */
    noteFormat?: CandidateShareNoteFormat;
    /**
     * Called with the side the person sharing asks for, once each time they
     * press the other side's tab, whether or not the host holds the side.
     */
    onNoteFormatChange?: (format: CandidateShareNoteFormat) => void;
    /**
     * The choices, for a host that holds them, such as one that fills the
     * note in from a link it already has. Any left out are the dialog's own.
     */
    choices?: Partial<CandidateShareChoices>;
    /** Where the dialog's own choices start each time it opens. */
    defaultChoices?: Partial<CandidateShareChoices>;
    /** Called with every choice as it changes. */
    onChoicesChange?: (choices: CandidateShareChoices) => void;
    /**
     * The link, where the host already has one for these choices. The dialog
     * shows it with Copy above everything it asks, where it is in view as the
     * dialog opens, and the share button then says `labels.update`. With no
     * `onShare`, the dialog is the link and its Copy alone.
     */
    url?: string | null;
    /**
     * Makes the link. It is given the choices and returns the link, or a
     * promise for it; the dialog holds its controls meanwhile and then shows
     * the link with Copy. A promise that resolves with no link closes the
     * dialog, for a host that shows the link somewhere else. One that rejects
     * keeps the dialog as it was, with `labels.failed`.
     */
    onShare?: (choices: CandidateShareChoices) => string | void | PromiseLike<string | void>;
    /**
     * Copies the link in the same click that makes it. The clipboard is asked
     * inside that click, for a link that arrives later; a browser that
     * refuses leaves the link with its Copy button.
     */
    copyOnShare?: boolean;
    /**
     * What sharing is waiting for, such as a recording that is still
     * uploading ("Finish the voice note to share"). It shows on the share
     * button, which is held until it clears.
     */
    waitingFor?: ReactNode;
    /** An error of the host's own, such as a link that couldn't be read, over the share button. */
    error?: ReactNode;
    labels?: Partial<CandidateShareDialogLabels>;
}
/**
 * Makes a link to a candidate's profile and hands it over: who is being
 * shared, who the link is for, whether the page names them, a note for
 * whoever opens it, then the link with Copy.
 *
 * Each part is optional. `avatar` and `headline` sit with the title, which
 * names the person, and `reason` under them. `audiences` asks who the link
 * is for: each has its own description, its own fields as a slot, and may
 * already have a live link. `anonymisable` asks whether the page names the
 * person. `note` is a typed note and `recorder` a slot for a spoken one;
 * with both, a switch shows one side at a time, which the host may hold as
 * `noteFormat`.
 *
 * The host makes the link. `onShare` is given the choices and returns the
 * link, or a promise for it; the dialog then shows the link, cut short, with
 * Copy. A host that already has the link passes it as `url`, and it shows
 * above everything the dialog asks, in view as the dialog opens. Copy
 * writes to the clipboard inside its own click, says "Copied" and announces
 * it; where the browser refuses, the whole link is put in a field and
 * selected, to copy by hand. `copyOnShare` asks the clipboard in the click
 * that makes the link.
 *
 * It fetches nothing and stores nothing: every opening starts from
 * `defaultChoices`, and a host that keeps a link's note or audience passes
 * them as `choices`. What it holds for one opening survives the window
 * narrowing or widening across the kit's switch between a dialog and a
 * bottom sheet.
 *
 * It is the kit's responsive dialog (a centred dialog, or a bottom sheet on
 * a phone), which keeps the kit's `data-slot` on its content; the dialog's
 * own body is marked `data-slot="candidate-share-dialog"`, with `data-view`
 * (`compose` or `result`). The centred dialog may be as tall as the window,
 * less a margin, so what it asks fits a laptop without scrolling; past
 * that, its body scrolls between the title and the share button.
 */
declare function CandidateShareDialog(props: CandidateShareDialogProps): react.JSX.Element;

export { type CandidateShareAudience, type CandidateShareChoices, CandidateShareDialog, type CandidateShareDialogLabels, type CandidateShareDialogProps, type CandidateShareNoteFormat, candidateShareDialogLabels, candidateShareLinkText };
