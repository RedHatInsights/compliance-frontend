import React, { Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  GridItem,
  Tab,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  PolicyDetailsDescription,
  PolicyDetailsContentLoader,
  RoutedTabSwitcher as TabSwitcher,
  ContentTab,
  StateViewWithError,
  StateViewPart,
  RoutedTabs,
  BreadcrumbLinkItem,
} from 'PresentationalComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import '@/Charts.scss';
import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import PolicyMultiversionRules from './PolicyMultiversionRules';
import './PolicyDetails.scss';

export const QUERY = gql`
  query Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      external
      description
      totalHostCount
      compliantHostCount
      complianceThreshold
      osMajorVersion
      lastScanned
      policy {
        id
        name
        refId
        profiles {
          id
          name
          refId
          osMinorVersion
          osMajorVersion
          benchmark {
            id
            title
            latestSupportedOsMinorVersions
            osMajorVersion
            version
          }
          rules {
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
            precedence
          }
        }
      }
      businessObjective {
        id
        title
      }
      hosts {
        id
        osMinorVersion
      }
    }
  }
`;

export const PolicyDetails = ({ route }) => {
  const defaultTab = 'details';
  const { policy_id: policyId } = useParams();
  const location = useLocation();
  let { data, error, loading, refetch } = useQuery(QUERY, {
    variables: { policyId },
  });
  let policy;
  let hasOsMinorProfiles = true;
  if (data && !loading) {
    policy = data.profile;
    hasOsMinorProfiles = !!policy.policy.profiles.find(
      (profile) => !!profile.osMinorVersion
    );
  }

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  useTitleEntity(route, policy?.name);

  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="loading">
        <PageHeader>
          <PolicyDetailsContentLoader />
        </PageHeader>
        <Main>
          <Spinner />
        </Main>
      </StateViewPart>
      <StateViewPart stateKey="data">
        {policy && (
          <Fragment>
            <PageHeader className="page-header-tabs">
              <Breadcrumb ouiaId="PolicyDetailsPathBreadcrumb">
                <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
                <BreadcrumbLinkItem to="/scappolicies">
                  SCAP policies
                </BreadcrumbLinkItem>
                <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
              </Breadcrumb>
              <Grid gutter="lg">
                <GridItem xl2={11} xl={10} lg={12} md={12} sm={12}>
                  <PageHeaderTitle title={policy.name} />
                </GridItem>
              </Grid>
              <RoutedTabs
                aria-label="Policy Tabs"
                ouiaId="PolicyDetailsTabs"
                defaultTab={defaultTab}
              >
                <Tab title="Details" id="policy-details" eventKey="details" />
                <Tab title="Rules" id="policy-rules" eventKey="rules" />
                <Tab title="Systems" id="policy-systems" eventKey="systems" />
              </RoutedTabs>
            </PageHeader>
            <Main>
              <TabSwitcher defaultTab={defaultTab}>
                <ContentTab eventKey="details">
                  <PolicyDetailsDescription policy={policy} />
                </ContentTab>
                <ContentTab eventKey="rules">
                  {hasOsMinorProfiles ? (
                    <PolicyMultiversionRules policy={policy} />
                  ) : (
                    <PolicyRulesTab policy={policy} />
                  )}
                </ContentTab>
                <ContentTab eventKey="systems">
                  <PolicySystemsTab policy={policy} />
                </ContentTab>
              </TabSwitcher>
            </Main>
          </Fragment>
        )}
      </StateViewPart>
    </StateViewWithError>
  );
};

PolicyDetails.propTypes = {
  route: propTypes.object,
};

export default PolicyDetails;
