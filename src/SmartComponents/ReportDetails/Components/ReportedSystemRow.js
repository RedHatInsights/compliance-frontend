import React from 'react';
import propTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';

const ReportedSystemRow = ({ row, children }) => (
  <RowWrapper
    style={
      row.testResultProfiles?.length === 0 ? { background: '#F0F0F0' } : {}
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
