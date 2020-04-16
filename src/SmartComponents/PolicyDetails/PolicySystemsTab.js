import { SystemsTable } from 'SmartComponents';
import React from 'react';
import propTypes from 'prop-types';

const PolicySystemsTab = ({ policy, complianceThreshold }) => (
    <SystemsTable policyId={policy.id}
        remediationsEnabled={false}
        columns={[{
            key: 'facts.compliance.display_name',
            title: 'System name',
            props: {
                width: 40
            }
        }]}
        complianceThreshold={ complianceThreshold }
    />
);

PolicySystemsTab.propTypes = {
    policy: propTypes.shape({
        id: propTypes.string.isRequired
    }),
    complianceThreshold: propTypes.number
};

export default PolicySystemsTab;
