import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { TableStateProvider } from 'bastilian-tabletools';
import {
  ComplianceRemediationButton,
  ErrorPage,
  StateView,
  StateViewPart,
  CenteredSpinner,
} from 'PresentationalComponents';
import {
  useGetEntities,
  useSystemsQueries,
  useSystemsBulkSelect,
  useSystemsFilterConfig,
  useSystemsExport,
} from './hooks';
import {
  defaultOnLoad,
  filterColumnsByInventoryFeatures,
  mergedColumns,
} from './helpers';
import { getAppConfig } from '@/config/appConfig';

export const SystemsTable = ({
  apiEndpoint = 'systems',
  columns,
  defaultFilter,
  reportId,
  policyId,
  filters: { groups: showGroupsFilter = false, ...filters } = {},
  enableExport = true,
  compact,
  remediationsEnabled: remediationsEnabledProp,
  emptyStateComponent,
  prependComponent,
  preselectedSystems,
  onSelect,
  noSystemsTable,
  dedicatedAction,
  ignoreOsMajorVersion,
  setIsSystemsDataLoading,
  perPage,
  sortBy = { key: 'name', direction: 'asc' },
  ...inventoryTableProps
}) => {
  const inventory = useRef(null);
  const { remediations: remediationsFeature, inventoryGroupsAndTags } =
    getAppConfig().features;
  const remediationsEnabled = remediationsEnabledProp && remediationsFeature;
  const tableColumns = filterColumnsByInventoryFeatures(
    columns,
    inventoryGroupsAndTags,
  );

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
    selected: preselectedSystems,
    fetchSystemsBatched,
    resultCache,
    setIsSystemsDataLoading,
  });

  const getEntities = useGetEntities(fetchSystems, {
    markEntitySelected,
  });

  const exportConfig = useSystemsExport({
    exporter: systemsExporter,
    columns: tableColumns,
    total,
  });

  const noError = error === undefined && !isEmpty;
  const empty = emptyStateComponent && isEmpty ? true : undefined;
  const selectionEnabled = Boolean(onSelect || remediationsEnabled);

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
          showTags={inventoryGroupsAndTags}
          disableDefaultColumns
          columns={mergedColumns(tableColumns)}
          noSystemsTable={noSystemsTable}
          fallback={<CenteredSpinner />}
          getEntities={getEntities}
          fetchCustomOSes={fetchOperatingSystems}
          hideFilters={{
            all: true,
            name: false,
            operatingSystem: false,
            tags: !inventoryGroupsAndTags,
            hostGroupFilter: !inventoryGroupsAndTags || !showGroupsFilter,
          }}
          onLoad={defaultOnLoad(tableColumns, { perPage, sortBy })}
          sortBy={sortBy}
          hasCheckbox={selectionEnabled}
          tableProps={{
            // Prevent Inventory's default checkbox onSelect; bulk select owns it
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
  dedicatedAction: PropTypes.object,
  filters: PropTypes.object,
  ignoreOsMajorVersion: PropTypes.bool,
  reportId: PropTypes.string,
  setIsSystemsDataLoading: PropTypes.func,
  perPage: PropTypes.number,
  sortBy: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }),
};

const SystemsTableWithTableState = (props) => (
  <TableStateProvider>
    <SystemsTable {...props} />
  </TableStateProvider>
);

export default SystemsTableWithTableState;
