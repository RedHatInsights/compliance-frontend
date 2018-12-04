import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import CompliancePolicyCard from '../CompliancePolicyCard/CompliancePolicyCard';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
{
    allProfiles {
        name
        ref_id
        description
        total_host_count
        compliant_host_count
    }
}
`;

const CompliancePoliciesCards = () => (
    <Query query={QUERY}>
        {({ data, error, loading }) => {
            if (error) { return 'Oops! Error loading Policy data: ' + error; }

            if (loading) { return 'Loading Policies...'; }

            const policies = data.allProfiles;
            let policyCards = [];
            if (policies.length) {
                policyCards = policies.map(
                    (policy, i) =>
                        <GridItem span={3} key={i}>
                            <CompliancePolicyCard
                                key={i}
                                policy={policy}
                            />
                        </GridItem>
                );
            }

            return (
                <div className="policies-donuts">
                    <Grid gutter='md'>
                        {policyCards}
                    </Grid>
                </div>
            );
        }}
    </Query>
);

export default routerParams(CompliancePoliciesCards);
