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
  BackgroundLink,
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
import ReportedSystemRow from './Components/ReportedSystemRow';
import ReportChart from './Components/ReportChart';

export const QUERY = gql`
  query Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      totalHostCount
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
        profiles {
          benchmark {
            version
          }
        }
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
  const pdfReportEnabled = useFeature('pdfReport');
  const { data, error, loading } = useQuery(QUERY, {
    variables: { policyId },
    fetchPolicy: 'no-cache',
  });
  let profile = {};
  let policyName;
  let pageTitle;
  let ssgVersions = [];

  if (!loading && data) {
    profile = data.profile;
    policyName = profile.policy.name;
    pageTitle = `Report: ${policyName}`;
    ssgVersions = [
      ...new Set(
        profile.policy.profiles.flatMap(({ benchmark: { version } }) => version)
      ),
    ];
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
              {pdfReportEnabled && (
                <BackgroundLink
                  state={{ profile }}
                  to={`/reports/${profile.id}/pdf`}
                  component={LinkButton}
                  ouiaId="ReportDetailsDownloadReportPDFLink"
                  variant="primary"
                  className="pf-u-mr-md"
                >
                  Download PDF
                </BackgroundLink>
              )}
              <BackgroundLink
                state={{ profile }}
                to={`/reports/${profile.id}/delete`}
                component={LinkButton}
                variant="link"
                ouiaId="ReportDetailsDeleteReportLink"
                isInline
              >
                Delete report
              </BackgroundLink>
            </GridItem>
          </Grid>
          <Grid hasGutter>
            <GridItem sm={12} md={12} lg={12} xl={6}>
              <ReportChart
                profile={profile}
                hasLegend={true}
                chartClass="report-details-chart-container"
              />
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
                ssgVersions={ssgVersions}
                columns={[
                  Columns.customName({
                    showLink: true,
                    showOsInfo: true,
                  }),
                  Columns.inventoryColumn('tags'),
                  Columns.SsgVersion,
                  Columns.FailedRules,
                  Columns.ComplianceScore,
                  Columns.LastScanned,
                ]}
                compliantFilter
                defaultFilter={`policy_id = ${profile.id}`}
                policyId={profile.id}
                tableProps={{
                  rowWrapper: ReportedSystemRow,
                }}
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

export default ReportDetails;
