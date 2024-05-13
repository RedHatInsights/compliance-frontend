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
import useTableTools from '../useTableTools';

const TableToolsTable = ({
  items = [],
  columns = [],
  filters = [],
  options = {},
  toolbarProps: toolbarPropsProp,
  ...tablePropsRest
}) => {
  const { toolbarProps, tableProps, ColumnManager, TreeTableToggle } =
    useTableTools(items, columns, {
      filters,
      toolbarProps: toolbarPropsProp,
      tableProps: tablePropsRest,
      ...options,
    });

  return (
    <React.Fragment>
      <PrimaryToolbar aria-label="Table toolbar" {...toolbarProps}>
        {TreeTableToggle && <TreeTableToggle />}
      </PrimaryToolbar>

      <Table {...tableProps}>
        <TableHeader />
        <TableBody />
      </Table>

      {/* The -1 are to combat a bug currently in the TableToolbar component */}
      <TableToolbar isFooter results={-1} selected={-1}>
        {toolbarProps.pagination && (
          <Pagination
            variant={PaginationVariant.bottom}
            {...toolbarProps.pagination}
          />
        )}
      </TableToolbar>

      {ColumnManager && <ColumnManager />}
    </React.Fragment>
  );
};

TableToolsTable.propTypes = {
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
};

export default TableToolsTable;
