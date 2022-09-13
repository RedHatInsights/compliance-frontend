/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { NoSystemsTableWithWarning } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS_WITH_REPORTS } from '../SystemsTable/constants';
import * as Columns from '../SystemsTable/Columns';
import EditSystemsButtonToolbarItem from './EditSystemsButtonToolbarItem';
import { useAnchor } from 'Utilities/Router';

const PolicySystemsTab = ({ policy }) => {
  const anchor = useAnchor();

  return (
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
      query={GET_SYSTEMS_WITH_REPORTS}
      policyId={policy.id}
      defaultFilter={`policy_id = ${policy.id}`}
      showActions={false}
      remediationsEnabled={false}
      noSystemsTable={
        policy?.hosts?.length === 0 && <NoSystemsTableWithWarning />
      }
      complianceThreshold={policy.complianceThreshold}
      dedicatedAction={
        <EditSystemsButtonToolbarItem
          to={`/scappolicies/${policy.id}/edit`}
          state={{ policy }}
          hash={anchor}
          backgroundLocation={{ hash: 'details' }}
          variant="primary"
          ouiaId="EditSystemsButton"
        />
      }
    />
  );
};

PolicySystemsTab.propTypes = {
  policy: propTypes.shape({
    id: propTypes.string.isRequired,
    complianceThreshold: propTypes.number.isRequired,
    osMajorVersion: propTypes.string.isRequired,
    hosts: propTypes.array.isRequired,
  }),
  systemTableProps: propTypes.object,
  dedicatedAction: propTypes.object,
};

export default PolicySystemsTab;
