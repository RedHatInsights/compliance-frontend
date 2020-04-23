import React from 'react';
import SystemsTable from '../SystemsTable/SystemsTable';
import { ReportTabs } from 'PresentationalComponents';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

const ReportsSystems = () => {
    const columns = [{
        key: 'facts.compliance.display_name',
        title: 'Name',
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
        title: 'Scan date',
        props: {
            width: 10
        }
    }];

    return (
        <React.Fragment>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="Compliance reports" />
                <ReportTabs/>
            </PageHeader>
            <Main>
                <SystemsTable
                    compliantFilter
                    showOnlySystemsWithTestResults
                    columns={columns} />
            </Main>
        </React.Fragment>
    );
};

export default ReportsSystems;
