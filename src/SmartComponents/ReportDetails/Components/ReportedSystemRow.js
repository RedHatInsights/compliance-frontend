import React from 'react';
import propTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';

const ReportedSystemRow = ({ row, children }) => (
  <RowWrapper
    style={
      row.testResultProfiles?.length === 0 ? { background: '#D2D2D2' } : {}
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
