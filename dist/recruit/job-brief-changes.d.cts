import * as react from 'react';
import { HTMLAttributes } from 'react';
import { JobBriefChange, JobBriefChangeLabels } from './job-brief-view.cjs';
export { JobBriefChangeKind, JobBriefChangeValue, jobBriefChangeLabels, jobBriefChangeText } from './job-brief-view.cjs';

interface JobBriefChangesProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    /**
     * What the version changed, in the order it was made, as display values:
     * map your own record of each change onto `JobBriefChange`.
     */
    changes: readonly JobBriefChange[];
    /** The version these changes made, which names the group ("What changed in v3"). */
    version?: number;
    /** How many changes show before the rest fold under "N more changes". Defaults to 3. */
    previewCount?: number;
    /** Any of the wording in `jobBriefChangeLabels`: the lines, the toggle and the group's name. */
    labels?: Partial<JobBriefChangeLabels>;
}
/**
 * What a version of a brief changed, for under its JobBriefCard: one quiet
 * line per change, in the kit's trace lines, each leading with an icon for
 * its kind (added, removed or cleared, set or reworded, moved, replaced) and
 * worded by `jobBriefChangeText`. The first `previewCount` show; the rest
 * fold under a "N more changes" toggle that opens them in place. A version
 * with no changes to list (the first, which is the whole brief) draws
 * nothing.
 *
 * The root is a group named for the version ("What changed in v3"), so a
 * screen reader tells versions apart, and marked
 * `data-slot="job-brief-changes"`; each line carries its `data-change-kind`.
 * The kit's trace parts inside keep their own `data-slot`.
 */
declare function JobBriefChanges({ changes, version, previewCount, labels, ...props }: JobBriefChangesProps): react.JSX.Element | null;

export { JobBriefChange, JobBriefChangeLabels, JobBriefChanges, type JobBriefChangesProps };
