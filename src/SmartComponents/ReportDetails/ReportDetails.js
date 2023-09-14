/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
  Breadcrumb,
  BreadcrumbItem,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import {
  LinkWithPermission as Link,
  BreadcrumbLinkItem,
  ReportDetailsContentLoader,
  ReportDetailsDescription,
  StateViewWithError,
  StateViewPart,
  SubPageTitle,
  LinkButton,
} from 'PresentationalComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import useFeature from 'Utilities/hooks/useFeature';
import { SystemsTable } from 'SmartComponents';
import '@/Charts.scss';
import './ReportDetails.scss';
import * as Columns from '../SystemsTable/Columns';
import { default as ReportDetailsWithNotReportedSystems } from './ReportDetailsWithNotReportedSystems';
import ReportChart from './Components/ReportChart';

export const QUERY = gql`
  query RD_Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      testResultHostCount
      compliantHostCount
      unsupportedHostCount
      complianceThreshold
      osMajorVersion
      lastScanned
      policyType
      policy {
        id
        name
      }
      businessObjective {
        id
        title
      }
    }
  }
`;

export const ReportDetails = ({ route }) => {
  const { report_id: policyId } = useParams();
  const { data, error, loading } = useQuery(QUERY, {
    variables: { policyId },
    fetchPolicy: 'no-cache',
  });
  let profile = {};
  let policyName;
  let pageTitle;

  if (!loading && data) {
    profile = data.profile;
    policyName = profile.policy.name;
    pageTitle = `Report: ${policyName}`;
  }

  useTitleEntity(route, policyName);

  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="loading">
        <PageHeader>
          <ReportDetailsContentLoader />
        </PageHeader>
        <section className="pf-c-page__main-section">
          <EmptyTable>
            <Spinner />
          </EmptyTable>
        </section>
      </StateViewPart>
      <StateViewPart stateKey="data">
        <PageHeader>
          <Breadcrumb ouiaId="ReportDetailsPathBreadcrumb">
            <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
            <BreadcrumbLinkItem to="/reports">Reports</BreadcrumbLinkItem>
            <BreadcrumbItem isActive>{pageTitle}</BreadcrumbItem>
          </Breadcrumb>
          <Grid hasGutter>
            <GridItem sm={9} md={9} lg={9} xl={9}>
              <PageHeaderTitle title={pageTitle} />
              <SubPageTitle>{profile.policyType}</SubPageTitle>
            </GridItem>
            <GridItem
              className="report-details-button"
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <Link
                state={{ profile }}
                to={`/reports/${profile.id}/pdf`}
                className="pf-u-mr-md"
                Component={LinkButton}
                componentProps={{
                  variant: 'primary',
                  ouiaId: 'ReportDetailsDownloadReportPDFLink',
                }}
              >
                Download PDF
              </Link>

              <Link
                state={{ profile }}
                to={`/reports/${profile.id}/delete`}
                Component={LinkButton}
                componentProps={{
                  isInline: true,
                  variant: 'link',
                  ouiaId: 'ReportDetailsDeleteReportLink',
                }}
              >
                Delete report
              </Link>
            </GridItem>
          </Grid>
          <Grid hasGutter>
            <GridItem sm={12} md={12} lg={12} xl={6}>
              <div className="chart-inline">
                <div className="chart-container">
                  <ReportChart
                    profile={profile}
                    hasLegend={true}
                    chartClass="report-details-chart-container"
                  />
                </div>
              </div>
            </GridItem>
            <GridItem sm={12} md={12} lg={12} xl={6}>
              <ReportDetailsDescription profile={profile} />
            </GridItem>
          </Grid>
        </PageHeader>
        <section className="pf-c-page__main-section">
          <Grid hasGutter>
            <GridItem span={12}>
              <SystemsTable
                showOsMinorVersionFilter={[profile.osMajorVersion]}
                columns={[
                  Columns.customName({
                    showLink: true,
                    showOsInfo: true,
                  }),
                  Columns.inventoryColumn('groups', {
                    requiresDefault: true,
                  }),
                  Columns.inventoryColumn('tags'),
                  Columns.SsgVersion,
                  Columns.FailedRules,
                  Columns.ComplianceScore,
                  Columns.LastScanned,
                ]}
                showOnlySystemsWithTestResults
                compliantFilter
                defaultFilter={`with_results_for_policy_id = ${profile.id}`}
                policyId={profile.id}
                showGroupsFilter
              />
            </GridItem>
          </Grid>
        </section>
      </StateViewPart>
    </StateViewWithError>
  );
};

ReportDetails.propTypes = {
  route: propTypes.object,
};

const ReportDetailsFeatureWrapper = (props) => {
  const systemsNotReporting = useFeature('systemsNotReporting');

  return systemsNotReporting ? (
    <ReportDetailsWithNotReportedSystems {...props} />
  ) : (
    <ReportDetails {...props} />
  );
};

export default ReportDetailsFeatureWrapper;
