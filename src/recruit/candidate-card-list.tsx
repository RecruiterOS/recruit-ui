"use client";

import { Grid } from "@epicbagel/saas-kit/primitives/grid";
import { ResourceList } from "@epicbagel/saas-kit/primitives/resource-list";
import { ScrollNavigator, type ScrollNavigatorItem } from "@epicbagel/saas-kit/primitives/scroll-navigator";
import { Skeleton } from "@epicbagel/saas-kit/primitives/skeleton";
import { Stack } from "@epicbagel/saas-kit/primitives/stack";
import { Fragment, type Key } from "react";

import {
  CandidateCardColumnsToggle,
  type CandidateCardColumnsToggleLabels,
  useCandidateCardColumns,
} from "./candidate-card-columns-toggle";

type ResourceListProps<T> = Parameters<typeof ResourceList<T>>[0];

export type CandidateCardListProps<T> = Omit<
  ResourceListProps<T>,
  "renderTable" | "viewMode" | "showViewToggle" | "showTitle" | "variant"
> & {
  /** A stable key for each item's card. */
  getItemKey: (item: T, index: number) => Key;
  /** Where the cards-per-row choice is remembered; see useCandidateCardColumns. */
  columnsViewId: string;
  columnsLabels?: Partial<CandidateCardColumnsToggleLabels>;
  /** Optional avatar navigation for the cards currently visible after filtering. */
  scrollNavigation?: {
    label?: string;
    topOffset?: number;
    getItem: (item: T, index: number) => Pick<ScrollNavigatorItem, "label" | "imageSrc" | "fallback">;
  };
};

/**
 * A searchable, filterable list of candidate cards in one or two columns.
 *
 * The kit's ResourceList does the searching, filtering and empty and error
 * states; this fixes its layout to a flush card grid with underlined quick
 * filters, a remembered cards-per-row toggle beside your filter actions, and
 * a four-card loading skeleton. You render each card.
 */
export function CandidateCardList<T>({
  getItemKey,
  columnsViewId,
  columnsLabels,
  scrollNavigation,
  renderItem,
  renderLoading,
  actions,
  filterActions,
  ...props
}: CandidateCardListProps<T>) {
  const { columns, setColumns } = useCandidateCardColumns(columnsViewId);
  const renderGrid = (items: T[]) => scrollNavigation ? (
    <Stack direction="vertical" gap="none" data-slot="candidate-card-list">
      <ScrollNavigator
        label={scrollNavigation.label}
        topOffset={scrollNavigation.topOffset}
        columns={columns}
        items={items.map((item, index) => ({
          ...scrollNavigation.getItem(item, index),
          id: String(getItemKey(item, index)),
          content: renderItem(item, index),
        }))}
      />
    </Stack>
  ) : (
    <Grid columns={columns} gap="md" responsive data-slot="candidate-card-list">
      {items.map((item, index) => (
        <Fragment key={getItemKey(item, index)}>
          {renderItem(item, index)}
        </Fragment>
      ))}
    </Grid>
  );

  return (
    <ResourceList<T>
      {...props}
      showTitle={false}
      variant="flush"
      quickFiltersAppearance="underline"
      showViewToggle={false}
      viewMode="table"
      actions={actions}
      filterActions={(
        <Stack direction="horizontal" gap="sm" align="center">
          {filterActions}
          <CandidateCardColumnsToggle
            columns={columns}
            onChange={setColumns}
            roomy
            labels={columnsLabels}
          />
        </Stack>
      )}
      renderItem={renderItem}
      renderTable={renderGrid}
      renderLoading={renderLoading ?? (() => (
        <Grid columns={columns} gap="md" responsive data-slot="candidate-card-list-loading">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} preset="panel" radius="xl" />
          ))}
        </Grid>
      ))}
    />
  );
}
