import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Spinner } from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import {
  ComplianceRemediationButton,
  ErrorPage,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import {
  useGetEntities,
  useSystemsQueries,
  useSystemsBulkSelect,
  useSystemsFilterConfig,
  useSystemsExport,
} from './hooks';
import { defaultOnLoad, mergedColumns } from './helpers';

export const SystemsTable = ({
  apiEndpoint = 'systems',
  columns,
  defaultFilter,
  reportId,
  policyId,
  filters: { groups: showGroupsFilter = false, ...filters } = {},
  enableExport = true,
  compact,
  remediationsEnabled,
  emptyStateComponent,
  prependComponent,
  preselectedSystems,
  onSelect,
  noSystemsTable,
  dedicatedAction,
  ignoreOsMajorVersion,
  setIsSystemsDataLoading,
  ...inventoryTableProps
}) => {
  const inventory = useRef(null);
  const dispatch = useDispatch();

  const { toolbarProps: conditionalFilter } = useSystemsFilterConfig({
    filters,
    inventory,
  });

  const {
    fetchSystems,
    fetchOperatingSystems,
    systemsExporter,
    fetchSystemsBatched,
    resultCache,
    isLoaded,
    isEmpty,
    total,
    error,
  } = useSystemsQueries({
    apiEndpoint,
    policyId,
    reportId,
    defaultFilter,
    columns,
    emptyStateComponent,
    ignoreOsMajorVersion,
  });

  const {
    tableProps: bulkSelectTableProps,
    toolbarProps: bulkSelectToolBarProps,
    selectedItemCache,
    markEntitySelected,
  } = useSystemsBulkSelect({
    total,
    onSelect: onSelect || remediationsEnabled,
    preselected: preselectedSystems,
    fetchSystemsBatched,
    resultCache,
    setIsSystemsDataLoading,
  });

  const getEntities = useGetEntities(fetchSystems, {
    markEntitySelected,
  });

  const exportConfig = useSystemsExport({
    exporter: systemsExporter,
    columns,
    total,
  });

  const noError = error === undefined && !isEmpty;
  const empty = emptyStateComponent && isEmpty ? true : undefined;

  // Resets the Inventory to a loading state
  // and prevents previously shown columns and rows to appear
  useLayoutEffect(() => {
    dispatch({
      type: 'INVENTORY_INIT',
    });
  }, [dispatch]);

  return (
    <StateView
      stateValues={{
        error,
        noError,
        empty,
      }}
    >
      <StateViewPart stateKey="error">
        {!!prependComponent && prependComponent}
        <ErrorPage error={error} />
      </StateViewPart>
      <StateViewPart stateKey="empty">{emptyStateComponent}</StateViewPart>
      <StateViewPart stateKey="noError">
        {!!prependComponent && isLoaded && prependComponent}
        <InventoryTable
          ref={inventory}
          showTags
          disableDefaultColumns
          columns={mergedColumns(columns)}
          noSystemsTable={noSystemsTable}
          fallback={<Spinner />}
          getEntities={getEntities}
          fetchCustomOSes={fetchOperatingSystems}
          hideFilters={{
            all: true,
            operatingSystem: false,
            tags: false,
            hostGroupFilter: !showGroupsFilter,
          }}
          onLoad={defaultOnLoad(columns)}
          tableProps={{
            // TODO There must be a bug in the Inventory
            onSelect: undefined,
            ...bulkSelectTableProps,
            isStickyHeader: true,
          }}
          {...(compact ? { variant: 'compact' } : {})}
          {...bulkSelectToolBarProps}
          {...conditionalFilter}
          {...{
            ...(remediationsEnabled && {
              dedicatedAction: (
                <ComplianceRemediationButton
                  reportId={reportId}
                  reportTestResults={selectedItemCache}
                />
              ),
            }),
          }}
          {...(dedicatedAction ? { dedicatedAction: dedicatedAction } : {})}
          {...(enableExport && { exportConfig })}
          {...inventoryTableProps}
        />
      </StateViewPart>
    </StateView>
  );
};

SystemsTable.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  policies: PropTypes.array,
  policyId: PropTypes.string,
  enableExport: PropTypes.bool,
  compact: PropTypes.bool,
  remediationsEnabled: PropTypes.bool,
  defaultFilter: PropTypes.string,
  emptyStateComponent: PropTypes.node,
  prependComponent: PropTypes.node,
  preselectedSystems: PropTypes.array,
  onSelect: PropTypes.func,
  noSystemsTable: PropTypes.node,
  ssgVersions: PropTypes.array,
  dedicatedAction: PropTypes.object,
  ruleSeverityFilter: PropTypes.bool,
  filters: PropTypes.object,
  ignoreOsMajorVersion: PropTypes.bool,
  reportId: PropTypes.string,
  setIsSystemsDataLoading: PropTypes.func,
};

const SystemsTableWithTableState = (props) => (
  <TableStateProvider>
    <SystemsTable {...props} />
  </TableStateProvider>
);

export default SystemsTableWithTableState;
