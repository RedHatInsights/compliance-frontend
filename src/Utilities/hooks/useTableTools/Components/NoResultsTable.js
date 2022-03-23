import React from 'react';
import propTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';

export const NoResultsTable = ({ kind = 'results' }) => (
  <EmptyTable>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <Title headingLevel="h5" size="lg">
          No matching {kind} found
        </Title>
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

export const emptyRows = [
  {
    cells: [
      {
        title: () => <NoResultsTable />, // eslint-disable-line react/display-name
        props: {
          colSpan: 6,
        },
      },
    ],
  },
];

export default NoResultsTable;
