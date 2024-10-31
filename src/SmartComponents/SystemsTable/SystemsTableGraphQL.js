import React, { useMemo, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Alert, Spinner } from '@patternfly/react-core';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import RemediationButton from '@/PresentationalComponents/ComplianceRemediationButton/RemediationButton';
import {
  defaultSystemsFilterConfiguration,
  compliantSystemFilterConfiguration,
  complianceReportTableAdditionalFilter,
  DEFAULT_SYSTEMS_FILTER_CONFIGURATION_GRAPHQL,
  POLICY_FILTER_KEY_GRAPHQL,
  FAILED_RULE_SEVERITY_FITLER_KEY_GRAPHQL,
  COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_GRAPHQL,
} from '@/constants';
import { ErrorPage, StateView, StateViewPart } from 'PresentationalComponents';
import useFilterConfig from 'Utilities/hooks/useTableTools/useFilterConfig';
import {
  policyFilter,
  defaultOnLoad,
  ssgVersionFilter,
  mergedColumns,
  SSG_VERSION_FILTER_KEY_GRAPHQL,
} from './constants';
import {
  useGetEntities,
  useOsMinorVersionFilter,
  useInventoryUtilities,
  useSystemsExport,
  useSystemsFilter,
  useSystemBulkSelect,
} from './hooks';
import { useFetchSystems } from './hooks/useFetchSystems';
import { constructQuery } from '../../Utilities/helpers';

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
  error,
  showComplianceSystemsInfo,
  compact,
  remediationsEnabled,
  systemProps,
  defaultFilter,
  emptyStateComponent,
  prependComponent,
  showOsMinorVersionFilter,
  preselectedSystems,
  onSelect,
  noSystemsTable,
  tableProps,
  ssgVersions,
  dedicatedAction,
  ruleSeverityFilter,
  showGroupsFilter,
}) => {
  const inventory = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentTags, setCurrentTags] = useState([]);
  const navigateToInventory = useNavigate('inventory');
  const osMinorVersionFilter = useOsMinorVersionFilter(
    showOsMinorVersionFilter,
    {
      variables: {
        filter: defaultFilter,
        ...(policyId && { policyId }),
      },
    }
  );

  const {
    toolbarProps: conditionalFilter,
    filterString,
    activeFilterValues,
  } = useFilterConfig({
    filters: {
      filterConfig: [
        ...defaultSystemsFilterConfiguration(
          DEFAULT_SYSTEMS_FILTER_CONFIGURATION_GRAPHQL
        ),
        ...(compliantFilter
          ? compliantSystemFilterConfiguration(
              COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_GRAPHQL
            )
          : []),
        ...(policies?.length > 0
          ? policyFilter(policies, showOsFilter, POLICY_FILTER_KEY_GRAPHQL)
          : []),
        ...(ssgVersions
          ? ssgVersionFilter(ssgVersions, SSG_VERSION_FILTER_KEY_GRAPHQL)
          : []),
        ...osMinorVersionFilter,
        ...(ruleSeverityFilter
          ? complianceReportTableAdditionalFilter(
              FAILED_RULE_SEVERITY_FITLER_KEY_GRAPHQL
            )
          : []),
      ],
    },
  });
  const systemsFilter = useSystemsFilter(
    filterString(),
    showOnlySystemsWithTestResults,
    defaultFilter
  );

  const constructedQuery = useMemo(() => constructQuery(columns), [columns]);

  const systemFetchArguments = useMemo(
    () => ({
      query: constructedQuery.query,
      variables: {
        ...constructedQuery.fragments,
        tags: currentTags,
        filter: systemsFilter,
        ...(policyId && { policyId }),
      },
    }),
    [constructedQuery, currentTags, systemsFilter, policyId]
  );

  const {
    selectedIds,
    tableProps: bulkSelectTableProps,
    toolbarProps: bulkSelectToolBarProps,
  } = useSystemBulkSelect({
    total,
    onSelect,
    preselectedSystems,
    fetchArguments: systemFetchArguments,
    currentPageItems: items,
  });

  useInventoryUtilities(inventory, selectedIds, activeFilterValues);

  const onComplete = useCallback(
    (result) => {
      setTotal(result.meta.totalCount);
      setItems(result.entities);
      setIsLoaded(true);
      setCurrentTags && setCurrentTags(result.meta.tags);

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

  const fetchSystems = useFetchSystems({
    ...systemFetchArguments,
    onComplete,
  });
  const getEntities = useGetEntities(fetchSystems, {
    selected: selectedIds,
    columns,
  });
  const exportConfig = useSystemsExport({
    columns,
    filter: systemsFilter,
    selected: selectedIds,
    total,
    fetchArguments: {
      ...systemFetchArguments,
    },
  });

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
            tags: false,
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
          {...bulkSelectToolBarProps}
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
