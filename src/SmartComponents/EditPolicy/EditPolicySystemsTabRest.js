import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import { buildOSObject } from '@/Utilities/helpers';
import { policiesDataMapper, systemsDataMapper } from '@/constants';
import dataSerialiser from '@/Utilities/dataSerialiser';

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

const processSystemsData = (data) =>
  dataSerialiser(
    data.map((entry) => ({
      ...entry,
      policies: dataSerialiser(entry.policies, policiesDataMapper),
    })),
    systemsDataMapper
  );

const fetchApi = async (page, perPage, combinedVariables) =>
  apiInstance
    .systems(
      undefined,
      combinedVariables.tags,
      perPage,
      page,
      combinedVariables.idsOnly,
      combinedVariables.sortBy,
      combinedVariables.filter
    )
    .then(({ data: { data = [], meta = {} } = {} } = {}) => ({
      data: processSystemsData(data),
      meta,
    }));

const fetchCustomOSes = ({ filters }) =>
  apiInstance.systemsOS(null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });

const EditPolicySystemsTab = ({
  policy,
  onSystemSelect,
  selectedSystems,
  supportedOsVersions,
}) => {
  const { os_major_version } = policy;

  const defaultFilter =
    os_major_version &&
    `(os_major_version = ${os_major_version}) AND (os_minor_version ^ "${supportedOsVersions.join(
      ' '
    )}")`;

  return (
    <React.Fragment>
      <SystemsTable
        columns={[
          Columns.Name,
          Columns.inventoryColumn('tags'),
          Columns.OperatingSystem,
        ]}
        showOsMinorVersionFilter={[os_major_version]}
        prependComponent={
          <PrependComponent osMajorVersion={os_major_version} />
        }
        emptyStateComponent={<EmptyState osMajorVersion={os_major_version} />}
        compact
        showActions={false}
        defaultFilter={defaultFilter}
        enableExport={false}
        remediationsEnabled={false}
        preselectedSystems={selectedSystems}
        onSelect={onSystemSelect}
        apiV2Enabled={true}
        fetchApi={fetchApi}
        fetchCustomOSes={fetchCustomOSes}
      />
    </React.Fragment>
  );
};

EditPolicySystemsTab.propTypes = {
  policy: propTypes.object,
  newRuleTabs: propTypes.bool,
  onSystemSelect: propTypes.func,
  selectedSystems: propTypes.array,
  supportedOsVersions: propTypes.array,
};

export default EditPolicySystemsTab;
