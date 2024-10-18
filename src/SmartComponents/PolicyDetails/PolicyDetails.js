import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  GridItem,
  Tab,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
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
  Tailorings,
} from 'PresentationalComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import '@/Charts.scss';
import PolicyRulesTab from './PolicyRulesTab';
import PolicySystemsTab from './PolicySystemsTab';
import PolicyMultiversionRules from './PolicyMultiversionRules';
import './PolicyDetails.scss';
import useSaveValueToPolicy from './hooks/useSaveValueToPolicy';
import usePolicyQuery from 'Utilities/hooks/usePolicyQuery';
import usePolicyQuery2 from '../../Utilities/hooks/usePolicyQuery/usePolicyQuery2';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import dataSerialiser from '../../Utilities/dataSerialiser';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import EditRulesButtonToolbarItem from './EditRulesButtonToolbarItem';

export const PolicyDetailsWrapper = ({ route }) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  const PolicyDetails = apiV2Enabled ? PolicyDetailsV2 : PolicyDetailsGraphQL;

  return <PolicyDetails route={route} />;
};

const PolicyDetailsGraphQL = ({ route }) => {
  const { policy_id: policyId } = useParams();
  const query = usePolicyQuery({
    policyId,
  });

  return <PolicyDetailsBase query={query} route={route} />;
};

const PolicyDetailsV2 = ({ route }) => {
  const { policy_id: policyId } = useParams();
  const query = usePolicyQuery2({ policyId });
  const data = query?.data?.data
    ? {
        profile: {
          ...dataSerialiser(query.data.data, dataMap),
          policy: { profiles: [] },
        },
      }
    : {};

  return <PolicyDetailsBase isAPIV2 query={{ ...query, data }} route={route} />;
};

export const PolicyDetailsBase = ({ route, query, isAPIV2 }) => {
  const defaultTab = 'details';
  const { data, error, loading, refetch } = query;
  const location = useLocation();
  const policy = data?.profile;
  const hasOsMinorProfiles = !!policy?.policy.profiles.find(
    (profile) => !!profile.osMinorVersion
  );

  const saveToPolicy = useSaveValueToPolicy(policy, () => {
    refetch();
  });

  useEffect(() => {
    !isAPIV2 && refetch();
  }, [isAPIV2, location, refetch]);

  useTitleEntity(route, policy?.name);
  const DedicatedAction = () => <EditRulesButtonToolbarItem policy={policy} />;

  return (
    <StateViewWithError
      stateValues={{ error, data: policy && !loading, loading }}
    >
      <StateViewPart stateKey="loading">
        <PageHeader>
          <PolicyDetailsContentLoader />
        </PageHeader>
        <section className="pf-v5-c-page__main-section">
          <Spinner />
        </section>
      </StateViewPart>
      <StateViewPart stateKey="data">
        {policy ? (
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
            <section className="pf-v5-c-page__main-section">
              <TabSwitcher defaultTab={defaultTab}>
                <ContentTab eventKey="details">
                  <PolicyDetailsDescription policy={policy} refetch={refetch} />
                </ContentTab>
                {isAPIV2 ? (
                  <ContentTab eventKey="rules">
                    <PageSection variant={PageSectionVariants.light}>
                      <Tailorings
                        columns={[
                          Columns.Name,
                          Columns.Severity,
                          Columns.Remediation,
                        ]}
                        policy={policy}
                        level={1}
                        DedicatedAction={DedicatedAction}
                      />
                    </PageSection>
                  </ContentTab>
                ) : (
                  <ContentTab eventKey="rules">
                    {hasOsMinorProfiles ? (
                      <PolicyMultiversionRules
                        policy={policy}
                        saveToPolicy={saveToPolicy}
                        onRuleValueReset={() => refetch()}
                        DedicatedAction={DedicatedAction}
                      />
                    ) : (
                      <PolicyRulesTab policy={policy} />
                    )}
                  </ContentTab>
                )}
                <ContentTab eventKey="systems">
                  <PolicySystemsTab policy={policy} />
                </ContentTab>
              </TabSwitcher>
            </section>
          </Fragment>
        ) : (
          ''
        )}
      </StateViewPart>
    </StateViewWithError>
  );
};

PolicyDetailsWrapper.propTypes = {
  route: PropTypes.object,
};

PolicyDetailsGraphQL.propTypes = {
  route: PropTypes.object,
};

PolicyDetailsV2.propTypes = {
  route: PropTypes.object,
};
PolicyDetailsBase.propTypes = {
  route: PropTypes.object,
  query: PropTypes.shape({
    data: PropTypes.oneOf([undefined, PropTypes.object]),
    error: PropTypes.oneOf([undefined, PropTypes.string]),
    loading: PropTypes.oneOf([undefined, false, true]),
    refetch: PropTypes.func,
  }),
  isAPIV2: PropTypes.bool,
};

export default PolicyDetailsWrapper;

const dataMap = {
  id: ['id', 'policy.id'],
  title: 'name',
  description: 'description',
  business_objective: 'businessObjective.title',
  compliance_threshold: 'complianceThreshold',
  total_system_count: 'totalHostCount',
  os_major_version: 'osMajorVersion',
  profile_title: ['policy.name', 'policyType'],
  ref_id: 'refId',
};
