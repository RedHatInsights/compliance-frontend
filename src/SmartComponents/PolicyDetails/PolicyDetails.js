import React, { useState, useRef } from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import {
    PolicyDetailsDescription,
    PolicyDetailsContentLoader,
    PolicyTabs
} from 'PresentationalComponents';
import { SystemRulesTable, ANSIBLE_ICON } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import EditPolicy from '../EditPolicy/EditPolicy';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import {
    PageHeader,
    PageHeaderTitle,
    Main,
    Spinner
} from '@redhat-cloud-services/frontend-components';
import { sortable } from '@patternfly/react-table';
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
import { Alert } from '@patternfly/react-core';
import { SystemsTable } from 'SmartComponents';

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

    let currentTab;
    if (activeTab === 0) {
        currentTab = <PolicyDetailsDescription policy={policy} />;
    } else if (activeTab === 1) {
        const columns = [
            { title: 'Rule', transforms: [sortable] },
            { title: 'Severity', transforms: [sortable] },
            { title: <React.Fragment>{ ANSIBLE_ICON } Ansible</React.Fragment>, transforms: [sortable], original: 'Ansible' }
        ];
        currentTab = <React.Fragment>
            <Alert variant="info" isInline title="Rule editing coming soon" />
            <SystemRulesTable
                remediationsEnabled={false}
                columns={columns}
                loading={loading}
                profileRules={ !loading && [{
                    profile: { refId: policy.refId, name: policy.name },
                    rules: policy.rules
                }]}
            />
        </React.Fragment>;
    } else if (activeTab === 2) {
        const columns = [{
            composed: ['facts.os_release', 'display_name'],
            key: 'display_name',
            title: 'System name',
            props: {
                width: 40
            }
        }, {
            key: 'facts.compliance.compliance_score',
            title: 'Compliance score',
            props: {
                width: 10
            }
        }, {
            key: 'facts.compliance.last_scanned',
            title: 'Last scanned',
            props: {
                width: 10
            }
        }];
        currentTab = <SystemsTable policyId={policy.id} columns={columns} ref={systemsTable} />;
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
                <Grid>
                    <GridItem span={10}>
                        <PageHeaderTitle title={policy.name} />
                    </GridItem>
                    <GridItem span={1}>
                        <Link to={'/reports/' + policy.id} >
                            <Button variant='primary'>
                                View reports
                            </Button>
                        </Link>
                    </GridItem>
                    <GridItem span={1}>
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
                { currentTab }
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
