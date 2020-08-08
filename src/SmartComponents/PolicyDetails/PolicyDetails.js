import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Breadcrumb, BreadcrumbItem, Grid, GridItem, Tab } from '@patternfly/react-core';
import {
    PageHeader, PageHeaderTitle, Main, Spinner
} from '@redhat-cloud-services/frontend-components';
import {
    PolicyDetailsDescription, PolicyDetailsContentLoader, RouteredTabSwitcher as TabSwitcher, ContentTab,
    StateViewWithError, StateViewPart, RoutedTabs, BreadcrumbLinkItem
} from 'PresentationalComponents';
import { EditPolicy } from 'SmartComponents';
import '@/Charts.scss';

import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import './PolicyDetails.scss';

export const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        refId
        external
        description
        totalHostCount
        compliantHostCount
        complianceThreshold
        majorOsVersion
        lastScanned
        policy {
            id
            name
        }
        businessObjective {
            id
            title
        }
        rules {
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
        }
        benchmark {
            id
            title
            version
        }
    }
}
`;

export const PolicyDetails = () => {
    const defaultTab = 'details';
    const { policy_id: policyId } = useParams();
    let { data, error, loading, refetch } = useQuery(QUERY, {
        variables: { policyId }
    });
    let policy = data && !loading ? data.profile : {};

    if (policy.external) {
        error = { message: 'This is an external SCAP policy.' };
        data = undefined;
        loading = undefined;
    }

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='loading'>
            <PageHeader><PolicyDetailsContentLoader/></PageHeader>
            <Main><Spinner/></Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <PageHeader className='page-header-tabs'>
                <Breadcrumb>
                    <BreadcrumbLinkItem to='/scappolicies'>
                          Policies
                    </BreadcrumbLinkItem>
                    <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
                </Breadcrumb>
                <Grid gutter='lg'>
                    <GridItem xl2={11} xl={10} lg={12} md={12} sm={12}>
                        <PageHeaderTitle title={policy.name} />
                    </GridItem>
                    <GridItem className='policy-details-button' xl2={1} xl={2} lg={2} md={3} sm={3}>
                        <EditPolicy policyId={policy.id}
                            previousThreshold={policy.complianceThreshold}
                            businessObjective={policy.businessObjective}
                            onClose={ () => refetch() }
                        />
                    </GridItem>
                </Grid>
                <RoutedTabs aria-label="Policy Tabs" defaultTab={ defaultTab }>
                    <Tab title='Details' id='policy-details' eventKey='details' />
                    <Tab title='Rules' id='policy-rules' eventKey='rules' />
                    <Tab title='Systems' id='policy-systems' eventKey='systems' />
                </RoutedTabs>
            </PageHeader>
            <Main>
                <TabSwitcher defaultTab={ defaultTab }>
                    <ContentTab eventKey='details'>
                        <PolicyDetailsDescription policy={policy} />
                    </ContentTab>
                    <ContentTab eventKey='rules'>
                        <PolicyRulesTab policy={policy} />
                    </ContentTab>
                    <ContentTab eventKey='systems'>
                        <PolicySystemsTab policy={policy} complianceThreshold={policy.complianceThreshold} />
                    </ContentTab>
                </TabSwitcher>
            </Main>
        </StateViewPart>
    </StateViewWithError>;
};

export default PolicyDetails;
