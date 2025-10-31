import React from 'react';
import propTypes from 'prop-types';
import { NoSystemsTableWithWarning } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import EditSystemsButtonToolbarItem from './EditSystemsButtonToolbarItem';
import NoResultsTable from 'PresentationalComponents/NoResultsTable/NoResultsTable';

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
        policy.total_system_count === 0 ? (
          <NoSystemsTableWithWarning />
        ) : (
          <NoResultsTable kind="systems" />
        )
      }
      complianceThreshold={policy.compliance_threshold}
      dedicatedAction={<EditSystemsButtonToolbarItem policy={policy} />}
      ignoreOsMajorVersion
    />
  );
};

PolicySystemsTab.propTypes = {
  policy: propTypes.shape({
    id: propTypes.string.isRequired,
    compliance_threshold: propTypes.string.isRequired,
    total_system_count: propTypes.number.isRequired,
  }),
  dedicatedAction: propTypes.object,
  systemTableProps: propTypes.object,
};

export default PolicySystemsTab;
