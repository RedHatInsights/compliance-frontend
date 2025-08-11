import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { TableStateProvider } from 'bastilian-tabletools';
import { ErrorPage, InventorySystemsTable } from 'PresentationalComponents';

import {
  defaultFiltersFunction,
  defaultColumnsFunction,
  defaultOptionsFunction,
} from './helpers';
import { OS } from './Columns';
// import * as defaultComplianceSystemsFilters from './Filters';
import { useSystemsQueries } from './hooks';

export const SystemsTable = ({
  apiEndpoint = 'systems',
  defaultFilter,
  // TODO Maybe these could be replaced by params? filter? ish thing
  reportId,
  policyId,
  columns = defaultColumnsFunction,
  // filters = defaultFiltersFunction,
  options,
  enableExport = true,
  // TODO replacssssss
  compact,
  // This is not an "EmptyState" component
  // emptyStateComponent: EmptyStateComponent,
  prependComponent: PrependComponent,
  noSystemsTable: NoSystemsTable,
}) => {
  // We might want to switch to using the `loading`, `data` and `error` states instead.
  // We could expose TanStack useQuery's returns to determine if it is the first request and show the "empty state" instead.
  const {
    // TODO These need to be functions handling a serialisedTableState and not InventoryTables params stuff
    fetchSystems,
    // fetchOperatingSystems,
    // fetchSystemsTags,
    systemsExporter,
    fetchSystemsBatched,
  } = useSystemsQueries({
    apiEndpoint,
    policyId,
    reportId,
    defaultFilter,
  });

  // TODO make this nicer
  const ErrorComponent = useMemo(
    () =>
      // eslint-disable-next-line
      function ErrorState({ error }) {
        return (
          <>
            <PrependComponent />
            <ErrorPage error={error} />
          </>
        );
      },
    [PrependComponent],
  );

  const defaultComplianceSystemsTableOptions = useMemo(
    () => ({
      // TODO Add some feature to allow hiding the PrimaryToolbar on error
      ErrorState: ErrorComponent,
      EmptyState: NoSystemsTable,
      itemIdsInTable: fetchSystemsBatched,
      ...(enableExport ? { exporter: systemsExporter } : {}),
    }),
    [
      ErrorComponent,
      NoSystemsTable,
      enableExport,
      systemsExporter,
      fetchSystemsBatched,
    ],
  );

  // TODO combine inventory and compliance filters and columns before calling the functions
  return (
    <>
      {PrependComponent && <PrependComponent />}
      <InventorySystemsTable
        items={async (...args) => {
          const result = await fetchSystems(...args);

          return [result.data, result.meta.total];
        }}
        columns={(inventoryColumns) =>
          columns({
            ...inventoryColumns,
            OS: {
              title: 'Operating system',
              Component: ({ osMajorVersion, osMinorVersion }) =>
                `${osMajorVersion}.${osMinorVersion}`,
            },
          })
        }
        filters={({ displayName }) => ({
          filterConfig: [displayName],
        })}
        options={(inventoryTableToolsTableOptions) =>
          options(
            inventoryTableToolsTableOptions,
            defaultComplianceSystemsTableOptions,
          )
        }
        {...{
          ...(compact ? { variant: 'compact' } : {}),
          isStickyHeader: true,
        }}
      />
    </>
  );
};

SystemsTable.propTypes = {
  apiEndpoint: propTypes.string,
  defaultFilter: propTypes.object,
  reportId: propTypes.string,
  policyId: propTypes.string,
  columns: propTypes.func,
  filters: propTypes.func,
  options: propTypes.func,
  enableExport: propTypes.bool,
  compact: propTypes.bool,
  prependComponent: propTypes.node,
  noSystemsTable: propTypes.node,
};

const SystemsTableWithTableState = (props) => (
  <TableStateProvider>
    <SystemsTable {...props} />
  </TableStateProvider>
);

export default SystemsTableWithTableState;
