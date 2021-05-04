import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
    Button,
    Grid
} from '@patternfly/react-core';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import ComplianceEmptyState from '../../PresentationalComponents/ComplianceEmptyState';
import {
    BackgroundLink,
    ErrorPage,
    LoadingPoliciesTable,
    PoliciesTable,
    StateView,
    StateViewPart
} from 'PresentationalComponents';

const QUERY = gql`
{
    profiles(search: "external = false and canonical = false") {
        edges {
            node {
                id
                name
                description
                refId
                complianceThreshold
                totalHostCount
                majorOsVersion
                policyType
                policy {
                    id
                    name
                }
                benchmark {
                    id
                    title
                    version
                }
                hosts {
                    id
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
    const location = useLocation();
    const createLink = <BackgroundLink to='/scappolicies/new'>
        <Button variant='primary' ouiaId="NewPolicyButton">Create new policy</Button>
    </BackgroundLink>;
    let { data, error, loading, refetch } = useQuery(QUERY);
    useEffect(() => { refetch(); }, [location, refetch]);
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
                        <Grid hasGutter><ComplianceEmptyState title='No policies'
                            mainButton={ createLink } /></Grid> :
                        <PoliciesTable policies={ policies } />
                    }
                </StateViewPart>
            </StateView>
        </Main>
    </React.Fragment>;
};

export default CompliancePolicies;
