/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { NoSystemsTableWithWarning } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import EditSystemsButtonToolbarItem from './EditSystemsButtonToolbarItem';
import { Alert } from '@patternfly/react-core';

const PolicySystemsTab = ({ policy }) => {
  const hasDifferentSystemCount =
    policy?.totalHostCount !== policy?.hosts.length;
  return (
    <>
      {hasDifferentSystemCount && (
        <Alert
          isInline
          variant="info"
          ouiaId="SystemsListIsDifferentAlert"
          title={'System count is different'}
        />
      )}
      <SystemsTable
        columns={[
          Columns.customName({
            showLink: true,
          }),
          Columns.inventoryColumn('tags'),
          Columns.OS,
          Columns.SsgVersion,
        ]}
        showOsMinorVersionFilter={[policy.osMajorVersion]}
        policyId={policy.id}
        defaultFilter={`policy_id = ${policy.id}`}
        showActions={false}
        remediationsEnabled={false}
        noSystemsTable={
          policy?.hosts?.length === 0 && <NoSystemsTableWithWarning />
        }
        complianceThreshold={policy.complianceThreshold}
        dedicatedAction={<EditSystemsButtonToolbarItem policy={policy} />}
      />
    </>
  );
};

PolicySystemsTab.propTypes = {
  policy: propTypes.shape({
    id: propTypes.string.isRequired,
    complianceThreshold: propTypes.number.isRequired,
    osMajorVersion: propTypes.string.isRequired,
    hosts: propTypes.array.isRequired,
    totalHostCount: propTypes.number.isRequired,
  }),
  dedicatedAction: propTypes.object,
  systemTableProps: propTypes.object,
};

export default PolicySystemsTab;
