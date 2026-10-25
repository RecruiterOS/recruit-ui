import * as react from 'react';
import { HTMLAttributes, ReactNode } from 'react';

/** A channel a message can be drafted for. */
interface CandidateOutreachChannel<TValue extends string = string> {
    value: TValue;
    /** The channel's name, on its button and in the default wording. */
    label: string;
}
/**
 * The house style a draft follows on the current channel, which a person
 * can edit in place. The host keeps the edit's state and saves it.
 */
interface CandidateOutreachGuidance {
    /** The guidance in force, shown on one truncated line. */
    text: ReactNode;
    /** Marks the guidance as changed from your default. */
    custom?: boolean;
    /** Shows the editor in place of the line. */
    editing: boolean;
    /** The editor's text. */
    value: string;
    /** Shows a spinner on Save and disables it. */
    saving?: boolean;
    /** Set false to disable Save, for example when there is nowhere to save to. */
    canSave?: boolean;
    /** Opens the editor; seed `value` with the guidance in force. */
    onEdit: () => void;
    onChange: (value: string) => void;
    /** Puts your default back in the editor. */
    onReset: () => void;
    onSave: () => void;
    onCancel: () => void;
}
/** A drafted message, which a person can edit before copying it. */
interface CandidateOutreachDraft {
    /** Shown above the message, for channels that have one. */
    subject?: ReactNode;
    message: string;
    /** The tone the draft took, shown beside Redo and Copy. */
    tone?: ReactNode;
}
interface CandidateOutreachComposerLabels {
    title: ReactNode;
    /** The editor's heading, from the channel's label. Shown in capitals. */
    guidanceHeading: (channel: string) => ReactNode;
    reset: string;
    cancel: string;
    save: string;
    /** The badge on custom guidance. */
    custom: string;
    /** The draft button, from the channel's label. */
    draft: (channel: string) => string;
    drafting: string;
    /** Before the subject. */
    subject: string;
    /** Before the tone. */
    tone: string;
    redo: string;
    copy: string;
    copied: string;
}
interface CandidateOutreachComposerProps<TValue extends string = string> extends Omit<HTMLAttributes<HTMLElement>, "title" | "children" | "onCopy"> {
    /** The channels, in order, as buttons in the header. */
    channels: readonly CandidateOutreachChannel<TValue>[];
    channel: TValue;
    onChannelChange: (value: TValue) => void;
    guidance: CandidateOutreachGuidance;
    /** The draft for the current channel. Without one, the composer offers to write it. */
    draft?: CandidateOutreachDraft | null;
    /** Shows the draft's progress and disables Draft and Redo. */
    drafting?: boolean;
    /** Why the last draft failed. */
    error?: ReactNode;
    /** Shows Copied, with a check, in place of Copy. */
    copied?: boolean;
    /** Writes a draft, or a fresh one. */
    onDraft: () => void;
    /** Copies the draft; the host decides what goes on the clipboard. */
    onCopy: () => void;
    onEditDraft: (message: string) => void;
    labels?: Partial<CandidateOutreachComposerLabels>;
    /** The kit PanelSection's divider. */
    border?: "none" | "top" | "bottom";
}
/**
 * Drafts a first message to a person: a channel picker in the header, the
 * house style for that channel on one line (which opens an editor), a button
 * that drafts the message, then the editable draft with its tone, Redo and
 * Copy. The host writes the draft, keeps the guidance and owns the clipboard.
 *
 * The root is the kit PanelSection, marked `data-slot="candidate-outreach-composer"`.
 */
declare function CandidateOutreachComposer<TValue extends string = string>({ channels, channel, onChannelChange, guidance, draft, drafting, error, copied, onDraft, onCopy, onEditDraft, labels, border, ...props }: CandidateOutreachComposerProps<TValue>): react.JSX.Element;

export { type CandidateOutreachChannel, CandidateOutreachComposer, type CandidateOutreachComposerLabels, type CandidateOutreachComposerProps, type CandidateOutreachDraft, type CandidateOutreachGuidance };
