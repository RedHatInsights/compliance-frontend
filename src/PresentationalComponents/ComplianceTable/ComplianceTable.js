import React from 'react';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import { ENABLE_ASYNC_TABLE_HOOKS } from '@/constants';
import { paginationSerialiser } from './serialisers';

const ComplianceTable = (props) =>
  ENABLE_ASYNC_TABLE_HOOKS ? (
    <AsyncTableToolsTable
      {...props}
      options={{
        serialisers: { pagination: paginationSerialiser },
      }}
    />
  ) : (
    <TableToolsTable {...props} />
  );

export default ComplianceTable;
