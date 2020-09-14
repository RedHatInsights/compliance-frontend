import React from 'react';
import propTypes from 'prop-types';
import { SystemsTable } from 'SmartComponents';

const PolicySystemsTab = ({ policy, systemTableProps }) => (
    <SystemsTable
        policyId={ policy.id }
        showActions={ false }
        remediationsEnabled={ false }
        columns={[{
            key: 'facts.compliance.display_name',
            title: 'System name',
            props: {
                width: 40, isStatic: true
            }
        }]}
        complianceThreshold={ policy.complianceThreshold }
        { ...systemTableProps }
    />
);

PolicySystemsTab.propTypes = {
    policy: propTypes.shape({
        id: propTypes.string.isRequired,
        complianceThreshold: propTypes.number.isRequired
    }),
    systemTableProps: propTypes.object
};

export default PolicySystemsTab;
