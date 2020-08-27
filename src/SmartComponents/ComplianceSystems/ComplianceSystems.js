import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';

const QUERY = gql`
{
    profiles(search: "external = false and canonical = false") {
        edges {
            node {
                id
                name
                refId
                majorOsVersion
            }
        }
    }
}
`;

export const ComplianceSystems = () => {
    const { data, error, loading } = useQuery(QUERY);
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
    let policies;
    if (data) {
        policies = data?.profiles?.edges.map((e) => (e.node));
    }

    return (
        <React.Fragment>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="Compliance systems" />
            </PageHeader>
            <Main>
                <StateViewWithError stateValues={ { error, data, loading } }>
                    <StateViewPart stateKey="data">
                        { policies && <SystemsTable
                            showOsFilter
                            remediationsEnabled={ false }
                            columns={ columns }
                            policies={ policies } /> }
                    </StateViewPart>
                </StateViewWithError>
            </Main>
        </React.Fragment>
    );
};

export default ComplianceSystems;
