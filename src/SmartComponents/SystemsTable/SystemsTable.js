import React, { useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Alert, Spinner } from '@patternfly/react-core';
import { TableVariant } from '@patternfly/react-table';
// eslint-disable-next-line max-len
import ComplianceRemediationButton from '@/PresentationalComponents/ComplianceRemediationButton';
import EditSystemsButtonToolbarItem from '../PolicyDetails/EditSystemsButtonToolbarItem';
import {
  DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
  COMPLIANT_SYSTEMS_FILTER_CONFIGURATION,
} from '@/constants';
import { ErrorPage, StateView, StateViewPart } from 'PresentationalComponents';
import useFilterConfig from 'Utilities/hooks/useTableTools/useFilterConfig';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { policyFilter, defaultOnLoad, ssgVersionFilter } from './constants';
import {
  useFetchSystems,
  useGetEntities,
  useOsMinorVersionFilter,
  useInventoryUtilities,
  useSystemsExport,
  useSystemsFilter,
  useSystemBulkSelect,
  useTags,
} from './hooks';

export const SystemsTable = ({
  columns,
  showAllSystems,
  policyId,
  query,
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
  onSelect: onSelectProp,
  noSystemsTable,
  tableProps,
  ssgVersions,
}) => {
  const inventory = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
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
        ...DEFAULT_SYSTEMS_FILTER_CONFIGURATION,
        ...(compliantFilter ? COMPLIANT_SYSTEMS_FILTER_CONFIGURATION : []),
        ...(policies?.length > 0 ? policyFilter(policies, showOsFilter) : []),
        ...(ssgVersions ? ssgVersionFilter(ssgVersions) : []),
        ...osMinorVersionFilter,
      ],
    },
  });
  const systemsFilter = useSystemsFilter(
    filterString(),
    showOnlySystemsWithTestResults,
    defaultFilter
  );

  const {
    props: tagsProps,
    currentTags,
    setCurrentTags,
    getTags,
  } = useTags({
    variables: {
      filter: systemsFilter,
      ...(policyId && { policyId }),
    },
  });

  const systemFetchArguments = {
    query,
    variables: {
      tags: currentTags,
      filter: systemsFilter,
      ...(policyId && { policyId }),
    },
  };

  const preselection = useMemo(
    () => preselectedSystems.map(({ id }) => id),
    [preselectedSystems]
  );

  const {
    selectedIds,
    selectedSystems,
    tableProps: bulkSelectTableProps,
    toolbarProps: bulkSelectToolBarProps,
  } = useSystemBulkSelect({
    total,
    onSelect: onSelectProp,
    preselected: preselection,
    fetchArguments: systemFetchArguments,
    currentPageIds: items.map(({ id }) => id),
    systemsCache: items,
  });

  useInventoryUtilities(inventory, selectedIds, activeFilterValues);

  const onComplete = (result) => {
    setTotal(result.meta.totalCount);
    setItems(result.entities);
    setIsLoaded(true);
    setCurrentTags && setCurrentTags(result.meta.tags);

    if (
      emptyStateComponent &&
      result.meta.totalCount === 0 &&
      activeFilterValues.length === 0 &&
      result?.meta?.tags?.length === 0
    ) {
      setIsEmpty(true);
    }
  };

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
      tags: currentTags,
      ...systemFetchArguments,
    },
  });

  const mergedColumns = (defaultColumns) =>
    columns.map((column) => {
      const isStringCol = typeof column === 'string';
      const key = isStringCol ? column : column.key;
      const defaultColumn = defaultColumns.find(
        (defaultCol) => defaultCol.key === key
      );
      return {
        ...defaultColumn,
        ...(isStringCol ? { key: column } : column),
        props: {
          ...defaultColumn?.props,
          ...column?.props,
        },
      };
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
          {...tagsProps}
          disableDefaultColumns
          columns={mergedColumns}
          noSystemsTable={noSystemsTable}
          ref={inventory}
          getEntities={getEntities}
          getTags={getTags}
          onLoad={defaultOnLoad(columns)}
          tableProps={{
            ...bulkSelectTableProps,
            isStickyHeader: true,
            ...tableProps,
          }}
          fallback={<Spinner />}
          variant={compact ? TableVariant.compact : ''}
          {...bulkSelectToolBarProps}
          {...(!showAllSystems && {
            ...conditionalFilter,
            ...(remediationsEnabled && {
              dedicatedAction: (
                <ComplianceRemediationButton
                  allSystems={selectedSystems}
                  selectedRules={[]}
                />
              ),
            }),
          })}
          {...{
            dedicatedAction: (
              <EditSystemsButtonToolbarItem systems={selectedSystems} />
            ),
          }}
          {...(enableExport && { exportConfig })}
          {...(showActions && {
            actions: [
              {
                title: 'View in inventory',
                onClick: (_event, _index, { id }) => {
                  const beta =
                    window.location.pathname.split('/')[1] === 'beta';
                  window.location.href = `${window.location.origin}${
                    beta ? '/beta' : ''
                  }/insights/inventory/${id}`;
                },
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
};

export default SystemsTable;
