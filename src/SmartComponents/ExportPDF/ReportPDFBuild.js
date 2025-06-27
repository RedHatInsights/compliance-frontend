import { StyleSheet } from '@react-pdf/renderer';

import PropTypes from 'prop-types';
import React from 'react';
import chart_color_red_100 from '@patternfly/react-tokens/dist/js/chart_color_red_100';
import { API_BASE_URL } from '@/constants';
import PolicyDetailsSection from './PolicyDetailsSection';
import TopFailedRulesSection from './TopFailedRulesSection';
import SystemsTableSection from './SystemsTableSection';
import { TextArea } from '@patternfly/react-core';
import {
  fetchPaginatedList,
  fetchUnsupportedSystemsWithExpectedSSG,
} from './helpers';

const styles = StyleSheet.create({
  document: {
    paddingTop: '24px',
    paddingLeft: '32px',
    paddingRight: '32px',
  },
});

export const fetchData = async (createAsyncRequest, options) => {
  const requests = [];
  const reportId = options.reportId;
  let osMajorVersion = null;
  let refId = null;

  // Report details
  try {
    const rawReportResponse = await createAsyncRequest('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}`,
    });

    osMajorVersion = rawReportResponse.data.os_major_version;
    refId = rawReportResponse.data.ref_id;

    requests.push(Promise.resolve({ report_details: rawReportResponse.data }));
  } catch ({}) {
    requests.push(Promise.resolve({ report_details: {} }));
  }

  // Top 10 failed rules
  if (options.exportSettings.topTenFailedRules) {
    try {
      const response = await createAsyncRequest('compliance-backend', {
        method: 'GET',
        url: `${API_BASE_URL}/reports/${reportId}/stats`,
      });
      const topFailedRulesData = response.top_failed_rules;
      requests.push(Promise.resolve({ top_failed_rules: topFailedRulesData }));
    } catch ({}) {
      requests.push(Promise.resolve({ top_failed_rules: [] }));
    }
  } else {
    requests.push(Promise.resolve({ top_failed_rules: [] }));
  }

  // Compliant systems
  if (options.exportSettings.compliantSystems) {
    requests.push(
      fetchPaginatedList(
        createAsyncRequest,
        reportId,
        '/test_results',
        'compliant = true and supported = true',
        'compliant_systems',
        50,
      ),
    );
  } else {
    requests.push(Promise.resolve({ compliant_systems: [] }));
  }

  // nonCompliantSystems
  if (options.exportSettings.nonCompliantSystems) {
    requests.push(
      fetchPaginatedList(
        createAsyncRequest,
        reportId,
        '/test_results',
        'compliant = false and supported = true',
        'non_compliant_systems',
        50,
      ),
    );
  } else {
    requests.push(Promise.resolve({ non_compliant_systems: [] }));
  }

  // nonReportingSystems
  if (options.exportSettings.nonReportingSystems) {
    requests.push(
      fetchPaginatedList(
        createAsyncRequest,
        reportId,
        '/systems',
        'never_reported = true',
        'non_reporting_systems',
        10,
      ),
    );
  } else {
    requests.push(Promise.resolve({ non_reporting_systems: [] }));
  }

  // unsupportedSystems
  if (options.exportSettings.unsupportedSystems) {
    requests.push(
      fetchUnsupportedSystemsWithExpectedSSG(
        createAsyncRequest,
        reportId,
        osMajorVersion,
        refId,
      ),
    );
  } else {
    requests.push(Promise.resolve({ unsupported_systems: [] }));
  }

  const data = await Promise.all(requests);
  return { data: data, options };
};

const ReportPDFBuild = ({ asyncData }) => {
  const { data, options } = asyncData.data;
  const reportData = data[0].report_details;
  const topFailedRules = data[1].top_failed_rules;
  const compliantSystems = data[2].compliant_systems;
  const nonCompliantSystems = data[3].non_compliant_systems;
  const nonReportingSystems = data[4].non_reporting_systems;
  const unsupportedSystems = data[5].unsupported_systems;

  return (
    <div style={styles.document}>
      <span style={{ fontSize: '24px', color: chart_color_red_100.value }}>
        Red Hat Insights
      </span>
      <br />
      <span style={{ fontSize: '32px', color: chart_color_red_100.value }}>
        {`Compliance: ${reportData.title}`}
      </span>
      {options.exportSettings.userNotes && (
        <>
          <br />
          <br />
          <TextArea value={options.exportSettings.userNotes} />
        </>
      )}
      <br />
      <br />
      <PolicyDetailsSection reportData={reportData} />
      {options.exportSettings.nonCompliantSystems && (
        <>
          <br />
          <br />
          <SystemsTableSection
            sectionTitle={'Non-compliant systems'}
            systemsData={nonCompliantSystems}
          />
        </>
      )}
      {options.exportSettings.unsupportedSystems && (
        <>
          <br />
          <br />
          <SystemsTableSection
            sectionTitle={'Systems with unsupported configuration'}
            systemsData={unsupportedSystems}
          />
        </>
      )}
      {options.exportSettings.nonReportingSystems && (
        <>
          <br />
          <br />
          <SystemsTableSection
            sectionTitle={'Systems never reported'}
            systemsData={nonReportingSystems}
          />
        </>
      )}
      {options.exportSettings.compliantSystems && (
        <>
          <br />
          <br />
          <SystemsTableSection
            sectionTitle={'Compliant systems'}
            systemsData={compliantSystems}
          />
        </>
      )}
      {options.exportSettings.topTenFailedRules && (
        <>
          <br />
          <br />
          <TopFailedRulesSection rulesData={topFailedRules} />
        </>
      )}
      <br />
    </div>
  );
};

ReportPDFBuild.propTypes = {
  asyncData: PropTypes.object,
};

export default ReportPDFBuild;
