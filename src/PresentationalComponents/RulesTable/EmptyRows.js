import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from '@patternfly/react-core';

const emptyRows = (columns) => [
  {
    cells: [
      {
        title: (
          <EmptyState
            headingLevel="h5"
            titleText="No matching rules found"
            variant={EmptyStateVariant.full}
          >
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
