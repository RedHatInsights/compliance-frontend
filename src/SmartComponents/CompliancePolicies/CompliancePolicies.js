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

// Only CompliancePolicies should be in this file.
// The general rule should be to only have one Component per file.
// TODO: The component looks a bit turned around. (see in-component comments)
const CompliancePolicies = () => {
    const { data, error, loading } = useQuery(QUERY);

    // TODO: There should only be one return per component
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

    let policyCards = [];
    let pageHeader;
    // TODO: this differentiation should happen in the last return JSX
    if (policies.length) {
        pageHeader = <PageHeader>
            <PageHeaderTitle title="Compliance" />
            <ComplianceTabs/>
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

export default routerParams(CompliancePolicies);
