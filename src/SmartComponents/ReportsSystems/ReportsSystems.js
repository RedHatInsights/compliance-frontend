import React from 'react';
import SystemsTable from '../SystemsTable/SystemsTable';
import { ComplianceTabs, ReportTabs } from 'PresentationalComponents';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

const ReportsSystems = () => {
    const columns = [{
        key: 'facts.compliance.display_name',
        title: 'System name',
        props: {
            width: 40
        }
    }, {
        key: 'facts.compliance.policies',
        title: 'Policies',
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
    }];
    const beta = window.insights.chrome.isBeta();

    return (
        <React.Fragment>
            <PageHeader className={ beta ? 'beta-page-header' : 'stable-page-header' } >
                <PageHeaderTitle title="Compliance reports" />
                { beta ? <ReportTabs/> : <ComplianceTabs/> }
            </PageHeader>
            <Main>
                <SystemsTable columns={columns} />
            </Main>
        </React.Fragment>
    );
};

export default ReportsSystems;
