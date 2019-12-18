import React, { useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from '../SystemsTable/SystemsTable';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import { fixedPercentage, pluralize } from '../../Utilities/TextHelper';
import { PolicyDetailsContentLoader } from '../../PresentationalComponents';
import EditPolicy from '../EditPolicy/EditPolicy';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import {
    PageHeader,
    PageHeaderTitle,
    Main,
    Truncate, EmptyTable,
    Spinner
} from '@redhat-cloud-services/frontend-components';
import {
    ChartDonut,
    ChartThemeColor,
    ChartThemeVariant
} from '@patternfly/react-charts';
import {
    Text,
    TextContent,
    Tooltip,
    TextVariants,
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import '../../Charts.scss';
import './PolicyDetails.scss';
import linkifyHtml from 'linkifyjs/html';

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
        businessObjective {
            id
            title
        }
    }
}
`;

export const PolicyDetailsQuery = ({ policyId, onNavigateWithProps }) => {
    const { data, error, loading, refetch } = useQuery(QUERY, {
        variables: { policyId }
    });
    let systemsTable = useRef();
    let donutValues = [];
    let donutId = 'loading-donut';
    let policy = {};

    const forceUpdate = () => {
        refetch();
        systemsTable.current.getWrappedInstance().systemFetch();
        systemsTable.current.getWrappedInstance().forceUpdate();
    };

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
                <Main><EmptyTable><Spinner/></EmptyTable></Main>
            </React.Fragment>
        );
    } else {
        policy = data.profile;
        const compliantHostCount = policy.compliantHostCount;
        const totalHostCount = policy.totalHostCount;
        donutId = policy.name.replace(/ /g, '');
        donutValues = [
            { x: 'Compliant', y: compliantHostCount },
            { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
        ];
    }

    const columns = [{
        composed: ['facts.os_release', 'display_name'],
        key: 'display_name',
        title: 'Name',
        props: {
            width: 30
        }
    }, {
        key: 'facts.compliance.profiles',
        title: 'Profile',
        props: {
            width: 50
        }
    }, {
        key: 'facts.compliance.rules_failed',
        title: 'Rules failed',
        props: {
            width: 5
        }
    }, {
        key: 'facts.compliance.compliance_score',
        title: 'Compliance score',
        props: {
            width: 5
        }
    }, {
        key: 'facts.compliance.last_scanned',
        title: 'Last scanned',
        props: {
            width: 10
        }
    }];

    const legendData = [
        { name: donutValues[0].y + ' ' + pluralize(donutValues[0].y, 'system') + ' compliant' },
        { name: donutValues[1].y + ' ' + pluralize(donutValues[1].y, 'system') + ' non-compliant' }
    ];

    const compliancePercentage = fixedPercentage(Math.floor(100 *
        (donutValues[0].y / (donutValues[0].y + donutValues[1].y))));

    return (
        <React.Fragment>
            <PageHeader>
                <Breadcrumb>
                    <BreadcrumbItem to='/rhel/compliance/policies' onClick={ (event) => onNavigateWithProps(event) }>
                      Policies
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
                </Breadcrumb>
                <PageHeaderTitle title={policy.name} />
                <EditPolicy policyId={policy.id}
                    previousThreshold={policy.complianceThreshold}
                    businessObjective={policy.businessObjective}
                    onClose={ () => {
                        forceUpdate();
                    }}
                />
                { policy.businessObjective &&
                <Text style={{ color: 'var(--pf-global--Color--200)' }}>
                    Business objective: { policy.businessObjective.title }
                </Text>
                }
                <Grid gutter='md'>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <div className='chart-inline'>
                            <div className='chart-container'>
                                <ChartDonut data={donutValues}
                                    identifier={donutId}
                                    title={compliancePercentage}
                                    subTitle="Compliant"
                                    themeColor={ChartThemeColor.blue}
                                    themeVariant={ChartThemeVariant.light}
                                    style={{ fontSize: 20 }}
                                    innerRadius={88}
                                    width={462}
                                    legendPosition='right'
                                    legendData={legendData}
                                    legendOrientation='vertical'
                                    padding={{
                                        bottom: 20,
                                        left: 0,
                                        right: 250,
                                        top: 20
                                    }}
                                />
                            </div>
                        </div>

                    </GridItem>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <TextContent className='policy-description'>
                            <Text component={TextVariants.h5}><b>Description</b></Text>
                            <Text component={TextVariants.p}>
                                <Truncate text={linkifyHtml(policy.description || '')} length={380} inline={true} />
                            </Text>
                            <Tooltip
                                position='left'
                                content={
                                    <span>
                                        The threshold for compliance is a value set by your organization for
                                        each policy.
                                        This defines the percentage of passed rules that must be met in order
                                        for a system to be determined &quot;compliant&quot;.
                                    </span>
                                }
                            >
                                <span>
                                    <Text component={TextVariants.h5}>
                                        <b>
                                            Minimum threshold for compliance
                                            <OutlinedQuestionCircleIcon className='grey-icon'/>
                                        </b>
                                    </Text>
                                    <Text className='threshold-tooltip' component={TextVariants.p}>
                                        { fixedPercentage(policy.complianceThreshold) }
                                    </Text>
                                </span>
                            </Tooltip>
                        </TextContent>
                    </GridItem>
                </Grid>
            </PageHeader>
            <Main>
                <Grid gutter='md'>
                    <GridItem span={12}>
                        <SystemsTable policyId={policy.id}
                            columns={columns}
                            ref={systemsTable} />
                    </GridItem>
                </Grid>
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
