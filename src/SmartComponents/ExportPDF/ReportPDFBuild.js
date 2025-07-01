import { StyleSheet } from '@react-pdf/renderer';

import PropTypes from 'prop-types';
import React from 'react';
import {
  global_BackgroundColor_200,
  global_LineHeight_sm,
  global_palette_red_100,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
  global_spacer_xl,
  global_FontSize_md,
  global_FontSize_2xl,
  global_FontSize_3xl,
} from '@patternfly/react-tokens';
import { API_BASE_URL } from '@/constants';
import PolicyDetailsSection from './PolicyDetailsSection';
import TopFailedRulesSection from './TopFailedRulesSection';
import SystemsTableSection from './SystemsTableSection';
import {
  fetchPaginatedList,
  fetchUnsupportedSystemsWithExpectedSSG,
} from './helpers';

const styles = StyleSheet.create({
  document: {
    paddingTop: global_spacer_lg.value,
    paddingLeft: global_spacer_xl.value,
    paddingRight: global_spacer_xl.value,
  },
});

export const fetchData = async (createAsyncRequest, options) => {
  const requests = [];
  const reportId = options.reportId;
  let osMajorVersion = null;
  let refId = null;

  // Report details
  const rawReportResponse = await createAsyncRequest('compliance-backend', {
    method: 'GET',
    url: `${API_BASE_URL}/reports/${reportId}`,
  });

  osMajorVersion = rawReportResponse.data.os_major_version;
  refId = rawReportResponse.data.ref_id;

  requests.push(Promise.resolve({ report_details: rawReportResponse.data }));


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
        50,
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
      <span
        style={{
          fontSize: global_FontSize_2xl.value,
          color: global_palette_red_100.value,
        }}
      >
        Red Hat Insights
      </span>
      <br />
      <span
        style={{
          fontSize: global_FontSize_3xl.value,
          color: global_palette_red_100.value,
          fontWeight: 'bold',
          lineHeight: global_LineHeight_sm.value,
        }}
      >
        {`Compliance: ${reportData.title}`}
      </span>
      {options.exportSettings.userNotes && (
        <>
          <br />
          <br />
          <div style={{ backgroundColor: global_BackgroundColor_200.value }}>
            <div
              style={{
                fontSize: global_FontSize_md.value,
                padding: global_spacer_sm.value,
                paddingBottom: global_spacer_md.value,
              }}
            >
              <div>User notes:</div>
              <div style={{ marginTop: global_spacer_sm.value }}>
                {options.exportSettings.userNotes}
              </div>
            </div>
          </div>
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
