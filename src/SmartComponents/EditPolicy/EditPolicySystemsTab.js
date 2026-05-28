import React, { useMemo, useState } from 'react';
import { Content } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from 'SmartComponents/SystemsTable/SystemsTable';
import * as Columns from 'SmartComponents/SystemsTable/Columns';
import SystemsViewToggle, { SYSTEMS_VIEW } from './SystemsViewToggle';

const systemTableColumns = [
  Columns.Name,
  Columns.Tags,
  Columns.OperatingSystem(),
];

const EmptyState = ({ osMajorVersion }) => {
  return (
    <div data-testid="empty-state">
      <Content className="pf-v6-u-mb-md">
        <Content component="p">
          You do not have any <b>RHEL {osMajorVersion}</b> systems connected to{' '}
          Red Hat Lightspeed and enabled for Compliance.
        </Content>
      </Content>
      <Content className="pf-v6-u-mb-md">
        <Content component="p">
          Connect RHEL {osMajorVersion} systems to Red Hat Lightspeed.
        </Content>
      </Content>
    </div>
  );
};

EmptyState.propTypes = {
  osMajorVersion: propTypes.string,
};

const PrependComponent = ({ osMajorVersion }) => (
  <React.Fragment>
    <Content className="pf-v6-u-mb-md" data-testid="prepend-component">
      <Content component="p">
        Select which of your <b>RHEL {osMajorVersion}</b> systems should be
        included in this policy.
      </Content>
    </Content>
  </React.Fragment>
);

PrependComponent.propTypes = {
  osMajorVersion: propTypes.string,
};

const EditPolicySystemsTab = ({
  policy,
  onSystemSelect,
  selectedSystems,
  supportedOsVersions,
  setIsSystemsDataLoading,
}) => {
  const { id: policyId, os_major_version } = policy;
  const [systemsView, setSystemsView] = useState(SYSTEMS_VIEW.ALL);
  const isAllSystemsView = systemsView === SYSTEMS_VIEW.ALL;

  const defaultFilter = useMemo(
    () =>
      os_major_version &&
      `os_major_version = ${os_major_version} AND os_minor_version ^ (${supportedOsVersions.join(
        ' ',
      )})`,
    [os_major_version, supportedOsVersions],
  );

  return (
    <SystemsTable
      key={systemsView}
      apiEndpoint={isAllSystemsView ? 'systems' : 'policySystems'}
      policyId={isAllSystemsView ? undefined : policyId}
      columns={systemTableColumns}
      prependComponent={<PrependComponent osMajorVersion={os_major_version} />}
      emptyStateComponent={
        isAllSystemsView ? (
          <EmptyState osMajorVersion={os_major_version} />
        ) : undefined
      }
      compact
      defaultFilter={isAllSystemsView ? defaultFilter : undefined}
      ignoreOsMajorVersion={!isAllSystemsView}
      preselectedSystems={selectedSystems}
      onSelect={onSystemSelect}
      setIsSystemsDataLoading={setIsSystemsDataLoading}
      enableExport={false}
      dedicatedAction={
        <SystemsViewToggle
          systemsView={systemsView}
          onSystemsViewChange={setSystemsView}
        />
      }
    />
  );
};

EditPolicySystemsTab.propTypes = {
  policy: propTypes.object,
  onSystemSelect: propTypes.func,
  selectedSystems: propTypes.array,
  supportedOsVersions: propTypes.array,
  setIsSystemsDataLoading: propTypes.func,
};

export default EditPolicySystemsTab;
