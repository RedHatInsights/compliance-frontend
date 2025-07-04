import React from 'react';
import propTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from '@patternfly/react-core';

export const NoResultsTable = ({ kind = 'results' }) => (
  <EmptyState
    headingLevel="h5"
    titleText={<>No matching {kind} found</>}
    variant={EmptyStateVariant.full}
  >
    <EmptyStateBody>
      This filter criteria matches no {kind}.<br />
      Try changing your filter settings.
    </EmptyStateBody>
  </EmptyState>
);

NoResultsTable.propTypes = {
  kind: propTypes.string,
};

export const emptyRows = (kind, colSpan) => [
  {
    cells: [
      {
        title: () => <NoResultsTable kind={kind} />,
        props: {
          colSpan,
        },
      },
    ],
  },
];

export default NoResultsTable;
