import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from '../SystemsTable/SystemsTable';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import SetThresholdDropdown from '../SetThresholdDropdown/SetThresholdDropdown';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
    Breadcrumbs,
    PageHeader,
    PageHeaderTitle,
    Main,
    Truncate,
    routerParams,
    EmptyTable,
    Spinner
} from '@red-hat-insights/insights-frontend-components';
import {
    ChartDonut,
    ChartLegend,
    ChartLabel,
    ChartTheme
} from '@patternfly/react-charts';
import {
    Text,
    TextContent,
    Tooltip,
    TextVariants
} from '@patternfly/react-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import '../../Charts.scss';
import './PolicyDetails.scss';
import linkifyHtml from 'linkifyjs/html';
import ContentLoader from 'react-content-loader';

const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        ref_id
        description
        total_host_count
        compliant_host_count
        compliance_threshold
        hosts {
            id,
            name,
            profile_names,
            rules_passed(profile_id: $policyId)
            rules_failed(profile_id: $policyId)
            last_scanned(profile_id: $policyId)
            compliant(profile_id: $policyId)
        }
    }
}
`;

const PolicyDetailsContentLoader = () => (
    <ContentLoader
        height={320}
        width={1550}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
        <rect x="18" y="50" rx="4" ry="4" width="478" height="15" />
        <rect x="19" y="18" rx="3" ry="3" width="220" height="9" />
        <circle cx="118" cy="156" r="73" />
        <rect x="1002" y="40" rx="0" ry="0" width="69" height="23" />
        <rect x="47" y="77" rx="0" ry="0" width="0" height="0" />
        <rect x="36" y="77" rx="0" ry="0" width="16" height="0" />
        <rect x="409" y="149" rx="0" ry="0" width="0" height="0" />
        <rect x="214" y="145" rx="0" ry="0" width="205" height="9" />
        <rect x="216" y="119" rx="0" ry="0" width="205" height="9" />
        <rect x="526" y="100" rx="0" ry="0" width="431" height="8" />
        <rect x="526" y="122" rx="0" ry="0" width="431" height="8" />
        <rect x="526" y="146" rx="0" ry="0" width="431" height="8" />
        <rect x="527" y="170" rx="0" ry="0" width="431" height="8" />
        <rect x="527" y="194" rx="0" ry="0" width="431" height="8" />
        <rect x="527" y="218" rx="0" ry="0" width="431" height="8" />
        <rect x="529" y="275" rx="0" ry="0" width="231" height="7" />
    </ContentLoader>
);

const PolicyDetailsQuery = ({ policyId, onNavigateWithProps }) => (
    <Query query={QUERY} variables={{ policyId }} >
        {({ data, error, loading }) => {
            let donutValues = [];
            let donutId = 'loading-donut';
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
                        <Main><EmptyTable><Spinner/></EmptyTable></Main>
                    </React.Fragment>
                );
            } else {
                policy = data.profile;
                const compliantHostCount = policy.compliant_host_count;
                const totalHostCount = policy.total_host_count;
                donutId = policy.name.replace(/ /g, '');
                donutValues = [
                    { x: 'Compliant', y: compliantHostCount },
                    { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
                ];
            }

            const systems = data.profile.hosts;
            const columns = [{
                composed: ['facts.os_release', 'display_name'],
                key: 'display_name',
                title: 'Name'
            }, {
                key: 'facts.compliance.profiles',
                title: 'Profile'
            }, {
                key: 'facts.compliance.rules_failed',
                title: 'Rules Failed'
            }, {
                key: 'facts.compliance.compliance_score',
                title: 'Compliance Score'
            }, {
                key: 'facts.compliance.last_scanned',
                title: 'Last Scanned'
            }];

            const legendData = [
                { name: donutValues[0].y + ' Systems Compliant' },
                { name: donutValues[1].y + ' Systems Non-Compliant' }
            ];

            const compliancePercentage = Math.floor(100 *
                (donutValues[0].y / (donutValues[0].y + donutValues[1].y))) + '%';

            const label = (
                <svg
                    className="chart-label"
                    height={200}
                    width={200}
                >
                    <ChartLabel
                        style={{ fontSize: 20 }}
                        text={compliancePercentage}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        x={100}
                        y={90}
                    />
                    <ChartLabel
                        style={{ fill: '#bbb' }}
                        text="Compliant"
                        textAnchor="middle"
                        verticalAnchor="middle"
                        x={100}
                        y={110}
                    />
                </svg>
            );

            return (
                <React.Fragment>
                    <PageHeader>
                        <Breadcrumbs
                            style={{ padding: '0px' }}
                            items={[{ title: 'Policies', navigate: '/policies' }]}
                            current={policy.name}
                            onNavigate={onNavigateWithProps}
                        />
                        <PageHeaderTitle title={policy.name} />
                        <Grid gutter='md'>
                            <GridItem span={4}>
                                <div className='chart-inline'>
                                    <div className='chart-container'>
                                        {label}
                                        <ChartDonut data={donutValues}
                                            identifier={donutId}
                                            theme={ChartTheme.light.blue}
                                            legendPosition='right'
                                            height={200}
                                            width={200}
                                        />
                                    </div>
                                    <ChartLegend
                                        data={legendData}
                                        orientation={'vertical'}
                                        theme={ChartTheme.light.blue}
                                        y={55}
                                        height={200}
                                        width={200}
                                    />
                                </div>

                            </GridItem>
                            <GridItem span={6}>
                                <TextContent>
                                    <Text style={{ fontWeight: 'bold' }} component={TextVariants.p}>Description</Text>
                                    <Text component={TextVariants.p}>
                                        <Truncate text={linkifyHtml(policy.description)} length={380} />
                                    </Text>
                                    <Tooltip
                                        position='left'
                                        content={
                                            <div>
                                                The threshold for compliance is a value set by your organization for
                                                each policy.
                                                This defines the percentage of passed rules that must be met in order
                                                for a system to be determined &quot;compliant&quot;.
                                            </div>
                                        }
                                    >
                                        <Text style={{ fontWeight: 'bold' }} component={ TextVariants.p }>
                                            Minimum threshold for compliance <OutlinedQuestionCircleIcon className='grey-icon'/>
                                        </Text>
                                        <Text className='threshold-tooltip' component={TextVariants.p}>
                                            { policy.compliance_threshold }%
                                        </Text>
                                    </Tooltip>
                                </TextContent>
                            </GridItem>
                            <GridItem span={2}>
                                <SetThresholdDropdown policyId={policy.id}
                                    previousThreshold={policy.compliance_threshold} />
                            </GridItem>
                        </Grid>
                    </PageHeader>
                    <Main>
                        <Grid gutter='md'>
                            <GridItem span={12}>
                                <SystemsTable items={systems} columns={columns} />
                            </GridItem>
                        </Grid>
                    </Main>
                </React.Fragment>
            );
        }}
    </Query>
);

PolicyDetailsQuery.propTypes = {
    policyId: propTypes.string,
    onNavigateWithProps: propTypes.func
};

class PolicyDetails extends React.Component {
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
