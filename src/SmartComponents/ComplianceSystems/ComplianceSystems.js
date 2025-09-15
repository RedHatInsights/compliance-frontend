import React from 'react';
import { Alert } from '@patternfly/react-core';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import CompliancePageHeader from 'PresentationalComponents/CompliancePageHeader/CompliancePageHeader';
import { systemsPopoverData } from '@/constants';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';

const systemTableColumns = [
  Columns.customName(
    {
      showLink: true,
    },
    { sortable: ['display_name'] },
  ),
  Columns.Workspaces,
  Columns.Tags,
  Columns.OS(),
  Columns.Policies,
  Columns.Updated,
];

const ComplianceSystems = () => {
  const navigateToInventory = useNavigate('inventory');
  const { data, error, loading } = usePolicies();
  const policies = data?.data;

  const isLightspeedEnabled = useFeatureFlag('platform.lightspeed-rebrand');
  const serviceName = isLightspeedEnabled ? 'Red Hat Lightspeed' : 'Insights';

  return (
    <React.Fragment>
      <CompliancePageHeader
        mainTitle={'Systems'}
        popoverData={systemsPopoverData(serviceName)}
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
              isFullView
              columns={systemTableColumns}
              defaultFilter="assigned_or_scanned=true"
              filters={{
                policies,
                groups: true,
              }}
              actions={[
                {
                  title: 'View in inventory',
                  onClick: (_event, _index, { id }) =>
                    navigateToInventory('/' + id),
                },
              ]}
              onSelect={true}
            />
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

export default ComplianceSystems;
