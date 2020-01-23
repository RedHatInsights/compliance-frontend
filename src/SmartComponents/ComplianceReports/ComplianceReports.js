import React from 'react';
import {
    ComplianceTabs,
    LoadingComplianceCards,
    CompliancePolicyCard,
    CompliancePoliciesEmptyState,
    ErrorPage
} from 'PresentationalComponents';
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
    allProfiles {
        id
        name
        refId
        description
        totalHostCount
        compliantHostCount
        businessObjective {
            id
            title
        }
    }
}
`;

export const ComplianceReports = () => {
    const { data, error, loading } = useQuery(QUERY);

    if (error) { return <ErrorPage error={error}/>; }

    if (loading) {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title="Compliance" />
                </PageHeader>
                <Main>
                    <div className="policies-donuts">
                        <Grid gutter='md'>
                            <LoadingComplianceCards/>
                        </Grid>
                    </div>
                </Main>
            </React.Fragment>
        );
    }

    const policies = data.allProfiles.filter((profile) => profile.totalHostCount > 0);
    const beta = window.location.pathname.split('/')[1] === 'beta';

    let policyCards = [];
    let pageHeader;
    if (policies.length) {
        pageHeader = <PageHeader className={ beta ? 'beta-page-header' : 'stable-page-header' }>
            <PageHeaderTitle title="Compliance reports" />
            { !beta && <ComplianceTabs/> }

        </PageHeader>;
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
        pageHeader = <PageHeader style={{ paddingBottom: 22 }}><PageHeaderTitle title="Compliance" /></PageHeader>;
        policyCards = <CompliancePoliciesEmptyState />;
    }

    return (
        <React.Fragment>
            { pageHeader }
            <Main>
                <div className="policies-donuts">
                    <Grid gutter='md'>
                        {policyCards}
                    </Grid>
                </div>
            </Main>
        </React.Fragment>
    );
};

export default routerParams(ComplianceReports);
