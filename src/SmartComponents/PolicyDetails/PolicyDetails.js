import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from '../SystemsTable/SystemsTable';
import { Donut, routerParams } from '@red-hat-insights/insights-frontend-components';
import {
    Title,
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

const PolicyDetailsQuery = ({ policyId }) => (
    <Query query={QUERY} variables={{ policyId }} >
        {({ data, error, loading }) => {
            let donutValues = [];
            let donutId = 'loading-donut';
            let policy = {};

            if (error) { return 'Oops! Error loading Policy data: ' + error; }

            if (loading) {
                return 'Loading Policy details...';
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
                    <Title size="3xl">{policy.name}</Title>
                    <Grid gutter='md'>
                        <GridItem span={6}>
                            <Donut values={donutValues}
                                identifier={donutId}
                                withLegend
                            />
                        </GridItem>
                        <GridItem span={6}>
                            <TextContent>
                                <Text component={TextVariants.h3}>Description</Text>
                                <Text className="policy-description" component={TextVariants.p}>
                                    {policy.description}
                                </Text>
                            </TextContent>
                        </GridItem>
                        <GridItem span={12}>
                            <SystemsTable items={systems} columns={columns} />
                        </GridItem>
                    </Grid>
                </React.Fragment>
            );
        }}
    </Query>
);

PolicyDetailsQuery.propTypes = {
    policyId: propTypes.string
};

class PolicyDetails extends React.Component {
    render() {
        return (
            <PolicyDetailsQuery policyId={this.props.match.params.policy_id} />
        );
    }
}

PolicyDetails.propTypes = {
    match: propTypes.object
};

export default routerParams(PolicyDetails);
