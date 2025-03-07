import React from 'react';
import propTypes from 'prop-types';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import {
  paginationSerialiser,
  filtersSerialiser,
  sortSerialiser,
} from './serialisers';

/**
 * This component serves as a place to either use the non-async TableTools or the AsyncTableTools
 * And allow preparing the AsyncTableToolsTable props/options common across tables in Compliance
 *
 *  @param   {object}             props Component props
 *
 *  @returns {React.ReactElement}       Returns either a Async table
 *
 *  @category Compliance
 *
 */
const ComplianceTable = (props) => {
  return (
    <AsyncTableToolsTable
      {...props}
      options={{
        serialisers: {
          pagination: paginationSerialiser,
          filters: filtersSerialiser,
          sort: sortSerialiser,
        },
        ...props.options,
      }}
    />
  );
};

ComplianceTable.propTypes = {
  options: propTypes.object,
};

export default ComplianceTable;
