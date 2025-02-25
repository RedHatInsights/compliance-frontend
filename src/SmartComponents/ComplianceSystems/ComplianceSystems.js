import React from 'react';
import { nowrap } from '@patternfly/react-table';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import {
  fetchSystemsApi,
  fetchCustomOSes,
} from 'SmartComponents/SystemsTable/constants';

const DEFAULT_FILTER = 'assigned_or_scanned=true';

const ComplianceSystems = () => {
  let { data: { data: policies } = {}, error, loading } = usePolicies();

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="Systems" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError stateValues={{ error, data: policies, loading }}>
          <StateViewPart stateKey="data">
            {policies && (
              <SystemsTable
                columns={[
                  Columns.customName(
                    {
                      showLink: true,
                    },
                    { sortBy: ['display_name'] }
                  ),
                  Columns.inventoryColumn('groups', {
                    requiresDefault: true,
                    sortBy: ['groups'],
                  }),
                  Columns.inventoryColumn('tags'),
                  Columns.OS(),
                  Columns.Policies,
                  Columns.inventoryColumn('updated', {
                    props: { isStatic: true },
                    transforms: [nowrap],
                  }),
                ]}
                defaultFilter={DEFAULT_FILTER}
                systemProps={{
                  isFullView: true,
                }}
                showOsMinorVersionFilter={policies.map(
                  (policy) => policy.os_major_version
                )}
                showComplianceSystemsInfo
                enableEditPolicy={false}
                remediationsEnabled={false}
                policies={policies}
                showGroupsFilter
                fetchApi={fetchSystemsApi}
                fetchCustomOSes={fetchCustomOSes}
              />
            )}
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

export default ComplianceSystems;
