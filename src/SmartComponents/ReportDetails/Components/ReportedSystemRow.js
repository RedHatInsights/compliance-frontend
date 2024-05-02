import React from 'react';
import propTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';

const ReportedSystemRow = ({ row, children }) => (
  <RowWrapper
    style={
      row.testResultProfiles?.length === 0
        ? {
            background: '#F0F0F0',
            borderLeft:
              'var(--pf-v5-c-table--border-width--base) solid var(--pf-v5-c-table--BorderColor)',
            borderRight:
              'var(--pf-v5-c-table--border-width--base) solid var(--pf-v5-c-table--BorderColor)',
          }
        : {}
    }
  >
    {children}
  </RowWrapper>
);

ReportedSystemRow.propTypes = {
  row: propTypes.node,
  children: propTypes.node,
};

export default ReportedSystemRow;
