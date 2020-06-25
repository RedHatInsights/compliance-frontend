import React, { useState } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Breadcrumb, BreadcrumbItem, Button, Grid, GridItem } from '@patternfly/react-core';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import {
    PageHeader, PageHeaderTitle, Main, Spinner
} from '@redhat-cloud-services/frontend-components';
import { onNavigate } from 'Utilities/Breadcrumbs';
import {
    PolicyDetailsDescription, PolicyDetailsContentLoader, PolicyTabs, TabSwitcher, Tab,
    StateViewWithError, StateViewPart
} from 'PresentationalComponents';
import { CreatePolicy } from 'SmartComponents';
import '@/Charts.scss';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';

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
        hosts {
            id
        }
    }
}
`;

const PolicyDetails = ({ dispatch, match }) => {
    let { data, error, loading, refetch } = useQuery(QUERY, {
        variables: { policyId: match.params.policy_id }
    });
    const [activeTab, setActiveTab] = useState(0);
    let policy = data && !loading ? data.profile : {};
    const beta = window.insights.chrome.isBeta();

    if (policy.external) {
        error = { message: 'This is an external SCAP policy.' };
        data = undefined;
        loading = undefined;
    }

    const initializeForm = () => (
        dispatch({
            type: '@@redux-form/INITIALIZE',
            meta: {
                form: 'policyForm'
            },
            payload: {
                benchmark: policy.benchmark.id,
                description: policy.description,
                name: policy.name,
                refId: policy.refId,
                selectedRuleRefIds: policy.rules.map(rule => rule.refId),
                systems: policy.hosts.map(host => host.id),
                editPolicyId: policy.id,
                profile: JSON.stringify(policy)
            }
        })
    );

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='loading'>
            <PageHeader><PolicyDetailsContentLoader/></PageHeader>
            <Main><Spinner/></Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <PageHeader className='page-header-tabs'>
                <Breadcrumb>
                    <BreadcrumbItem to={`${ beta ? '/beta/insights' : '/rhel' }/compliance/scappolicies`}
                        onClick={ (event) => onNavigate(event) }>
                      Policies
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
                </Breadcrumb>
                <Grid gutter='lg'>
                    <GridItem xl2={11} xl={10} lg={12} md={12} sm={12}>
                        <PageHeaderTitle title={policy.name} />
                    </GridItem>
                    <GridItem className='policy-details-button' xl2={1} xl={2} lg={2} md={3} sm={3}>
                        <Button onClick={initializeForm}>DISPATCH</Button>
                        <CreatePolicy edit startAtStep={2} benchmark={policy.benchmark}
                            profile={policy} onWizardFinish={() => refetch()}
                        />
                    </GridItem>
                </Grid>
                <PolicyTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </PageHeader>
            <Main>
                <TabSwitcher activeTab={activeTab}>
                    <Tab tabId={0}>
                        <PolicyDetailsDescription policy={policy} />
                    </Tab>
                    <Tab tabId={1}>
                        <PolicyRulesTab policy={policy} loading={loading} />
                    </Tab>
                    <Tab tabId={2}>
                        <PolicySystemsTab policy={policy} complianceThreshold={policy.complianceThreshold} />
                    </Tab>
                </TabSwitcher>
            </Main>
        </StateViewPart>
    </StateViewWithError>;
};

PolicyDetails.propTypes = {
    onNavigateWithProps: propTypes.func,
    dispatch: propTypes.func,
    match: propTypes.object
};

export default compose(
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    }),
    routerParams
)(PolicyDetails);

export { PolicyDetails };
