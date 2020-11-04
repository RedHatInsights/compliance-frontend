/* eslint-disable react/display-name */
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { systemName, policiesCell } from 'Store/Reducers/SystemStore';
import { Link } from 'react-router-dom';

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
        renderFunc: systemName,
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'policyNames',
        title: 'Policies',
        renderFunc: (policyNames) => policiesCell({ policyNames })?.title,
        props: {
            width: 40, isStatic: true
        }
    }, {
        key: 'profileNames',
        title: '',
        renderFunc: (profileNames, id) => (
            profileNames ? <Link to={{ pathname: `/systems/${id}` }}> View report </Link> : ''
        ),
        noExport: true,
        props: {
            width: 20, isStatic: true
        }
    }];
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
