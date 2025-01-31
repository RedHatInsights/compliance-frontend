import React from 'react';
import { nowrap } from '@patternfly/react-table';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import dataSerialiser from '@/Utilities/dataSerialiser';
import { policiesDataMapper } from '@/constants';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import {
  fetchSystemsApi,
  fetchCustomOSes,
} from 'SmartComponents/SystemsTable/constants';

const DEFAULT_FILTER = 'assigned_or_scanned=true';

const ComplianceSystems = () => {
  let { data: { data: policiesData } = {}, error, loading } = usePolicies();

  if (policiesData) {
    policiesData = dataSerialiser(policiesData, policiesDataMapper);
  }

  const apiV2Enabled = useAPIV2FeatureFlag();

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle title="Systems" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <StateViewWithError
          stateValues={{ error, data: policiesData, loading }}
        >
          <StateViewPart stateKey="data">
            {policiesData && (
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
                  Columns.OS(apiV2Enabled),
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
                showOsMinorVersionFilter={policiesData.map(
                  (policy) => policy.osMajorVersion
                )}
                showComplianceSystemsInfo
                enableEditPolicy={false}
                remediationsEnabled={false}
                policies={policiesData}
                showGroupsFilter
                fetchApi={fetchSystemsApi}
                fetchCustomOSes={fetchCustomOSes}
                apiV2Enabled={apiV2Enabled}
              />
            )}
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

export default ComplianceSystems;
