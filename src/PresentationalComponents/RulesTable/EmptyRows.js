import React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/EmptyTable';

const emptyRows = (columns) => [
  {
    cells: [
      {
        title: (
          <EmptyTable>
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.full}>
                <EmptyStateHeader
                  titleText="No matching rules found"
                  headingLevel="h5"
                />
                <EmptyStateBody>
                  This filter criteria matches no rules. <br /> Try changing
                  your filter settings.
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          </EmptyTable>
        ),
        props: {
          colSpan: columns.length,
        },
      },
    ],
  },
];

export default emptyRows;
