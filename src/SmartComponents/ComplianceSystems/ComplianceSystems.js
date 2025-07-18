import React from 'react';
import { Alert } from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import usePolicies from 'Utilities/hooks/api/usePolicies';

const ComplianceSystems = () => {
  const navigateToInventory = useNavigate('inventory');
  const { data, error, loading } = usePolicies();
  const policies = data?.data;

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="Systems" />
      </PageHeader>
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
              columns={[
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
              ]}
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
