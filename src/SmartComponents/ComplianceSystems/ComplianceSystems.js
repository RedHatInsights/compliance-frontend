/* eslint-disable react/display-name */
import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { systemName, detailsLink, policiesCell } from 'Store/Reducers/SystemStore';

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
    const dispatch = useDispatch();
    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: systemName
    }, {
        key: 'policyNames',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (policyNames) => {
            const { title } = policiesCell({ policyNames }) || { title: '' };
            return title;
        }
    }, {
        key: 'testResultProfiles',
        title: '',
        props: {
            width: 20, isStatic: true
        },
        renderFunc: (data, id) => {
            const { title } = detailsLink({ testResultProfiles: data, id }) || { title: '' };
            return title;
        }
    }];
    const policies = data?.profiles?.edges.map(({ node }) => node);

    useLayoutEffect(() => { dispatch({ type: 'CLEAR_INVENTORY_ENTITIES' }); }, []);

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
