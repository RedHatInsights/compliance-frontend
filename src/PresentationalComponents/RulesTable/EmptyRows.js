import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';

const emptyRows = (columns) => [
  {
    cells: [
      {
        title: (
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateHeader
              titleText="No matching rules found"
              headingLevel="h5"
            />
            <EmptyStateBody>
              This filter criteria matches no rules. <br /> Try changing your
              filter settings.
            </EmptyStateBody>
          </EmptyState>
        ),
        props: {
          colSpan: columns.length,
        },
      },
    ],
  },
];

export default emptyRows;
