/* eslint-disable react/display-name */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  EmptyState,
  Grid,
  GridItem,
  Tab,
  Tabs,
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
import { SystemsTable } from 'SmartComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import useReport from 'Utilities/hooks/api/useReport';
import useReportTestResultsSG from 'Utilities/hooks/api/useReportTestResultsSG';
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';
import dataSerialiser from 'Utilities/dataSerialiser';
import * as Columns from '../SystemsTable/Columns';
import ReportedSystemRow from './Components/ReportedSystemRow';
import ReportChart from './Components/ReportChart';
import {
  dataMap,
  fetchNeverReportedCustomOSes,
  fetchReportingCustomOSes,
  QUERY,
} from './constants';
import '@/Charts.scss';
import './ReportDetails.scss';
import useFetchReporting from 'SmartComponents/ReportDetails/Components/hooks/useFetchReporting';
import useFetchNeverReported from 'SmartComponents/ReportDetails/Components/hooks/useFetchNeverReported';
import TabTitleWithData from 'SmartComponents/ReportDetails/Components/TabTitleWithData';

const ReportDetailsBase = ({
  id,
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

  const isRestApiEnabled = useAPIV2FeatureFlag();

  const [tab, setTab] = useState('reporting');

  const handleTabSelect = (_, eventKey) => setTab(eventKey);

  const {
    isLoading: isLoadingReporting,
    fetch: fetchReporting,
    data: dataReporting,
  } = useFetchReporting(id);

  const {
    isLoading: isLoadingNeverReported,
    fetch: fetchNeverReported,
    data: dataNeverReported,
  } = useFetchNeverReported(id);

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
              {isRestApiEnabled === undefined ? (
                <Bullseye>
                  <Spinner />
                </Bullseye>
              ) : isRestApiEnabled ? (
                <Tabs
                  className="pf-m-light pf-v5-c-table"
                  activeKey={tab}
                  onSelect={handleTabSelect}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tab
                    key={'reporting'}
                    eventKey={'reporting'}
                    title={
                      <TabTitleWithData
                        text="Reporting"
                        data={dataReporting?.meta?.total}
                        isLoading={isLoadingReporting}
                        color="blue"
                      />
                    }
                  >
                    <SystemsTable
                      systemProps={{
                        isFullView: true,
                      }}
                      remediationsEnabled={true}
                      fetchApi={fetchReporting}
                      columns={[
                        Columns.customDisplay({
                          showLink: true,
                          showOsInfo: true,
                          idProperty: 'system_id',
                          sortBy: ['display_name'],
                        }),
                        Columns.inventoryColumn('groups', {
                          requiresDefault: true,
                          sortBy: ['groups'],
                        }),
                        Columns.inventoryColumn('tags'),
                        Columns.SsgVersion(true),
                        Columns.FailedRules(true),
                        Columns.ComplianceScore(true),
                        Columns.LastScanned,
                      ]}
                      showOsMinorVersionFilter={[profile.osMajorVersion]}
                      ignoreOsMajorVersion
                      ssgVersions={ssgVersions}
                      compliantFilter
                      ruleSeverityFilter
                      showGroupsFilter
                      apiV2Enabled={true}
                      reportId={id}
                      fetchCustomOSes={fetchReportingCustomOSes}
                    />
                  </Tab>

                  <Tab
                    key={'never-reported'}
                    eventKey={'never-reported'}
                    title={
                      <TabTitleWithData
                        text="Never reported"
                        data={dataNeverReported?.meta?.total}
                        isLoading={isLoadingNeverReported}
                      />
                    }
                  >
                    <SystemsTable
                      systemProps={{
                        isFullView: true,
                      }}
                      remediationsEnabled={false}
                      fetchApi={fetchNeverReported}
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
                        Columns.LastScanned,
                      ]}
                      defaultFilter={'never_reported = true'}
                      showGroupsFilter
                      apiV2Enabled={true}
                      reportId={id}
                      fetchCustomOSes={fetchNeverReportedCustomOSes}
                      enableExport={false}
                    />
                  </Tab>
                </Tabs>
              ) : (
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
                    Columns.SsgVersion(false),
                    Columns.FailedRules(false),
                    Columns.ComplianceScore(false),
                    Columns.LastScanned,
                  ]}
                  compliantFilter
                  defaultFilter={`policy_id = ${profile.id}`}
                  policyId={id}
                  tableProps={{
                    rowWrapper: ReportedSystemRow,
                  }}
                  ruleSeverityFilter
                  showGroupsFilter
                  apiV2Enabled={false}
                />
              )}
            </GridItem>
          </Grid>
        </section>
      </StateViewPart>
    </StateViewWithError>
  );
};

ReportDetailsBase.propTypes = {
  id: propTypes.string.isRequired,
  route: propTypes.object,
  data: propTypes.object,
  error: propTypes.object,
  loading: propTypes.bool,
  ssgVersions: propTypes.array,
};

//deprecated component
const ReportDetailsGraphQL = ({ route }) => {
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
      {...{
        route,
        data: data?.profile,
        error,
        loading,
        ssgVersions,
        id: policyId,
      }}
    />
  );
};

ReportDetailsGraphQL.propTypes = {
  route: propTypes.shape({
    title: propTypes.string.isRequired,
    defaultTitle: propTypes.string.isRequired,
  }).isRequired,
};

const ReportDetailsRest = ({ route }) => {
  const { report_id } = useParams();
  const { data: { data } = {}, error, loading } = useReport(report_id);
  const { data: ssgVersions = [] } = useReportTestResultsSG(report_id);

  return (
    <ReportDetailsBase
      {...{
        route,
        data: dataSerialiser(data, dataMap),
        error,
        loading,
        ssgVersions,
        id: report_id,
      }}
    />
  );
};

ReportDetailsRest.propTypes = {
  route: propTypes.shape({
    title: propTypes.string.isRequired,
    defaultTitle: propTypes.string.isRequired,
  }).isRequired,
};

const ReportsWrapper = (props) => {
  const isRestApiEnabled = useAPIV2FeatureFlag();

  return isRestApiEnabled ? (
    <ReportDetailsRest {...props} />
  ) : (
    <ReportDetailsGraphQL {...props} />
  );
};

export default ReportsWrapper;
