import React from 'react';
import propTypes from 'prop-types';
import { NoSystemsTableWithWarning } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import EditSystemsButtonToolbarItem from './EditSystemsButtonToolbarItem';
import NoResultsTable from '../../Utilities/hooks/useTableTools/Components/NoResultsTable';

const PolicySystemsTab = ({ policy }) => {
  return (
    <SystemsTable
      apiEndpoint="policySystems"
      columns={[
        Columns.customName(
          {
            showLink: true,
          },
          { sortBy: ['display_name'] },
        ),
        Columns.Tags,
        Columns.OS(),
      ]}
      policyId={policy.id}
      noSystemsTable={
        policy?.hosts?.length === 0 || policy?.totalHostCount === 0 ? (
          <NoSystemsTableWithWarning />
        ) : (
          <NoResultsTable kind="systems" />
        )
      }
      complianceThreshold={policy.complianceThreshold}
      dedicatedAction={<EditSystemsButtonToolbarItem policy={policy} />}
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
