import React from 'react';
import ComplianceSystemsTable from '../ComplianceSystemsTable/ComplianceSystemsTable';
import ComplianceTabs from '../ComplianceTabs/ComplianceTabs';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

const ComplianceSystems = () => {
    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title="Compliance" />
                <ComplianceTabs/>
            </PageHeader>
            <Main>
                <ComplianceSystemsTable />
            </Main>
        </React.Fragment>
    );
};

export default ComplianceSystems;
