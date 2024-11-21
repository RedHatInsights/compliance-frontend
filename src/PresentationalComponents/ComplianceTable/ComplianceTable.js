import React from 'react';
import propTypes from 'prop-types';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { ENABLE_ASYNC_TABLE_HOOKS } from '@/constants';
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
 *  @returns {React.ReactElement}       Returns either a Async or non async table depending on `ENABLE_ASYNC_TABLE_HOOKS` in `src/constants.js`
 *
 *  @category Compliance
 *
 */
const ComplianceTable = (props) =>
  ENABLE_ASYNC_TABLE_HOOKS ? (
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
  ) : (
    <TableToolsTable {...props} />
  );

ComplianceTable.propTypes = {
  options: propTypes.object,
};
export default ComplianceTable;
