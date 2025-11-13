import React, { useMemo } from 'react';
import { Content } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from 'SmartComponents/SystemsTable/SystemsTable';
import * as Columns from 'SmartComponents/SystemsTable/Columns';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';

const systemTableColumns = [
  Columns.Name,
  Columns.Tags,
  Columns.OperatingSystem(),
];

const EmptyState = ({ osMajorVersion }) => {
  const isLightspeedEnabled = useFeatureFlag('platform.lightspeed-rebrand');
  const serviceName = isLightspeedEnabled ? 'Red Hat Lightspeed' : 'Insights';
  return (
    <div data-testid="empty-state">
      <Content className="pf-v6-u-mb-md">
        <Content component="p">
          You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
          {serviceName} and enabled for Compliance.
        </Content>
      </Content>
      <Content className="pf-v6-u-mb-md">
        <Content component="p">
          Connect RHEL {osMajorVersion} systems to {serviceName}.
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
  const { os_major_version } = policy;

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
      apiEndpoint="systems"
      columns={systemTableColumns}
      prependComponent={<PrependComponent osMajorVersion={os_major_version} />}
      emptyStateComponent={<EmptyState osMajorVersion={os_major_version} />}
      compact
      defaultFilter={defaultFilter}
      preselectedSystems={selectedSystems}
      onSelect={onSystemSelect}
      setIsSystemsDataLoading={setIsSystemsDataLoading}
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
