import React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';

const NoResultsTable = () => (
  <EmptyTable>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader
          titleText="No matching policies found"
          headingLevel="h5"
        />
        <EmptyStateBody>
          This filter criteria matches no policies. <br /> Try changing your
          filter settings.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </EmptyTable>
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
