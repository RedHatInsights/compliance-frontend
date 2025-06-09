import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import {
  fetchSystemsApi,
  fetchCustomOSes,
} from 'SmartComponents/SystemsTable/constants';

const EmptyState = ({ osMajorVersion }) => (
  <div data-testid="empty-state">
    <TextContent className="pf-v5-u-mb-md">
      <Text>
        You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
        Insights and enabled for Compliance.
      </Text>
    </TextContent>
    <TextContent className="pf-v5-u-mb-md">
      <Text>Connect RHEL {osMajorVersion} systems to Insights.</Text>
    </TextContent>
  </div>
);

EmptyState.propTypes = {
  osMajorVersion: propTypes.string,
};

const PrependComponent = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-v5-u-mb-md" data-testid="prepend-component">
      <Text>
        Select which of your <b>RHEL {osMajorVersion}</b> systems should be
        included in this policy.
      </Text>
    </TextContent>
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

  const defaultFilter =
    os_major_version &&
    `os_major_version = ${os_major_version} AND os_minor_version ^ (${supportedOsVersions.join(
      ' '
    )})`;

  return (
    <SystemsTable
      columns={[
        Columns.Name,
        Columns.inventoryColumn('tags'),
        Columns.OperatingSystem(),
      ]}
      showOsMinorVersionFilter={[os_major_version]}
      prependComponent={<PrependComponent osMajorVersion={os_major_version} />}
      emptyStateComponent={<EmptyState osMajorVersion={os_major_version} />}
      compact
      showActions={false}
      defaultFilter={defaultFilter}
      enableExport={false}
      remediationsEnabled={false}
      preselectedSystems={selectedSystems}
      onSelect={onSystemSelect}
      fetchApi={fetchSystemsApi}
      fetchCustomOSes={fetchCustomOSes}
      setIsSystemsDataLoading={setIsSystemsDataLoading}
    />
  );
};

EditPolicySystemsTab.propTypes = {
  policy: propTypes.object,
  newRuleTabs: propTypes.bool,
  onSystemSelect: propTypes.func,
  selectedSystems: propTypes.array,
  supportedOsVersions: propTypes.array,
  setIsSystemsDataLoading: propTypes.func,
};

export default EditPolicySystemsTab;
