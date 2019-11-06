import React from 'react';
import { ComplianceTabs } from 'PresentationalComponents';
import ComplianceImageStreamsTable from '../ComplianceImageStreamsTable/ComplianceImageStreamsTable';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

// TODO: There should be a "layout" presentational component
// Multiple Smart Components build upon the schema elements
// ps.: I think this ComplianceImageStreams shouldn't exist. Further investigation needed
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
