import { SystemsTable } from 'SmartComponents';
import React from 'react';
import propTypes from 'prop-types';

const PolicySystemsTab = ({ policy, complianceThreshold }) => (
    <SystemsTable policyId={policy.id}
        columns={[{
            key: 'facts.compliance.display_name',
            title: 'System name',
            props: {
                width: 40
            }
        }, {
            key: 'facts.compliance.compliance_score',
            title: 'Compliance score',
            props: {
                width: 10
            }
        }, {
            key: 'facts.compliance.last_scanned',
            title: 'Last scanned',
            props: {
                width: 10
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
