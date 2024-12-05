/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { NoSystemsTableWithWarning } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import EditSystemsButtonToolbarItem from './EditSystemsButtonToolbarItem';
import { apiInstance } from '@/Utilities/hooks/useQuery';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import { systemsDataMapper } from '@/constants';
import dataSerialiser from '@/Utilities/dataSerialiser';
import { buildOSObject } from '@/Utilities/helpers';
import NoResultsTable from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';

const fetchApi = (offset, limit, fetchArguments) =>
  apiInstance
    .policySystems(
      fetchArguments.policyId,
      null,
      fetchArguments.tags,
      limit,
      offset,
      null,
      fetchArguments.sortBy,
      fetchArguments.filter
    )
    .then(({ data: { data = [], meta = {} } = {} } = {}) => ({
      data: dataSerialiser(data, systemsDataMapper),
      meta,
    }));

const fetchCustomOSes = ({ policyId, filters }) =>
  apiInstance.policySystemsOS(policyId, null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });

const PolicySystemsTab = ({ policy }) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  return (
    <SystemsTable
      columns={[
        Columns.customName(
          {
            showLink: true,
          },
          { sortBy: apiV2Enabled ? ['display_name'] : ['name'] }
        ),
        Columns.inventoryColumn('tags'),
        Columns.OS(apiV2Enabled),
      ]}
      showOsMinorVersionFilter={[policy.osMajorVersion]}
      policyId={policy.id}
      defaultFilter={apiV2Enabled ? null : `policy_id = ${policy.id}`}
      policyRefId={policy.refId}
      showActions={false}
      remediationsEnabled={false}
      noSystemsTable={
        policy?.hosts?.length === 0 || policy?.totalHostCount === 0 ? (
          <NoSystemsTableWithWarning />
        ) : (
          <NoResultsTable kind="systems" />
        )
      }
      complianceThreshold={policy.complianceThreshold}
      dedicatedAction={<EditSystemsButtonToolbarItem policy={policy} />}
      fetchApi={fetchApi}
      apiV2Enabled={apiV2Enabled}
      fetchCustomOSes={fetchCustomOSes}
      ignoreOsMajorVersion
    />
  );
};

PolicySystemsTab.propTypes = {
  policy: propTypes.shape({
    id: propTypes.string.isRequired,
    complianceThreshold: propTypes.string.isRequired,
    osMajorVersion: propTypes.string.isRequired,
    hosts: propTypes.array.isRequired,
    refId: propTypes.string.isRequired,
    totalHostCount: propTypes.number,
  }),
  dedicatedAction: propTypes.object,
  systemTableProps: propTypes.object,
};

export default PolicySystemsTab;
