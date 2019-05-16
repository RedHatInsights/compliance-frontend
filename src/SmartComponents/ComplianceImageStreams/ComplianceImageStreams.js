import React from 'react';
import ComplianceTabs from '../ComplianceTabs/ComplianceTabs';
import ComplianceImageStreamsTable from '../ComplianceImageStreamsTable/ComplianceImageStreamsTable';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

const ComplianceImageStreams = () => {
    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title="Compliance" />
                <ComplianceTabs/>
            </PageHeader>
            <Main>
                <ComplianceImageStreamsTable />
            </Main>
        </React.Fragment>
    );
};

export default ComplianceImageStreams;
