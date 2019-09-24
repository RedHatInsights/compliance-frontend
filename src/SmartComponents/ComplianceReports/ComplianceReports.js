import React from 'react';
import ComplianceTabs from '../ComplianceTabs/ComplianceTabs';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import emptyStateStyles from '@patternfly/patternfly/components/EmptyState/empty-state.css';
import { CloudServerIcon } from '@patternfly/react-icons';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import CompliancePolicyCard from '../CompliancePolicyCard/CompliancePolicyCard';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorPage from '../ErrorPage/ErrorPage';
import ContentLoader from 'react-content-loader';
import {
    Card,
    Grid,
    GridItem,
    Title,
    TextContent,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    ClipboardCopy,
    ClipboardCopyVariant
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
            title
        }
    }
}
`;

const LoadingComplianceCard = () => (
    <Card>
        <ContentLoader
            height={400}
            width={400}
            speed={2}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
        >
            <rect x="6" y="31" rx="4" ry="4" width="293" height="15" />
            <rect x="8" y="15" rx="3" ry="3" width="85" height="6" />
            <rect x="7" y="112" rx="3" ry="3" width="220" height="10" />
            <circle cx="190" cy="256" r="109" />
            <rect x="8" y="73" rx="0" ry="0" width="69" height="23" />
            <rect x="47" y="77" rx="0" ry="0" width="0" height="0" />
            <rect x="36" y="77" rx="0" ry="0" width="16" height="0" />
        </ContentLoader>
    </Card>
);

const LoadingComplianceCards = () => (
    <Grid gutter='md'>
        <GridItem sm={12} md={12} lg={6} xl={4}>
            <LoadingComplianceCard/>
        </GridItem>
        <GridItem sm={12} md={12} lg={6} xl={4}>
            <LoadingComplianceCard/>
        </GridItem>
        <GridItem sm={12} md={12} lg={6} xl={4}>
            <LoadingComplianceCard/>
        </GridItem>
    </Grid>
);

const ComplianceReports = () => (
    <Query query={QUERY}>
        {({ data, error, loading }) => {
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
                                    <LoadingComplianceCards/>;
                                </Grid>
                            </div>
                        </Main>
                    </React.Fragment>
                );
            }

            const policies = data.allProfiles;
            let policyCards = [];
            let pageHeader;
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
                policyCards = <Bullseye>
                    <EmptyState>
                        <EmptyStateIcon style={{ fontWeight: '500', color: 'var(--pf-global--primary-color--100)' }}
                            size="xl" title="Compliance" icon={CloudServerIcon} />
                        <br/>
                        <Title size="lg">Connect with OpenSCAP to do more with Red Hat Enterprise Linux</Title>
                        <br/>
                        <span className={emptyStateStyles.emptyStateBody}>
                            <TextContent>
                                Scan and upload a report on a system with OpenSCAP to see information
                                about your system&#39;s compliance to policies.
                                <br/>
                                Generate a report with OpenSCAP with the following command:
                                <ClipboardCopy className='upload-instructions'
                                    variant={ClipboardCopyVariant.expansion}>
                                    oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_standard
                                    --results scan.xml /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml
                                </ClipboardCopy>
                                And upload it using the following command:
                                <ClipboardCopy className='upload-instructions'
                                    variant={ClipboardCopyVariant.expansion}>
                                    sudo insights-client --verbose --payload scan.xml
                                    --content-type application/vnd.redhat.compliance.something+tgz
                                </ClipboardCopy>
                            </TextContent>
                        </span>

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
        }}
    </Query>
);

export default routerParams(ComplianceReports);
