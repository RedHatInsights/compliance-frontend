import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import {
    LoadingComplianceCards, ReportCardGrid, StateViewPart, StateViewWithError
} from 'PresentationalComponents';

const QUERY = gql`
{
    profiles(search: "has_test_results = true", limit: 1000){
        edges {
            node {
                id
                name
                refId
                description
                totalHostCount
                compliantHostCount
                majorOsVersion
                complianceThreshold
                businessObjective {
                    id
                    title
                }
                policy {
                    id
                    benchmark {
                        id
                        version
                    }
                }
                benchmark {
                    id
                    version
                }
            }
        }

    }
}
`;

export const Reports = () => {
    let { data, error, loading } = useQuery(QUERY, { fetchPolicy: 'cache-and-network' });
    let profiles;

    if (data) {
        profiles = data.profiles.edges.map((profile) => (
            profile.node
        )).filter((profile) => (
            profile.totalHostCount > 0
        ));
        error = undefined;
        loading = undefined;
    }

    return <React.Fragment>
        <PageHeader>
            <PageHeaderTitle title="Compliance reports" />
        </PageHeader>
        <Main>
            <StateViewWithError stateValues={ { error, data, loading } }>
                <StateViewPart stateKey='loading'>
                    <div className="policies-donuts">
                        <Grid hasGutter>
                            <LoadingComplianceCards />
                        </Grid>
                    </div>
                </StateViewPart>
                <StateViewPart stateKey='data'>
                    <div className="policies-donuts">
                        <Grid hasGutter>
                            <ReportCardGrid profiles={ profiles } />
                        </Grid>
                    </div>
                </StateViewPart>
            </StateViewWithError>
        </Main>
    </React.Fragment>;
};

export default Reports;
