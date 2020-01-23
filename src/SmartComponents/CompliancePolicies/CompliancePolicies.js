import React from 'react';
import {
    ComplianceTabs,
    ErrorPage,
    LoadingPoliciesTable
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
    const { data, error, loading, refetch } = useQuery(QUERY, { fetchPolicy: 'network-only' });

    if (error) { return <ErrorPage error={error}/>; }

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title="Compliance policies" />
                { !loading && <ComplianceTabs /> }
            </PageHeader>
            <Main>
                { loading ?
                    <LoadingPoliciesTable /> :
                    <PoliciesTable onWizardFinish={() => refetch()} policies={data.profiles.edges.map(profile => profile.node)} />
                }
            </Main>
        </React.Fragment>
    );
};

export default routerParams(CompliancePolicies);
