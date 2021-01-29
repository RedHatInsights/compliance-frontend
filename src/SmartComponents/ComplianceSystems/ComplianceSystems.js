/* eslint-disable react/display-name */
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { systemName, detailsLink, policiesCell } from 'Store/Reducers/SystemStore';
import useFeature from 'Utilities/hooks/useFeature';

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
    const newInventory = useFeature('newInventory');
    const { data, error, loading } = useQuery(QUERY);
    const columns = [{
        key: 'facts.compliance.display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'display_name',
            renderFunc: systemName
        }
    }, {
        key: 'facts.compliance.policies',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'policyNames',
            renderFunc: (policyNames) => {
                const { title } = policiesCell({ policyNames }) || { title: '' };
                return title;
            }
        }
    }, {
        key: 'facts.compliance.details_link',
        title: '',
        props: {
            width: 20, isStatic: true
        },
        ...newInventory && {
            key: 'testResultProfiles',
            renderFunc: (data, id) => {
                const { title } = detailsLink({ testResultProfiles: data, id }) || { title: '' };
                return title;
            }
        }
    }];
    const policies = data?.profiles?.edges.map(({ node }) => node);

    const InvComponent = newInventory ? InventoryTable : SystemsTable;

    return (
        <React.Fragment>
            <PageHeader className='page-header'>
                <PageHeaderTitle title="Systems" />
            </PageHeader>
            <Main>
                <StateViewWithError stateValues={ { error, data, loading } }>
                    <StateViewPart stateKey="data">
                        { policies && <InvComponent
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
