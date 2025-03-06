import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
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
import PolicySystemsTab from './PolicySystemsTab';
import './PolicyDetails.scss';
import useSaveValueOverrides from './hooks/useSaveValueOverrides';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import dataSerialiser from 'Utilities/dataSerialiser';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';
import EditRulesButtonToolbarItem from './EditRulesButtonToolbarItem';
import usePolicyOsVersionCounts from '../../Utilities/hooks/api/usePolicyOsVersionCounts';

export const PolicyDetailsBase = ({
  route,
  query,
  saveToPolicy,
  versionCounts,
}) => {
  const defaultTab = 'details';
  const { data, error, loading, refetch } = query;
  const policy = data?.profile;

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
                <ContentTab eventKey="rules">
                  <PageSection variant={PageSectionVariants.light}>
                    <Tailorings
                      ouiaId="RHELVersions"
                      columns={[
                        Columns.Name,
                        Columns.Severity,
                        Columns.Remediation,
                      ]}
                      policy={policy}
                      level={1}
                      DedicatedAction={DedicatedAction}
                      onValueOverrideSave={saveToPolicy}
                      selectedVersionCounts={versionCounts}
                    />
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

PolicyDetailsBase.propTypes = {
  route: PropTypes.object,
  query: PropTypes.shape({
    data: PropTypes.oneOf([undefined, PropTypes.object]),
    error: PropTypes.oneOf([undefined, PropTypes.string]),
    loading: PropTypes.oneOf([undefined, false, true]),
    refetch: PropTypes.func,
  }),
  saveToPolicy: PropTypes.func,
  versionCounts: PropTypes.object,
};

const PolicyDetails = ({ route }) => {
  const { policy_id: policyId } = useParams();
  const query = usePolicy({ params: { policyId } });
  const versionCounts = usePolicyOsVersionCounts(policyId);
  const data = query?.data?.data
    ? {
        profile: {
          ...dataSerialiser(query.data.data, dataMap),
          policy: { profiles: [] },
        },
      }
    : {};

  const saveValueOverrides = useSaveValueOverrides();
  const saveValue = async (...args) => {
    await saveValueOverrides(...args);
    query.refetch?.();
  };

  return (
    <PolicyDetailsBase
      query={{ ...query, data }}
      route={route}
      saveToPolicy={saveValue}
      versionCounts={versionCounts}
    />
  );
};

PolicyDetails.propTypes = {
  route: PropTypes.object,
};

export default PolicyDetails;

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
