import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  EmptyState,
  Grid,
  GridItem,
  Spinner,
  Tab,
  Tabs,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

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
import * as Columns from '../SystemsTable/Columns';
import ReportChart from './Components/ReportChart';
import '@/Charts.scss';
import './ReportDetails.scss';
import TabTitleWithData from 'SmartComponents/ReportDetails/Components/TabTitleWithData';

const ReportDetails = ({ route }) => {
  const { report_id } = useParams();
  const {
    data: { data: report } = {},
    error,
    loading,
  } = useReport({ params: { reportId: report_id } });
  const { data: { data: ssgVersions } = {} } = useReportTestResultsSG({
    params: { reportId: report_id },
    skip: !report,
  });
  let reportTitle;
  let pageTitle;

  if (!loading && report) {
    reportTitle = report.title;
    pageTitle = `Report: ${reportTitle}`;
  }

  useTitleEntity(route, reportTitle);

  const [tab, setTab] = useState('reporting');

  const handleTabSelect = (_, eventKey) => setTab(eventKey);

  return (
    <StateViewWithError
      stateValues={{ error, report: report && !loading, loading }}
    >
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
      <StateViewPart stateKey="report">
        <PageHeader>
          <Breadcrumb ouiaId="ReportDetailsPathBreadcrumb">
            <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
            <BreadcrumbLinkItem to="/reports">Reports</BreadcrumbLinkItem>
            <BreadcrumbItem isActive>{pageTitle}</BreadcrumbItem>
          </Breadcrumb>
          <Grid hasGutter>
            <GridItem sm={9} md={9} lg={9} xl={9}>
              <PageHeaderTitle title={pageTitle} />
              <SubPageTitle>{report?.profile_title}</SubPageTitle>
            </GridItem>
            <GridItem
              className="report-details-button"
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <Link
                state={{ report }}
                to={`/reports/${report?.id}/pdf`}
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
                state={{ report }}
                to={`/reports/${report?.id}/delete`}
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
                report={report}
                hasLegend={true}
                chartClass="report-details-chart-container"
              />
            </GridItem>
            <GridItem sm={12} md={12} lg={12} xl={6}>
              <ReportDetailsDescription report={report} />
            </GridItem>
          </Grid>
        </PageHeader>
        <section className="pf-v5-c-page__main-section">
          <Grid hasGutter>
            <GridItem span={12}>
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
                  ouiaId="Reporting"
                  title={
                    <TabTitleWithData
                      text="Reporting"
                      data={report?.reported_system_count}
                      isLoading={loading}
                      color="blue"
                    />
                  }
                >
                  <SystemsTable
                    apiEndpoint="reportTestResults"
                    reportId={report_id}
                    columns={({
                      name,
                      tags,
                      workspaces,
                      ssgVersion,
                      complianceScore,
                      lastScanned,
                    }) => [
                      {
                        ...name,
                        // TODO this should be a tabletools feature
                        componentProps: { showLink: true, showOsInfo: true },
                      },
                      workspaces,
                      tags,
                      ssgVersion,
                      complianceScore,
                      lastScanned,
                    ]}
                    filters={({ name, policies, groups, ssgVersions }) => [
                      name,
                      policies,
                      groups,
                      ssgVersions,
                    ]}
                    // TODO replace with dedicatedAction in options
                    remediationsEnabled
                    // TODO replace with tableProps
                    isFullView
                  />
                </Tab>

                <Tab
                  key={'never-reported'}
                  eventKey={'never-reported'}
                  ouiaId="Never reported"
                  title={
                    <TabTitleWithData
                      text="Never reported"
                      data={
                        report?.assigned_system_count -
                        report?.reported_system_count
                      }
                      isLoading={loading}
                    />
                  }
                >
                  <SystemsTable
                    apiEndpoint="reportSystems"
                    reportId={report_id}
                    defaultFilter={{ never_reported: true }}
                    columns={({ name, tags, workspaces, lastScanned }) => [
                      {
                        ...name,
                        // TODO this should be a tabletools feature
                        componentProps: { showLink: true, showOsInfo: true },
                      },
                      workspaces,
                      tags,
                      lastScanned,
                    ]}
                    filters={({ groups }) => [groups]}
                    // TODO what does this even do?
                    isFullView
                  />
                </Tab>
              </Tabs>
            </GridItem>
          </Grid>
        </section>
      </StateViewPart>
    </StateViewWithError>
  );
};

ReportDetails.propTypes = {
  route: propTypes.shape({
    title: propTypes.string.isRequired,
    defaultTitle: propTypes.string.isRequired,
  }).isRequired,
};

export default ReportDetails;
