import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table/deprecated';
import { SkeletonTable } from '@patternfly/react-component-groups';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
import useAsyncTableTools from '../../hooks/useAsyncTableTools';

/**
 * This component is a wrapper around the Patternfly Table component(s), the FEC PrimaryToolbar and combines them with the `useAsyncTableTools` hook
 *
 *  @param   {object}             props                     Component Props
 *  @param   {Array}              props.items               An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *  @param   {Array}              props.columns             An array of column objects to render items with
 *  @param   {Array}              [props.filters]           an array of filters
 *  @param   {Array}              [props.total]             Number of total items available
 *  @param   {boolean}            [props.loading]           Custom loading condition
 *  @param   {object}             [props.options]           An object of options that will be passed along to the `useAsyncTableTools` hook
 *  @param   {object}             [props.toolbarProps]      Props to be passed on the `PrimaryToolbar` component
 *  @param   {object}             [props.tableHeaderProps]  Props to be passed on the TableHeader component
 *  @param   {object}             [props.tableBodyProps]    Props to be passed on the TableBody component
 *  @param   {object}             [props.tableToolbarProps] Props to be passed on the TableToolbar (bottom toolbar) component
 *  @param   {object}             [props.paginationProps]   Props to be passed on the Pagination component
 *  @returns {React.ReactElement}                           Returns a `PrimaryToolbar` component, a Patternfly (v4) `Table` component and a `TableToolbarComponent` wrapped together
 *
 *  @tutorial using-async-table-tools
 *
 *  @category AsyncTableTools
 *  @subcategory Components
 *
 */
const AsyncTableToolsTable = ({
  items,
  columns,
  filters,
  total,
  loading,
  options,
  // TODO I'm not sure if we need this level of customisation.
  // It might actually hurt in the long run. Consider removing until we really have the case where we need this
  toolbarProps: toolbarPropsProp,
  tableHeaderProps,
  tableBodyProps,
  tableToolbarProps,
  paginationProps,
  ...tablePropsRest
}) => {
  const { loaded, toolbarProps, tableProps, ColumnManager, TableViewToggle } =
    useAsyncTableTools(items, columns, {
      filters,
      toolbarProps: toolbarPropsProp,
      tableProps: tablePropsRest,
      numberOfItems: total,
      ...options,
    });

  const skeletonLoading = !loaded || loading;

  return (
    <>
      <PrimaryToolbar aria-label="Table toolbar" {...toolbarProps}>
        {TableViewToggle && <TableViewToggle />}
      </PrimaryToolbar>

      {skeletonLoading ? (
        <SkeletonTable
          rowSize={toolbarProps?.pagination?.perPage || 10}
          columns={columns.map(({ title }) => title)}
        />
      ) : (
        <Table {...tableProps}>
          <TableHeader {...tableHeaderProps} />
          <TableBody {...tableBodyProps} />
        </Table>
      )}

      <TableToolbar isFooter {...tableToolbarProps}>
        {toolbarProps.pagination && (
          <Pagination
            aria-label="Pagination-ToolBar"
            variant={PaginationVariant.bottom}
            {...toolbarProps.pagination}
            {...paginationProps}
          />
        )}
      </TableToolbar>

      {ColumnManager && <ColumnManager />}
    </>
  );
};

AsyncTableToolsTable.propTypes = {
  items: propTypes.oneOfType([propTypes.array, propTypes.func]).isRequired,
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
  total: propTypes.number,
  loading: propTypes.bool,
  options: propTypes.object,
  toolbarProps: propTypes.object,
  tableHeaderProps: propTypes.object,
  tableBodyProps: propTypes.object,
  tableToolbarProps: propTypes.object,
  paginationProps: propTypes.object,
};

export default AsyncTableToolsTable;
