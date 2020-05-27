import React from 'react';
import {
    ReportTabs,
    LoadingComplianceCards,
    ReportCard,
    StateViewWithError,
    StateViewPart
} from 'PresentationalComponents';
import { CreatePolicy } from 'SmartComponents';
import { ComplianceEmptyState } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
    Grid,
    GridItem
} from '@patternfly/react-core';

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
    const { data, error, loading } = useQuery(QUERY, { fetchPolicy: 'cache-and-network' });
    let reportCards;
    let pageHeader = <PageHeader style={{ paddingBottom: 22 }}><PageHeaderTitle title="Compliance" /></PageHeader>;

    if (!loading && data) {
        const profiles = data.profiles.edges.map(profile => profile.node).filter((profile) => profile.totalHostCount > 0);

        if (profiles.length) {
            pageHeader = <PageHeader className='page-header-tabs'>
                <PageHeaderTitle title="Compliance reports" />
                <ReportTabs/>
            </PageHeader>;
            reportCards = profiles.map(
                (profile, i) =>
                    <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
                        <ReportCard
                            key={i}
                            profile={profile}
                        />
                    </GridItem>
            );
        } else {
            reportCards = <ComplianceEmptyState title={'No policies are reporting'}
                mainButton={<CreatePolicy onWizardFinish={() => { location.reload(); }} />}
            />;
        }
    }

    return <React.Fragment>
        { pageHeader }
        <Main>
            <StateViewWithError stateValues={ { error, data, loading } }>
                <StateViewPart stateKey='loading'>
                    <div className="policies-donuts">
                        <Grid gutter='md'>
                            <LoadingComplianceCards/>
                        </Grid>
                    </div>
                </StateViewPart>
                <StateViewPart stateKey='data'>
                    <div className="policies-donuts">
                        <Grid gutter='md'>
                            { reportCards }
                        </Grid>
                    </div>
                </StateViewPart>
            </StateViewWithError>
        </Main>
    </React.Fragment>;
};

export default routerParams(Reports);
