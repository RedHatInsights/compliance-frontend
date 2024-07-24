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

/**
 * This component is a wrapper around the Patternfly Table component(s), the FEC PrimaryToolbar and combines them with the `useAsyncTableTools` hook
 *
 * @param {Object} [props]
 *
 *  **Props:**
 *
 *    * items -  An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *    * columns - an array of column objects to render items with
 *    * filters - an array of filters
 *    * options - an object of options that will be passed along to the `useAsyncTableTools` hook
 *
 */
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
  ...tablePropsRest
}) => {
  const { toolbarProps, tableProps } = useAsyncTableTools(items, columns, {
    filters,
    toolbarProps: toolbarPropsProp,
    tableProps: tablePropsRest,
    ...options,
  });

  return (
    <>
      <PrimaryToolbar {...toolbarProps} />

      <Table {...tableProps}>
        <TableHeader {...tableHeaderProps} />
        <TableBody {...tableBodyProps} />
      </Table>

      <TableToolbar isFooter {...tableToolbarProps}>
        {toolbarProps.pagination && (
          <Pagination
            variant={PaginationVariant.bottom}
            {...toolbarProps.pagination}
            {...paginationProps}
          />
        )}
      </TableToolbar>
    </>
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
};

export default AsyncTableToolsTable;
