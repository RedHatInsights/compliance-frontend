import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';

const EmptyState = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-v5-u-mb-md">
      <Text>
        You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
        Insights and enabled for Compliance.
      </Text>
    </TextContent>
    <TextContent className="pf-v5-u-mb-md">
      <Text>Connect RHEL {osMajorVersion} systems to Insights.</Text>
    </TextContent>
  </React.Fragment>
);

EmptyState.propTypes = {
  osMajorVersion: propTypes.string,
};

const PrependComponent = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-v5-u-mb-md">
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
  selectedSystems = [],
}) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  const { id: policyId, osMajorVersion, supportedOsVersions } = policy;
  const osMinorVersions = supportedOsVersions.map(
    (version) => version.split('.')[1]
  );
  const osFilter =
    osMajorVersion &&
    `os_major_version = ${osMajorVersion} AND os_minor_version ^ (${osMinorVersions.join(
      ','
    )})`;
  const defaultFilter = osFilter
    ? `${osFilter} or policy_id = ${policyId}`
    : `policy_id = ${policyId}`;

  return (
    <React.Fragment>
      <SystemsTable
        columns={[
          Columns.Name,
          Columns.inventoryColumn('tags'),
          Columns.OperatingSystem(apiV2Enabled),
        ]}
        showOsMinorVersionFilter={[osMajorVersion]}
        prependComponent={<PrependComponent osMajorVersion={osMajorVersion} />}
        emptyStateComponent={<EmptyState osMajorVersion={osMajorVersion} />}
        compact
        showActions={false}
        defaultFilter={defaultFilter}
        enableExport={false}
        remediationsEnabled={false}
        preselectedSystems={selectedSystems.map(({ id }) => id)}
        onSelect={onSystemSelect}
        apiV2Enabled={false} //TODO: change to useAPIV2FeatureFlag when migrating to REST
      />
    </React.Fragment>
  );
};

EditPolicySystemsTab.propTypes = {
  policy: propTypes.object,
  newRuleTabs: propTypes.bool,
  onSystemSelect: propTypes.func,
  selectedSystems: propTypes.array,
};

export default EditPolicySystemsTab;
