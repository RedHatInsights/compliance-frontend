import React from 'react';
import SystemsTable from '../SystemsTable/SystemsTable';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';

const ComplianceSystems = () => {
    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'facts.compliance.policies',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'facts.compliance.details_link',
        title: '',
        props: {
            width: 20, isStatic: true
        }
    }];

    return (
        <React.Fragment>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="Compliance systems" />
            </PageHeader>
            <Main>
                <SystemsTable showAllSystems remediationsEnabled={false} columns={columns} />
            </Main>
        </React.Fragment>
    );
};

export default ComplianceSystems;
