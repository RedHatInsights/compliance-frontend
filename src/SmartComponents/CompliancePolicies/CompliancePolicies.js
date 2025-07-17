import React from 'react';
import {
  Flex,
  Grid,
  Spinner,
  Popover,
  Icon,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  ErrorPage,
  PoliciesTable,
  StateView,
  StateViewPart,
} from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import CreateLink from 'SmartComponents/CompliancePolicies/components/CreateLink';
import ComplianceEmptyState from 'PresentationalComponents/ComplianceEmptyState';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import {
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';

const CompliancePolicies = () => {
  // Async table needs info about total policy count before mounting
  // Also required for correctly showing empty state
  const {
    data: totalPolicies,
    error: totalPoliciesError,
    loading: totalPoliciesLoading,
  } = usePolicies({
    onlyTotal: true,
  });

  let {
    data: { data, meta: { total: currentTotalPolicies } = {} } = {},
    error: policiesError,
    loading: policiesLoading,
    exporter,
  } = usePolicies({
    useTableState: true,
    batch: { batchSize: 10 },
  });
  const error = policiesError || totalPoliciesError;

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle
          title={
            <React.Fragment>
              SCAP policies
              <Popover
                headerContent="About SCAP policies"
                bodyContent={
                  <Content>
                    <Flex direction={{ default: 'column' }}>
                      <Content component={ContentVariants.p}>
                        Customize OpenSCAP policies based on your
                        organization&apos;s compliance requirements.
                      </Content>
                      <Content component={ContentVariants.p}>
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={
                            'https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html-single/' +
                            'assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
                            'index#compliance-managing-policies_intro-compliance'
                          }
                        >
                          Learn more
                          <Icon className="pf-v6-u-ml-xs">
                            <ExternalLinkAltIcon />
                          </Icon>
                        </a>
                      </Content>
                    </Flex>
                  </Content>
                }
              >
                <Icon>
                  <OutlinedQuestionCircleIcon
                    className="grey-icon pf-v6-u-ml-md"
                    style={{
                      verticalAlign: 0,
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  />
                </Icon>
              </Popover>
            </React.Fragment>
          }
        />
      </PageHeader>
      <section className="pf-v6-c-page__main-section">
        <StateView
          stateValues={{
            error: error,
            loading: totalPoliciesLoading,
            showTable: totalPolicies !== undefined && !error,
          }}
        >
          <StateViewPart stateKey="error">
            <ErrorPage error={error} />
          </StateViewPart>
          <StateViewPart stateKey="loading">
            <Spinner />
          </StateViewPart>
          <StateViewPart stateKey="showTable">
            {totalPolicies === 0 ? (
              <Grid hasGutter>
                <ComplianceEmptyState
                  title="No policies"
                  mainButton={<CreateLink />}
                />
              </Grid>
            ) : (
              <PoliciesTable
                policies={data}
                total={currentTotalPolicies}
                loading={policiesLoading}
                DedicatedAction={CreateLink}
                options={{
                  exporter,
                }}
              />
            )}
          </StateViewPart>
        </StateView>
      </section>
    </React.Fragment>
  );
};

const PoliciesWithTableStateProvider = () => (
  <TableStateProvider>
    <CompliancePolicies />
  </TableStateProvider>
);

export default PoliciesWithTableStateProvider;
