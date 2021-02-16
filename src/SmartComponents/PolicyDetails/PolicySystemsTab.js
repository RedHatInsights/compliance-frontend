import React from 'react';
import propTypes from 'prop-types';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';

const PolicySystemsTab = ({ policy, systemTableProps }) => (
    <InventoryTable
        query={ GET_SYSTEMS }
        policyId={ policy.id }
        defaultFilter={ `policy_id = ${policy.id}` }
        showActions={ false }
        remediationsEnabled={ false }
        columns={ ['Name', 'SSG version'] }
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
