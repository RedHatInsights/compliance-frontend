import React, { useMemo } from 'react';
import AsyncTableToolsTable from 'Utilities/hooks/useTableToolsv2/components/AsyncTableToolsTable';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import {
  onSetPaginationState,
  onSetFilterState,
  onSetSortState,
} from './helpers';

const ComplianceTable = (props) => {
  // TODO Add actual feature flag
  const enableAsyncTable = true;

  return enableAsyncTable ? (
    <TableToolsTable {...props} />
  ) : (
    <AsyncTableToolsTable
      {...props}
      onSetPaginationState={onSetPaginationState}
      onSetFilterState={onSetFilterState}
      onSetSortState={onSetSortState}
      // TODO This needs to be filled with the total of items that are in the Compliance database
      // This should be in some "meta" data in the first API response.
      // It should be used for both the pagination and the bulk selection
      numberOfItems={10}
    />
  );
};

export default ComplianceTable;
