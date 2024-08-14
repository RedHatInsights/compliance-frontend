/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbItem,
  EmptyState,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
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
import { SystemsTable } from 'SmartComponents';
import '@/Charts.scss';
import './ReportDetails.scss';
import * as Columns from '../SystemsTable/Columns';
import ReportedSystemRow from './Components/ReportedSystemRow';
import ReportChart from './Components/ReportChart';
import { useReport } from '../../Utilities/hooks/api/useReport';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import { dataMap, QUERY } from './constants';
import dataSerialiser from '../../Utilities/dataSerialiser';

const ReportDetailsBase = ({
  route,
  data,
  error,
  loading,
  ssgVersions = [],
}) => {
  let profile = {};
  let policyName;
  let pageTitle;

  if (!loading && data) {
    profile = data;
    policyName = profile.policy.name;
    pageTitle = `Report: ${policyName}`;
  }

  useTitleEntity(route, policyName);

  console.log('hello data', data);
  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="loading">
        <PageHeader>
          <ReportDetailsContentLoader />
        </PageHeader>
        <section className="pf-v5-c-page__main-section">
          <EmptyState>
            <Spinner />
          </EmptyState>
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
                className="pf-v5-u-mr-md"
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
        <section className="pf-v5-c-page__main-section">
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
                  Columns.inventoryColumn('groups', {
                    requiresDefault: true,
                    sortBy: ['groups'],
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
                ruleSeverityFilter
                showGroupsFilter
              />
            </GridItem>
          </Grid>
        </section>
      </StateViewPart>
    </StateViewWithError>
  );
};

ReportDetailsBase.propTypes = {
  route: propTypes.object,
  data: propTypes.object,
  error: propTypes.object,
  loading: propTypes.bool,
  ssgVersions: propTypes.array,
};

//depricated component
const ReportDetailsGrapgQL = ({ route }) => {
  const { report_id: policyId } = useParams();
  const { data, error, loading } = useQuery(QUERY, {
    variables: { policyId },
    fetchPolicy: 'no-cache',
  });

  const ssgVersions = data
    ? [
        ...new Set(
          data.profile.policy.profiles.flatMap(
            ({ benchmark: { version } }) => version
          )
        ),
      ]
    : [];

  return (
    <ReportDetailsBase
      {...{ route, data: data?.profile, error, loading, ssgVersions }}
    />
  );
};

ReportDetailsGrapgQL.propTypes = {
  route: propTypes.object,
};

const ReportDetailsRest = ({ route }) => {
  const { report_id: policyId } = useParams();
  const { data: { data } = {}, error, loading } = useReport(policyId);

  return (
    <ReportDetailsBase
      {...{ route, data: dataSerialiser(data, dataMap), error, loading }}
    />
  );
};

ReportDetailsRest.propTypes = {
  route: propTypes.object,
};

const ReportsWrapper = (props) => {
  const isRestApiEnabled = useAPIV2FeatureFlag();

  return isRestApiEnabled ? (
    <ReportDetailsRest {...props} />
  ) : (
    <ReportDetailsGrapgQL {...props} />
  );
};

export default ReportsWrapper;
