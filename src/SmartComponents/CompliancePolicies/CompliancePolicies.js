import React from 'react';
import {
    CompliancePoliciesEmptyState,
    ComplianceTabs,
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
    profiles {
        edges {
            node {
                id
                name
                refId
                complianceThreshold
                totalHostCount
                majorOsVersion
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
    const beta = insights.chrome.isBeta();
    let policies;

    if (data) {
        policies = data.profiles.edges.map(profile => profile.node);
    }

    return <StateView stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='error'>
            <ErrorPage error={error}/>
        </StateViewPart>
        <StateViewPart stateKey='loading'>
            <PageHeader style={{ paddingBottom: '22px' }} className={ beta ? 'beta-page-header' : 'stable-page-header' } >
                <PageHeaderTitle title="SCAP policies" />
            </PageHeader>
            <Main>
                <LoadingPoliciesTable />
            </Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <PageHeader style={{ paddingBottom: '22px' }} className={ beta ? 'beta-page-header' : 'stable-page-header' } >
                <PageHeaderTitle title="SCAP policies" />
                { !beta && <ComplianceTabs/> }
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
