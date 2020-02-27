import React, { useState, useRef } from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import {
    PolicyDetailsDescription,
    PolicyDetailsContentLoader,
    PolicyTabs,
    TabSwitcher,
    Tab
} from 'PresentationalComponents';
import EditPolicy from '../EditPolicy/EditPolicy';
import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import {
    PageHeader,
    PageHeaderTitle,
    Main,
    Spinner
} from '@redhat-cloud-services/frontend-components';
import gql from 'graphql-tag';
import '../../Charts.scss';
import './PolicyDetails.scss';
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Grid,
    GridItem
} from '@patternfly/react-core';
import {
    Link
} from 'react-router-dom';

export const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        refId
        description
        totalHostCount
        compliantHostCount
        complianceThreshold
        majorOsVersion
        lastScanned
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
    }
}
`;

export const PolicyDetailsQuery = ({ policyId, onNavigateWithProps }) => {
    const { data, error, loading, refetch } = useQuery(QUERY, {
        variables: { policyId }
    });
    let systemsTable = useRef();

    const forceUpdate = () => {
        refetch();
        systemsTable.current.getWrappedInstance().systemFetch();
        systemsTable.current.getWrappedInstance().forceUpdate();
    };

    const [activeTab, setActiveTab] = useState(0);
    let policy = {};

    if (error) {
        if (error.networkError.statusCode === 401) {
            window.insights.chrome.auth.logout();
        }

        return 'Oops! Error loading Policy data: ' + error;
    }

    if (loading) {
        return (
            <React.Fragment>
                <PageHeader><PolicyDetailsContentLoader/></PageHeader>
                <Main><Spinner/></Main>
            </React.Fragment>
        );
    } else {
        policy = data.profile;
    }

    return (
        <React.Fragment>
            <PageHeader className={ 'beta-page-header'} >
                <Breadcrumb>
                    <BreadcrumbItem to='/rhel/compliance/policies' onClick={ (event) => onNavigateWithProps(event) }>
                      Policies
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
                </Breadcrumb>
                <Grid gutter='lg'>
                    <GridItem xl2={9} xl={8} lg={12} md={12} sm={12}>
                        <PageHeaderTitle title={policy.name} />
                    </GridItem>
                    <GridItem className='policy-details-button' xl2={2} xl={2} lg={2} md={3} sm={3}>
                        <Link to={'/reports/' + policy.id} >
                            <Button variant='primary'>
                                View reports
                            </Button>
                        </Link>
                    </GridItem>
                    <GridItem className='policy-details-button' xl2={1} xl={2} lg={2} md={3} sm={3}>
                        <EditPolicy policyId={policy.id}
                            previousThreshold={policy.complianceThreshold}
                            businessObjective={policy.businessObjective}
                            onClose={ () => {
                                forceUpdate();
                            }}
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
        </React.Fragment>
    );
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
