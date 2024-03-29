import React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
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
                <Title headingLevel="h5" size="lg">
                  No matching rules found
                </Title>
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
