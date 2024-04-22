import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';

const NoResultsTable = () => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateHeader
      titleText="No matching policies found"
      headingLevel="h5"
    />
    <EmptyStateBody>
      This filter criteria matches no policies. <br /> Try changing your filter
      settings.
    </EmptyStateBody>
  </EmptyState>
);

export const emptyRows = [
  {
    cells: [
      {
        title: () => <NoResultsTable />, // eslint-disable-line
        props: {
          colSpan: 3,
        },
      },
    ],
  },
];

export default NoResultsTable;
