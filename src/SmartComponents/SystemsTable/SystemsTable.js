import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Alert, Spinner } from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import { ComplianceRemediationButton } from 'PresentationalComponents';
import { ErrorPage, StateView, StateViewPart } from 'PresentationalComponents';
import useFilterConfig from 'Utilities/hooks/useTableTools/useFilterConfig';
import {
  policyFilter,
  defaultOnLoad,
  ssgVersionFilter,
  mergedColumns,
} from './constants';
import {
  useGetEntities,
  useInventoryUtilities,
  useSystemsExport,
  useSystemsFilter,
  useSystemBulkSelect,
} from './hooks';
import { useFetchSystems } from './hooks/useFetchSystems';
import {
  defaultSystemsFilterConfiguration,
  complianceReportTableAdditionalFilter,
  compliantSystemFilterConfiguration,
  DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
} from '../../constants';

export const SystemsTable = ({
  columns,
  showAllSystems,
  policyId,
  showActions,
  enableExport,
  compliantFilter,
  policies,
  showOnlySystemsWithTestResults,
  error: errorProp,
  showComplianceSystemsInfo,
  compact,
  remediationsEnabled,
  systemProps,
  defaultFilter,
  emptyStateComponent,
  prependComponent,
  preselectedSystems,
  onSelect,
  noSystemsTable,
  tableProps,
  ssgVersions,
  dedicatedAction,
  ruleSeverityFilter,
  showGroupsFilter,
  fetchApi,
  fetchCustomOSes,
  ignoreOsMajorVersion,
  reportId,
  setIsSystemsDataLoading,
}) => {
  const inventory = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState();
  const [total, setTotal] = useState(0);
  const navigateToInventory = useNavigate('inventory');
  const [error, setError] = useState(errorProp);
  const [selectedWholeItems, setSelectedWholeItems] = useState([]);

  const {
    toolbarProps: conditionalFilter,
    filterString,
    activeFilterValues,
  } = useFilterConfig({
    filters: {
      filterConfig: [
        ...defaultSystemsFilterConfiguration(
          DEFAULT_SYSTEMS_FILTER_CONFIGURATION
        ),
        ...(compliantFilter ? compliantSystemFilterConfiguration() : []),
        ...(policies?.length > 0 ? policyFilter(policies) : []),
        ...(ssgVersions ? ssgVersionFilter(ssgVersions) : []),
        ...(ruleSeverityFilter ? complianceReportTableAdditionalFilter() : []),
      ],
    },
  });
  const systemsFilter = useSystemsFilter(
    filterString(),
    showOnlySystemsWithTestResults,
    defaultFilter
  );

  const systemFetchArguments = {
    filter: systemsFilter,
    ...(policyId && { policyId }),
  };

  const combinedFetchArgumentsRef = useRef();

  const onCustomSelect = (selectedItems) => {
    setSelectedWholeItems(selectedItems);
    onSelect?.(selectedItems);
  };

  const {
    selectedIds,
    selectedItems,
    tableProps: bulkSelectTableProps,
    toolbarProps: bulkSelectToolBarProps,
  } = useSystemBulkSelect({
    total,
    onSelect: onCustomSelect,
    preselectedSystems,
    fetchArguments: combinedFetchArgumentsRef.current,
    currentPageItems: items,
    fetchApi,
    tableLoaded: isLoaded,
    setIsSystemsDataLoading,
  });

  useInventoryUtilities(inventory, selectedIds, activeFilterValues);

  const onComplete = useCallback(
    (result, { tags, filter, policyId }) => {
      setTotal(result.meta.totalCount);
      setItems(result.entities);
      setIsLoaded(true);

      combinedFetchArgumentsRef.current = {
        ...(combinedFetchArgumentsRef.current || {}),
        policyId: policyId || undefined,
        tags,
        filter,
      };

      if (
        emptyStateComponent &&
        result.meta.totalCount === 0 &&
        activeFilterValues.length === 0 &&
        (typeof result?.meta?.tags === 'undefined' ||
          result?.meta?.tags?.length === 0)
      ) {
        setIsEmpty(true);
      }
    },
    [emptyStateComponent, activeFilterValues.length]
  );

  const onError = (apiError) => {
    setIsLoaded(true);
    setError(apiError);
  };

  const fetchSystems = useFetchSystems(
    fetchApi,
    onComplete,
    onError,
    systemFetchArguments
  );

  const getEntities = useGetEntities(fetchSystems, {
    selected: selectedIds,
    columns,
    ignoreOsMajorVersion,
  });

  const exportConfig = useSystemsExport({
    columns,
    selectedItems,
    total,
    fetchSystems,
  });

  const handleOperatingSystemsFetch = useCallback(
    () => fetchCustomOSes({ filters: defaultFilter, reportId, policyId }),
    [defaultFilter, fetchCustomOSes, policyId, reportId]
  );

  return (
    <StateView
      stateValues={{
        error,
        noError: error === undefined && !isEmpty,
        empty: isEmpty,
      }}
    >
      <StateViewPart stateKey="error">
        {!!prependComponent && prependComponent}
        <ErrorPage error={error} />
      </StateViewPart>
      <StateViewPart stateKey="empty">{emptyStateComponent}</StateViewPart>
      <StateViewPart stateKey="noError">
        {!!prependComponent && isLoaded && prependComponent}
        {showComplianceSystemsInfo && (
          <Alert
            isInline
            variant="info"
            ouiaId="SystemsListIsDifferentAlert"
            title={
              'The list of systems in this view is different than those that appear in the Inventory. ' +
              'Only systems currently associated with or reporting against compliance policies are displayed.'
            }
          />
        )}
        <InventoryTable
          {...systemProps}
          disableDefaultColumns
          columns={mergedColumns(columns)}
          noSystemsTable={noSystemsTable}
          ref={inventory}
          getEntities={getEntities}
          hideFilters={{
            all: true,
            operatingSystem: false,
            tags: false,
            hostGroupFilteronCustomSelect: !showGroupsFilter,
          }}
          showTags
          onLoad={defaultOnLoad(columns)}
          tableProps={{
            ...bulkSelectTableProps,
            isStickyHeader: true,
            ...tableProps,
          }}
          fallback={<Spinner />}
          {...(compact ? { variant: 'compact' } : {})}
          {...bulkSelectToolBarProps}
          {...(!showAllSystems && {
            ...conditionalFilter,
            ...(remediationsEnabled && {
              dedicatedAction: (
                <ComplianceRemediationButton
                  reportId={reportId}
                  reportTestResults={selectedWholeItems}
                />
              ),
            }),
          })}
          {...(dedicatedAction ? { dedicatedAction: dedicatedAction } : {})}
          {...(enableExport && { exportConfig })}
          {...(showActions && {
            actions: [
              {
                title: 'View in inventory',
                onClick: (_event, _index, { id }) =>
                  navigateToInventory('/' + id),
              },
            ],
          })}
          fetchCustomOSes={handleOperatingSystemsFetch}
        />
      </StateViewPart>
    </StateView>
  );
};

SystemsTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ),
  policies: PropTypes.arrayOf(PropTypes.shape({})),
  showAllSystems: PropTypes.bool,
  policyId: PropTypes.string,
  query: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showActions: PropTypes.bool,
  enableExport: PropTypes.bool,
  compliantFilter: PropTypes.bool,
  showOnlySystemsWithTestResults: PropTypes.bool,
  showGroupsFilter: PropTypes.bool,
  showComplianceSystemsInfo: PropTypes.bool,
  error: PropTypes.object,
  compact: PropTypes.bool,
  remediationsEnabled: PropTypes.bool,
  defaultFilter: PropTypes.string,
  systemProps: PropTypes.shape({
    isFullView: PropTypes.bool,
  }),
  emptyStateComponent: PropTypes.node,
  prependComponent: PropTypes.node,
  showOsMinorVersionFilter: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  preselectedSystems: PropTypes.array,
  onSelect: PropTypes.func,
  noSystemsTable: PropTypes.node,
  tableProps: PropTypes.object,
  ssgVersions: PropTypes.array,
  dedicatedAction: PropTypes.object,
  ruleSeverityFilter: PropTypes.bool,
  fetchApi: PropTypes.func.isRequired,
  fetchCustomOSes: PropTypes.func.isRequired,
  ignoreOsMajorVersion: PropTypes.bool,
  reportId: PropTypes.string,
  setIsSystemsDataLoading: PropTypes.func,
};

SystemsTable.defaultProps = {
  policyId: '',
  showActions: true,
  enableExport: true,
  compliantFilter: false,
  showOnlySystemsWithTestResults: false,
  showComplianceSystemsInfo: false,
  compact: false,
  remediationsEnabled: true,
  preselectedSystems: [],
  ruleSeverityFilter: false,
  showGroupsFilter: false,
};

export default SystemsTable;
