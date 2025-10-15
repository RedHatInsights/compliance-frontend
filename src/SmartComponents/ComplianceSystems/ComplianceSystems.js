import React from 'react';
import { Alert } from '@patternfly/react-core';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import CompliancePageHeader from 'PresentationalComponents/CompliancePageHeader/CompliancePageHeader';
import { systemsPopoverData } from '@/constants';

const ComplianceSystems = () => {
  const navigateToInventory = useNavigate('inventory');
  const { data, error, loading } = usePolicies();
  const policies = data?.data;

  return (
    <React.Fragment>
      <CompliancePageHeader
        mainTitle={'Systems'}
        popoverData={systemsPopoverData}
      />
      <section className="pf-v6-c-page__main-section">
        <StateViewWithError stateValues={{ error, data: policies, loading }}>
          <StateViewPart stateKey="data">
            <Alert
              isInline
              variant="info"
              ouiaId="SystemsListIsDifferentAlert"
              title={
                'The list of systems in this view is different than those that appear in the Inventory. ' +
                'Only systems currently associated with or reporting against compliance policies are displayed.'
              }
            />
            <SystemsTable
              compact
              defaultFilter="assigned_or_scanned = true"
              columns={({
                displayName,
                OS,
                // policies,
                tags,
                workspace,
                lastSeen,
              }) => {
                return [
                  {
                    ...displayName,
                    componentProps: { showLink: true },
                  },
                  workspace,
                  tags,
                  OS,
                  // policies,
                  lastSeen,
                ];
              }}
              filters={(inventoryFilters, complianceFilters) => {
                const {
                  policies: policiesFilter,
                  groups: complianceGroupsFilter,
                } = complianceFilters;
                const { groups } = inventoryFilters;

                return [
                  {
                    ...policiesFilter,
                    items: policies,
                  },
                  { ...groups, ...complianceGroupsFilter },
                ];
              }}
              options={(
                inventoryDefaultTableOptions,
                complianceDefaultTableToolsOptions,
              ) => ({
                ...inventoryDefaultTableOptions,
                ...complianceDefaultTableToolsOptions,
                onSelect: true,
              })}
              actions={[
                {
                  title: 'View in inventory',
                  onClick: (_event, _index, { id }) =>
                    navigateToInventory('/' + id),
                },
              ]}
            />
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

export default ComplianceSystems;
