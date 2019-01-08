import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from '../SystemsTable/SystemsTable';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import {
    Breadcrumbs,
    PageHeader,
    PageHeaderTitle,
    Main,
    Donut,
    Truncate,
    routerParams
} from '@red-hat-insights/insights-frontend-components';
import {
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        name
        ref_id
        description
        total_host_count
		compliant_host_count
	}

	allSystems{
		id,
		name,
		profile_names,
		rules_passed(profile_id: $policyId)
		rules_failed(profile_id: $policyId)
		last_scanned(profile_id: $policyId)
		compliant(profile_id: $policyId)
	}
}
`;

const PolicyDetailsQuery = ({ policyId, onNavigateWithProps }) => (
    <Query query={QUERY} variables={{ policyId }} >
        {({ data, error, loading }) => {
            let donutValues = [];
            let donutId = 'loading-donut';
            let policy = {};

            if (error) { return 'Oops! Error loading Policy data: ' + error; }

            if (loading) {
                return (<PageHeader>Loading Policy details...</PageHeader>);
            } else {
                policy = data.profile;
                const compliantHostCount = policy.compliant_host_count;
                const totalHostCount = policy.total_host_count;
                donutId = policy.name.replace(/ /g, '');
                donutValues = [
                    ['Compliant', compliantHostCount],
                    ['Non-compliant', totalHostCount - compliantHostCount]
                ];
            }

            const systems = data.allSystems;
            const columns = [{
                key: 'facts.compliance.profiles',
                title: 'Profile'
            }, {
                key: 'facts.compliance.rules_passed',
                title: 'Rules Passed'
            }, {
                key: 'facts.compliance.rules_failed',
                title: 'Rules Failed'
            }, {
                key: 'facts.compliance.score',
                title: 'Score'
            }, {
                key: 'facts.compliance.compliant',
                title: 'Compliant'
            }, {
                key: 'facts.compliance.last_scanned',
                title: 'Last Scanned'
            }];

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
                            <GridItem span={5}>
                                <Donut values={donutValues}
                                    identifier={donutId}
                                    withLegend
                                    legendPosition='right'
                                />
                            </GridItem>
                            <GridItem span={7}>
                                <TextContent>
                                    <Text component={TextVariants.h3}>Description</Text>
                                    <Text className="policy-description" component={TextVariants.p}>
                                        <Truncate text={policy.description} length={380} />
                                    </Text>
                                </TextContent>
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
