import React from 'react';
import SystemsTable from '../SystemsTable/SystemsTable';
import { ComplianceTabs } from 'PresentationalComponents';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

const ComplianceSystems = () => {
    const columns = [{
        key: 'display_name',
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
        title: 'Last scanned',
        props: {
            width: 10
        }
    }];

    const beta = window.location.pathname.split('/')[1] === 'beta';

    return (
        <React.Fragment>
            <PageHeader className={ beta ? 'beta-page-header' : 'stable-page-header' } >
                <PageHeaderTitle title="Compliance systems" />
                { !beta && <ComplianceTabs/> }
            </PageHeader>
            <Main>
                <SystemsTable showAllSystems remediationsEnabled={false} columns={columns} />
            </Main>
        </React.Fragment>
    );
};

export default ComplianceSystems;
