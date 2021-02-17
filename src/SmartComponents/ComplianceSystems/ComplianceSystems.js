/* eslint-disable react/display-name */
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';

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

const DEFAULT_FILTER = 'has_test_results = true or has_policy = true';

export const ComplianceSystems = () => {
    const { data, error, loading } = useQuery(QUERY);
    const columns = ['Name', 'Policies', 'details-link'];
    const policies = data?.profiles?.edges.map(({ node }) => node);

    return (
        <React.Fragment>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="Systems" />
            </PageHeader>
            <Main>
                <StateViewWithError stateValues={ { error, data, loading } }>
                    <StateViewPart stateKey="data">
                        { policies && <InventoryTable
                            query={GET_SYSTEMS}
                            defaultFilter={ DEFAULT_FILTER }
                            systemProps={{
                                isFullView: true
                            }}
                            showOsFilter
                            showComplianceSystemsInfo
                            enableEditPolicy={ false }
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
