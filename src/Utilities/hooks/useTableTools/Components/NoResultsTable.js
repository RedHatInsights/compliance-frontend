import React from 'react';
import propTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';

export const NoResultsTable = ({ kind = 'results' }) => (
  <EmptyTable>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
          titleText={<>No matching {kind} found</>}
          headingLevel="h5"
        />
        <EmptyStateBody>
          This filter criteria matches no {kind}.<br />
          Try changing your filter settings.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </EmptyTable>
);

NoResultsTable.propTypes = {
  kind: propTypes.string,
};

export const emptyRows = (kind, colSpan) => [
  {
    cells: [
      {
        title: () => <NoResultsTable kind={kind} />, // eslint-disable-line react/display-name
        props: {
          colSpan,
        },
      },
    ],
  },
];

export default NoResultsTable;
