import React, { useState } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Breadcrumb, BreadcrumbItem, Grid, GridItem } from '@patternfly/react-core';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import {
    PageHeader, PageHeaderTitle, Main, Spinner
} from '@redhat-cloud-services/frontend-components';
import { onNavigate } from 'Utilities/Breadcrumbs';
import {
    PolicyDetailsDescription, PolicyDetailsContentLoader, PolicyTabs, TabSwitcher, Tab,
    StateViewWithError, StateViewPart
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

export const PolicyDetailsQuery = ({ policyId, onNavigateWithProps }) => {
    let { data, error, loading, refetch } = useQuery(QUERY, {
        variables: { policyId }
    });
    const [activeTab, setActiveTab] = useState(0);
    let policy = data && !loading ? data.profile : {};
    const beta = window.insights.chrome.isBeta();

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
                    <BreadcrumbItem to={`${ beta ? '/beta/insights' : '/rhel' }/compliance/scappolicies`}
                        onClick={ (event) => onNavigateWithProps(event) }>
                      Policies
                    </BreadcrumbItem>
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

PolicyDetailsQuery.propTypes = {
    policyId: propTypes.string,
    onNavigateWithProps: propTypes.func
};

export class PolicyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onNavigate = onNavigate.bind(this);
    }

    render() {
        return (
            <PolicyDetailsQuery policyId={this.props.match.params.policy_id} onNavigateWithProps={this.onNavigate} />
        );
    }
}

PolicyDetails.propTypes = {
    match: propTypes.object
};

export default routerParams(PolicyDetails);
