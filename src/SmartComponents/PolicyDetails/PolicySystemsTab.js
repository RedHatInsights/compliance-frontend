import React from 'react';
import propTypes from 'prop-types';

import { SystemsTable } from 'SmartComponents';

const PolicySystemsTab = ({ policy, complianceThreshold }) => (
    <SystemsTable policyId={policy.id}
        remediationsEnabled={false}
        columns={[{
            key: 'facts.compliance.display_name',
            title: 'System name',
            props: {
                width: 40, isStatic: true
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
