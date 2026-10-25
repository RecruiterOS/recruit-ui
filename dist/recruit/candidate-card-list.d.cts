import * as react from 'react';
import { Key } from 'react';
import { ResourceList } from '@epicbagel/saas-kit/primitives/resource-list';
import { CandidateCardColumnsToggleLabels } from './candidate-card-columns-toggle.cjs';

type ResourceListProps<T> = Parameters<typeof ResourceList<T>>[0];
type CandidateCardListProps<T> = Omit<ResourceListProps<T>, "renderTable" | "viewMode" | "showViewToggle" | "showTitle" | "variant"> & {
    /** A stable key for each item's card. */
    getItemKey: (item: T, index: number) => Key;
    /** Where the cards-per-row choice is remembered; see useCandidateCardColumns. */
    columnsViewId: string;
    columnsLabels?: Partial<CandidateCardColumnsToggleLabels>;
};
/**
 * A searchable, filterable list of candidate cards in one or two columns.
 *
 * The kit's ResourceList does the searching, filtering and empty and error
 * states; this fixes its layout to a flush card grid with underlined quick
 * filters, a remembered cards-per-row toggle beside your filter actions, and
 * a four-card loading skeleton. You render each card.
 */
declare function CandidateCardList<T>({ getItemKey, columnsViewId, columnsLabels, renderItem, renderLoading, actions, filterActions, ...props }: CandidateCardListProps<T>): react.JSX.Element;

export { CandidateCardList, type CandidateCardListProps };
