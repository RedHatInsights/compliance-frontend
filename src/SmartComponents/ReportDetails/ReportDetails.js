/* eslint-disable react/display-name */
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
import {
  fetchNeverReportedCustomOSes,
  fetchReportingCustomOSes,
} from './constants';
import '@/Charts.scss';
import './ReportDetails.scss';
import useFetchReporting from 'SmartComponents/ReportDetails/Components/hooks/useFetchReporting';
import useFetchNeverReported from 'SmartComponents/ReportDetails/Components/hooks/useFetchNeverReported';
import TabTitleWithData from 'SmartComponents/ReportDetails/Components/TabTitleWithData';

const ReportDetails = ({ route }) => {
  const { report_id } = useParams();
  const { data: { data } = {}, error, loading } = useReport(report_id);
  const { data: ssgVersions = [] } = useReportTestResultsSG(report_id);
  let reportData = {};
  let reportTitle;
  let pageTitle;

  if (!loading && data) {
    reportData = data;
    reportTitle = reportData.title;
    pageTitle = `Report: ${reportTitle}`;
  }

  useTitleEntity(route, reportTitle);

  const [tab, setTab] = useState('reporting');

  const handleTabSelect = (_, eventKey) => setTab(eventKey);

  const {
    isLoading: isLoadingReporting,
    fetch: fetchReporting,
    data: dataReporting,
  } = useFetchReporting(report_id);

  const {
    isLoading: isLoadingNeverReported,
    fetch: fetchNeverReported,
    data: dataNeverReported,
  } = useFetchNeverReported(report_id);

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
              <SubPageTitle>{reportData.profile_title}</SubPageTitle>
            </GridItem>
            <GridItem
              className="report-details-button"
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <Link
                state={{ reportData }}
                to={`/reports/${reportData.id}/pdf`}
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
                state={{ reportData }}
                to={`/reports/${reportData.id}/delete`}
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
                report={reportData}
                hasLegend={true}
                chartClass="report-details-chart-container"
              />
            </GridItem>
            <GridItem sm={12} md={12} lg={12} xl={6}>
              <ReportDetailsDescription report={reportData} />
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
                    showOsMinorVersionFilter={[reportData.os_major_version]}
                    ignoreOsMajorVersion
                    ssgVersions={ssgVersions}
                    compliantFilter
                    ruleSeverityFilter
                    showGroupsFilter
                    apiV2Enabled={true}
                    reportId={report_id}
                    fetchCustomOSes={fetchReportingCustomOSes}
                  />
                </Tab>

                <Tab
                  key={'never-reported'}
                  eventKey={'never-reported'}
                  ouiaId="Never reported"
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
                      Columns.customName(
                        {
                          showLink: true,
                          showOsInfo: true,
                        },
                        {
                          sortBy: ['display_name'],
                        }
                      ),
                      Columns.inventoryColumn('groups', {
                        requiresDefault: true,
                        sortBy: ['groups'],
                      }),
                      Columns.inventoryColumn('tags'),
                      Columns.LastScanned,
                    ]}
                    defaultFilter={'never_reported = true'}
                    ignoreOsMajorVersion
                    showGroupsFilter
                    apiV2Enabled={true}
                    reportId={report_id}
                    fetchCustomOSes={fetchNeverReportedCustomOSes}
                    enableExport={false}
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
