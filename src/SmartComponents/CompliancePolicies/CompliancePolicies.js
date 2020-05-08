import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import {
    Grid
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { ComplianceEmptyState } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import {
    ErrorPage,
    LoadingPoliciesTable,
    StateView,
    StateViewPart
} from 'PresentationalComponents';

import {
    PoliciesTable,
    CreatePolicy
} from 'SmartComponents';

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
    let { data, error, loading, refetch } = useQuery(QUERY, { fetchPolicy: 'cache-and-network' });
    let policies;

    if (data) {
        error = undefined; loading = undefined;
        policies = data.profiles.edges.map(profile => profile.node);
    }

    return <React.Fragment>
        <PageHeader className='page-header'>
            <PageHeaderTitle title="SCAP policies" />
        </PageHeader>
        <Main>
            <StateView stateValues={ { error, data, loading } }>
                <StateViewPart stateKey='error'>
                    <ErrorPage error={error}/>
                </StateViewPart>
                <StateViewPart stateKey='loading'>
                    <LoadingPoliciesTable />
                </StateViewPart>
                <StateViewPart stateKey='data'>
                    { policies && policies.length === 0 ?
                        <Grid gutter='md'><ComplianceEmptyState title='No policies'
                            mainButton={<CreatePolicy onWizardFinish={() => { refetch(); }} />} /></Grid> :
                        <PoliciesTable onWizardFinish={() => refetch()} policies={ policies } />
                    }
                </StateViewPart>
            </StateView>
        </Main>
    </React.Fragment>;
};

export default routerParams(CompliancePolicies);
