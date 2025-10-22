import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Grid,
  GridItem,
  Tab,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
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
  LinkButton,
} from 'PresentationalComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';

import '@/Charts.scss';
import PolicySystemsTab from './PolicySystemsTab';
import './PolicyDetails.scss';
import useSaveValueOverrides from './hooks/useSaveValueOverrides';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import dataSerialiser from 'Utilities/dataSerialiser';
import usePolicyOsVersionCounts from 'Utilities/hooks/usePolicyOsVersionCounts';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import EditRulesButtonToolbarItem from './EditRulesButtonToolbarItem';
import useProfileRuleIds from 'SmartComponents/CreatePolicy/EditPolicyProfilesRules/useProfileRuleIds';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';

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

export const PolicyDetails = ({ route }) => {
  const enableImportRules = useFeatureFlag('compliance.rule_porting');
  const defaultTab = 'details';
  const { policy_id: policyId } = useParams();
  const {
    data: { data: queryData } = {},
    error,
    loading,
    refetch,
  } = usePolicy({ params: { policyId } });
  const versionCounts = usePolicyOsVersionCounts(policyId);
  const data = queryData
    ? {
        profile: {
          ...dataSerialiser(queryData, dataMap),
          policy: { profiles: [] },
        },
      }
    : {};

  const policy = data?.profile;

  // fetch tailorings for the policy to get existing lastest minor version
  const { data: tailoringsData, refetch: refetchTailorings } = useTailorings({
    params: {
      policyId: policyId,
      filter: 'NOT(null? os_minor_version)',
      sortBy: 'os_minor_version:desc',
    },
    skip: !policyId || !enableImportRules,
  });
  const tailoringOSMinorVersions =
    tailoringsData?.data?.map((t) => t.os_minor_version) || [];
  // fetch supported profile for the policy to get all supported minor versions
  const { data: profilesData } = useSupportedProfiles({
    params: {
      filter: `os_major_version=${queryData?.os_major_version} AND ref_id=${queryData?.ref_id}`,
    },
    skip: !queryData || !enableImportRules,
  });
  const supportedOSMinorVersions =
    profilesData?.data?.[0]?.os_minor_versions ?? undefined;

  // identify higher minor versions than the existing tailoring to show rule porting option
  const maxTailoringVersion = Math.max(...tailoringOSMinorVersions);
  const higherVersions = supportedOSMinorVersions?.filter(
    (version) => version > maxTailoringVersion,
  );

  const {
    profilesAndRuleIds: profilesRuleIds,
    loading: profilesRuleIdsLoading,
  } = useProfileRuleIds({
    profileRefId: queryData?.ref_id,
    osMajorVersion: queryData?.os_major_version,
    osMinorVersions: higherVersions,
    skip: !queryData || !higherVersions || !enableImportRules,
  });

  const saveValueOverrides = useSaveValueOverrides();
  const saveToPolicy = async (...args) => {
    await saveValueOverrides(...args);
    refetch?.();
  };

  useTitleEntity(route, policy?.name);
  const DedicatedAction = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => (
      <Flex columnGap={{ default: 'columnGapSm' }}>
        <EditRulesButtonToolbarItem policy={policy} />
        {enableImportRules && (
          <LinkButton
            to={`/scappolicies/${policyId}/import-rules`}
            variant="secondary"
          >
            Import rules
          </LinkButton>
        )}
      </Flex>
    ),
    [enableImportRules, policy, policyId],
  );

  return (
    <StateViewWithError
      stateValues={{ error, data: policy && !loading, loading }}
    >
      <StateViewPart stateKey="loading">
        <PageHeader>
          <PolicyDetailsContentLoader />
        </PageHeader>
        <section className="pf-v6-c-page__main-section">
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
            <section className="pf-v6-c-page__main-section">
              <TabSwitcher defaultTab={defaultTab}>
                <ContentTab eventKey="details">
                  <PolicyDetailsDescription policy={policy} refetch={refetch} />
                </ContentTab>
                <ContentTab eventKey="rules">
                  <PageSection hasBodyWrapper={false}>
                    {profilesRuleIdsLoading && enableImportRules ? (
                      <Spinner />
                    ) : (
                      <Tailorings
                        ouiaId="RHELVersions"
                        columns={[
                          Columns.Name,
                          Columns.Severity,
                          Columns.Remediation,
                        ]}
                        policy={policy}
                        profiles={profilesRuleIds}
                        level={1}
                        DedicatedAction={DedicatedAction}
                        onValueOverrideSave={saveToPolicy}
                        selectedVersionCounts={versionCounts}
                        skipProfile="policy-details"
                        rulePortingAlert={enableImportRules ? true : false}
                        onTailoringCreated={refetchTailorings}
                        enableImportRules
                      />
                    )}
                  </PageSection>
                </ContentTab>
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

PolicyDetails.propTypes = {
  route: PropTypes.object,
};

export default PolicyDetails;
