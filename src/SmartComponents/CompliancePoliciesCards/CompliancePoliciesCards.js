import React from 'react';
import {
    Grid,
    GridItem,
    Title,
    Text,
    TextContent,
    TextVariants,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { ClipboardCheckIcon } from '@patternfly/react-icons';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import CompliancePolicyCard from '../CompliancePolicyCard/CompliancePolicyCard';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorPage from '../ErrorPage/ErrorPage';

const QUERY = gql`
{
    allProfiles {
        id
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
            if (error) { return <ErrorPage error={error}/>; }

            if (loading) { return 'Loading Policies...'; }

            const policies = data.allProfiles;
            let policyCards = [];
            if (policies.length) {
                policyCards = policies.map(
                    (policy, i) =>
                        <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
                            <CompliancePolicyCard
                                key={i}
                                policy={policy}
                            />
                        </GridItem>
                );
            } else {
                policyCards = <Bullseye>
                    <EmptyState>
                        <EmptyStateIcon size="xl" title="Compliance" icon={ClipboardCheckIcon} />
                        <br/>
                        <Title size="lg">Welcome to Compliance</Title>
                        <EmptyStateBody>
                            <TextContent>
                                You have not uploaded any reports yet. Please generate a report using
                                OpenSCAP:
                                <Text component={TextVariants.blockquote}>
                                    oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_standard
                                    --results scan.xml /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml
                                </Text>
                                and upload it using the following command:
                                <Text component={TextVariants.blockquote}>
                                    sudo insights-client --verbose --payload scan.xml
                                    --content-type application/vnd.redhat.compliance.something+tgz
                                </Text>
                            </TextContent>
                        </EmptyStateBody>

                        <Button
                            variant="primary"
                            component="a"
                            target="_blank"
                            href="https://www.open-scap.org/getting-started/">
                            Get started with OpenSCAP
                        </Button>
                    </EmptyState>
                </Bullseye>;

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
