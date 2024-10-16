import React, { useMemo, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Alert, Spinner } from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import RemediationButton from '@/PresentationalComponents/ComplianceRemediationButton/RemediationButton';
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
import { useFetchSystemsV2 } from './hooks/useFetchSystems';
import {
  compliantSystemFilterConfiguration,
  complianceReportTableAdditionalFilter,
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
  showOsFilter,
  error: errorProp,
  showComplianceSystemsInfo,
  compact,
  remediationsEnabled,
  systemProps,
  defaultFilter,
  emptyStateComponent,
  prependComponent,
  preselectedSystems,
  onSelect: onSelectProp,
  noSystemsTable,
  tableProps,
  ssgVersions,
  dedicatedAction,
  ruleSeverityFilter,
  showGroupsFilter,
  fetchApi,
  fetchCustomOSes,
  ignoreOsMajorVersion,
}) => {
  const inventory = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [currentTags, setCurrentTags] = useState([]);
  const navigateToInventory = useNavigate('inventory');
  const [error, setError] = useState(errorProp);

  const {
    toolbarProps: conditionalFilter,
    filterString,
    activeFilterValues,
  } = useFilterConfig({
    filters: {
      filterConfig: [
        ...(compliantFilter ? compliantSystemFilterConfiguration() : []),
        ...(policies?.length > 0 ? policyFilter(policies, showOsFilter) : []),
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
    tags: currentTags,
    filter: systemsFilter,
    ...(policyId && { policyId }),
  };

  const preselection = useMemo(
    () => preselectedSystems.map(({ id }) => id),
    [preselectedSystems]
  );

  const {
    selectedIds,
    tableProps: bulkSelectTableProps,
    // eslint-disable-next-line no-unused-vars
    toolbarProps: bulkSelectToolBarProps, //enable when filtering api endpoints by ID is possible. RHINENG-12138
  } = useSystemBulkSelect({
    total,
    perPage,
    onSelect: onSelectProp,
    preselected: preselection,
    fetchArguments: systemFetchArguments,
    currentPageIds: items.map(({ id }) => id),
  });

  useInventoryUtilities(inventory, selectedIds, activeFilterValues);

  const onComplete = useCallback(
    (result) => {
      setTotal(result.meta.totalCount);
      setItems(result.entities);
      setPerPage(result.perPage);
      setIsLoaded(true);
      setCurrentTags(result.meta.tags);

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

  const fetchSystems = useFetchSystemsV2(
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
    filter: systemsFilter,
    selected: selectedIds,
    total,
    fetchArguments: {
      ...systemFetchArguments,
    },
    fetchApi,
  });

  const handleOperatingSystemsFetch = useCallback(
    () => fetchCustomOSes({ filters: defaultFilter, policyId }),
    [defaultFilter, fetchCustomOSes, policyId]
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
            name: false,
            operatingSystem: false,
            tags: true, //enable when tag filtering is supported by complience-client package
            hostGroupFilter: !showGroupsFilter,
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
          // {...bulkSelectToolBarProps} //enable when filtering api endpoints by ID is possible. RHINENG-12138
          {...(!showAllSystems && {
            ...conditionalFilter,
            ...(remediationsEnabled && {
              dedicatedAction: (
                <RemediationButton policyId={policyId} systems={selectedIds} />
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
  showOsFilter: PropTypes.bool,
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
