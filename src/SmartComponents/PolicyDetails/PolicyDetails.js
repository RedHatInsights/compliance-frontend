import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Breadcrumb, BreadcrumbItem, Button, Grid, GridItem, Tab } from '@patternfly/react-core';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
    PolicyDetailsDescription, PolicyDetailsContentLoader, RoutedTabSwitcher as TabSwitcher, ContentTab,
    StateViewWithError, StateViewPart, RoutedTabs, BreadcrumbLinkItem, BackgroundLink
} from 'PresentationalComponents';
import { useAnchor } from 'Utilities/Router';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import '@/Charts.scss';
import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import PolicyMultiversionRules from './PolicyMultiversionRules';
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
        policyType
        policy {
            id
            name
            refId
            profiles {
                id
                ssgVersion
                name
                refId
                osMinorVersion
                osMajorVersion
                benchmark {
                    id
                    title
                    latestSupportedOsMinorVersions
                    osMajorVersion
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
            }
        }
        businessObjective {
            id
            title
        }
        hosts {
            id
            osMinorVersion
        }
        benchmark {
            id
            title
            version
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
    }
}
`;

export const PolicyDetails = ({ route }) => {
    const defaultTab = 'details';
    const { policy_id: policyId } = useParams();
    const location = useLocation();
    const anchor = useAnchor();
    const dispatch = useDispatch();
    let { data, error, loading, refetch } = useQuery(QUERY, {
        variables: { policyId }
    });
    let policy;
    let hasOsMinorProfiles = true;
    if (data && !loading) {
        policy = data.profile;
        hasOsMinorProfiles = !!policy.policy.profiles.find((profile) => !!profile.osMinorVersion);
    }

    useEffect(() => {
        refetch();
    }, [location, refetch]);

    useLayoutEffect(() => { dispatch({ type: 'SELECT_ENTITIES', payload: { ids: [] } }); }, []);

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
                            SCAP policies
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
                            { hasOsMinorProfiles
                                ? <PolicyMultiversionRules policy={ policy } />
                                : <PolicyRulesTab policy={ policy } /> }
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
