import React, { Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Breadcrumb, BreadcrumbItem, Button, Grid, GridItem, Tab } from '@patternfly/react-core';
import {
    PageHeader, PageHeaderTitle, Main, Spinner
} from '@redhat-cloud-services/frontend-components';
import {
    PolicyDetailsDescription, PolicyDetailsContentLoader, RoutedTabSwitcher as TabSwitcher, ContentTab,
    StateViewWithError, StateViewPart, RoutedTabs, BreadcrumbLinkItem, BackgroundLink
} from 'PresentationalComponents';
import { useAnchor } from 'Utilities/Router';
import useFeature from 'Utilities/hooks/useFeature';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import '@/Charts.scss';
import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import PolicyMultiversionRules from './PolicyMultiversionRules';
import './PolicyDetails.scss';

export const MULTIVERSION_QUERY = gql`
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
        policyType
        policy {
            id
            name
            refId
            profiles {
                ssgVersion
                name
                refId
                rules {
                    title
                    severity
                    rationale
                    refId
                    description
                    remediationAvailable
                    identifier
                }
            }
        }
        businessObjective {
            id
            title
        }
        hosts {
            id
        }
        benchmark {
            id
            title
            version
        }
    }
}
`;

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
        policyType
        policy {
            id
            name
        }
        businessObjective {
            id
            title
        }
        hosts {
            id
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

export const PolicyDetails = ({ route }) => {
    const defaultTab = 'details';
    const multiversionTabs = useFeature('multiversionTabs');
    const { policy_id: policyId } = useParams();
    const location = useLocation();
    const anchor = useAnchor();
    let { data, error, loading, refetch } = useQuery((multiversionTabs ? MULTIVERSION_QUERY : QUERY), {
        variables: { policyId }
    });
    let policy = data && !loading ? data.profile : undefined;

    if (policy && policy.external) {
        error = { message: 'This is an external SCAP policy.' };
        data = undefined;
        loading = undefined;
    }

    useEffect(() => {
        refetch();
    }, [location]);

    useTitleEntity(route, policy?.name);

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='loading'>
            <PageHeader><PolicyDetailsContentLoader/></PageHeader>
            <Main><Spinner/></Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            { policy && <Fragment>
                <PageHeader className='page-header-tabs'>
                    <Breadcrumb>
                        <BreadcrumbLinkItem to='/'>
                            Compliance
                        </BreadcrumbLinkItem>
                        <BreadcrumbLinkItem to='/scappolicies'>
                            SCAP Policies
                        </BreadcrumbLinkItem>
                        <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <Grid gutter='lg'>
                        <GridItem xl2={11} xl={10} lg={12} md={12} sm={12}>
                            <PageHeaderTitle title={policy.name} />
                        </GridItem>
                        <GridItem className='policy-details-button' xl2={1} xl={2} lg={2} md={3} sm={3}>
                            <BackgroundLink
                                to={ `/scappolicies/${ policy.id }/edit` }
                                state={ { policy } }
                                hash={ anchor }
                                backgroundLocation={ { hash: 'details' } }>
                                <Button variant='secondary'>Edit policy</Button>
                            </BackgroundLink>
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
                            <PolicyDetailsDescription policy={ policy } />
                        </ContentTab>
                        <ContentTab eventKey='rules'>
                            { multiversionTabs ?
                                <PolicyMultiversionRules policy={ policy } /> :
                                <PolicyRulesTab policy={ policy } /> }
                        </ContentTab>
                        <ContentTab eventKey='systems'>
                            <PolicySystemsTab policy={ policy } />
                        </ContentTab>
                    </TabSwitcher>
                </Main>
            </Fragment> }
        </StateViewPart>
    </StateViewWithError>;
};

PolicyDetails.propTypes = {
    route: propTypes.object
};

export default PolicyDetails;
