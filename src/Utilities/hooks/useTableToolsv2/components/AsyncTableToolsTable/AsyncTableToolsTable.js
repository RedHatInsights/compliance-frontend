import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table/deprecated';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
import useAsyncTableTools from '../../hooks/useAsyncTableTools';

// NOTE if we want to migrate to the Patternfly's composable Table component this is the component we will need to replace
// The same for the case to move to the DataView components
// We may need to adjust some of the things the underlying hooks return, but in general
const AsyncTableToolsTable = ({
  items,
  columns,
  filters,
  options,
  toolbarProps: toolbarPropsProp,
  tableHeaderProps,
  tableBodyProps,
  tableToolbarProps,
  paginationProps,
  columnManagerProps,
  ...tablePropsRest
}) => {
  const { toolbarProps, tableProps, ColumnManager } = useAsyncTableTools(
    items,
    columns,
    {
      filters,
      toolbarProps: toolbarPropsProp,
      tableProps: tablePropsRest,
      ...options,
    }
  );

  return (
    <React.Fragment>
      <PrimaryToolbar {...toolbarProps} />

      <Table {...tableProps}>
        <TableHeader {...tableHeaderProps} />
        <TableBody {...tableBodyProps} />
      </Table>

      <TableToolbar isFooter {...tableToolbarProps}>
        <Pagination
          variant={PaginationVariant.bottom}
          {...toolbarProps.pagination}
          {...paginationProps}
        />
      </TableToolbar>

      {ColumnManager && <ColumnManager {...columnManagerProps} />}
    </React.Fragment>
  );
};

AsyncTableToolsTable.propTypes = {
  items: propTypes.array.isRequired,
  columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node,
      transforms: propTypes.array,
      sortByProperty: propTypes.string,
      sortByArray: propTypes.array,
      sortByFunction: propTypes.func,
      renderFunc: propTypes.func,
    })
  ).isRequired,
  filters: propTypes.object,
  options: propTypes.object,
  toolbarProps: propTypes.object,
  tableHeaderProps: propTypes.object,
  tableBodyProps: propTypes.object,
  tableToolbarProps: propTypes.object,
  paginationProps: propTypes.object,
  columnManagerProps: propTypes.object,
};

export default AsyncTableToolsTable;
