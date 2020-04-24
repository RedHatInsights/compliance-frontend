import React from 'react';
import {
    CompliancePoliciesEmptyState,
    ErrorPage,
    LoadingPoliciesTable,
    StateView,
    StateViewPart
} from 'PresentationalComponents';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PoliciesTable from '../PoliciesTable/PoliciesTable';

const QUERY = gql`
{
    profiles(search: "external = false") {
        edges {
            node {
                id
                name
                refId
                complianceThreshold
                totalHostCount
                majorOsVersion
                benchmark {
                    id
                    title
                    version
                }
                businessObjective {
                    id
                    title
                }
            }
        }
    }
}
`;

export const CompliancePolicies = () => {
    const { data, error, loading, refetch } = useQuery(QUERY, { fetchPolicy: 'cache-and-network' });
    let policies;

    if (data) {
        policies = data.profiles.edges.map(profile => profile.node);
    }

    return <StateView stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='error'>
            <ErrorPage error={error}/>
        </StateViewPart>
        <StateViewPart stateKey='loading'>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="SCAP policies" />
            </PageHeader>
            <Main>
                <LoadingPoliciesTable />
            </Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="SCAP policies" />
            </PageHeader>
            <Main>
                { policies && policies.length === 0 ?
                    <CompliancePoliciesEmptyState /> :
                    <PoliciesTable onWizardFinish={() => refetch()} policies={ policies } />
                }
            </Main>
        </StateViewPart>
    </StateView>;
};

export default routerParams(CompliancePolicies);
