import React from 'react';
import CompliancePoliciesTable from '../CompliancePoliciesTable/CompliancePoliciesTable';
import CompliancePoliciesDonuts from '../CompliancePoliciesDonuts/CompliancePoliciesDonuts';

const CompliancePolicies = () => {
    return (
        <React.Fragment>
            <CompliancePoliciesDonuts />
            <CompliancePoliciesTable />
        </React.Fragment>
    );
};

export default CompliancePolicies;
