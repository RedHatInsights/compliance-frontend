import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { TableToolsTable } from 'bastilian-tabletools';

import {
  paginationSerialiser,
  filtersSerialiser,
  sortSerialiser,
} from './serialisers';

/**
 * This component serves as a place to either use the non-async TableTools or the TableToolsTable
 * And allow preparing the TableToolsTable props/options common across tables in Compliance
 *
 *  @param                        props.useTableParams
 *  @param   {object}             props                Component props
 *
 *  @returns {React.ReactElement}                      Returns either a Async table
 *
 *  @category Compliance
 *
 */
const ComplianceTable = ({ useTableParams = false, ...props }) => {
  const [searchParams, setURLSearchParams] = useSearchParams();

  const setSearchParams = useCallback(
    (params) => {
      setURLSearchParams(params, { replace: true });
    },
    [setURLSearchParams],
  );

  return (
    <TableToolsTable
      {...props}
      options={{
        ...(useTableParams ? { searchParams, setSearchParams } : {}),
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
  useTableParams: propTypes.bool,
};

export default ComplianceTable;
