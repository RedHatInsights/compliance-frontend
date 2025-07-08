import { StyleSheet } from '@react-pdf/renderer';

import PropTypes from 'prop-types';
import React from 'react';
import {
  chart_global_Fill_Color_200,
  t_color_red_70,
  t_global_spacer_lg,
  t_global_spacer_md,
  t_global_spacer_sm,
  t_global_spacer_xl,
  chart_global_FontSize_sm,
  chart_global_FontSize_2xl,
  chart_global_FontSize_lg,
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
    paddingTop: t_global_spacer_lg.value,
    paddingLeft: t_global_spacer_xl.value,
    paddingRight: t_global_spacer_xl.value,
  },
});

export const fetchData = async (createAsyncRequest, options) => {
  const requests = [];
  const { reportId } = options;
  let osMajorVersion = null;
  let refId = null;

  // Report details
  const rawReportResponse = await createAsyncRequest('compliance', {
    method: 'GET',
    url: `${API_BASE_URL}/reports/${reportId}`,
  });

  osMajorVersion = rawReportResponse.data.os_major_version;
  refId = rawReportResponse.data.ref_id;

  requests.push(Promise.resolve({ report_details: rawReportResponse.data }));

  // Top 10 failed rules
  if (options.exportSettings.topTenFailedRules) {
    try {
      const response = await createAsyncRequest('compliance', {
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
          fontSize: chart_global_FontSize_2xl.value,
          color: t_color_red_70.value,
        }}
      >
        Red Hat Insights
      </span>
      <br />
      <span
        style={{
          fontSize: chart_global_FontSize_lg.value,
          color: t_color_red_70.value,
          fontWeight: 'bold',
        }}
      >
        {`Compliance: ${reportData.title}`}
      </span>
      {options.exportSettings.userNotes && (
        <>
          <br />
          <br />
          <div style={{ backgroundColor: chart_global_Fill_Color_200.value }}>
            <div
              style={{
                fontSize: chart_global_FontSize_sm.value,
                padding: t_global_spacer_sm.value,
                paddingBottom: t_global_spacer_md.value,
              }}
            >
              <div>User notes:</div>
              <div style={{ marginTop: t_global_spacer_sm.value }}>
                {options.exportSettings.userNotes}
              </div>
            </div>
          </div>
        </>
      )}
      <br />
      <br />
      <PolicyDetailsSection reportData={reportData} />
      {options.exportSettings.nonCompliantSystems &&
        nonCompliantSystems.length > 0 && (
          <>
            <br />
            <br />
            <SystemsTableSection
              sectionTitle={'Non-compliant systems'}
              systemsData={nonCompliantSystems}
            />
          </>
        )}
      {options.exportSettings.unsupportedSystems &&
        unsupportedSystems.length > 0 && (
          <>
            <br />
            <br />
            <SystemsTableSection
              sectionTitle={'Systems with unsupported configuration'}
              systemsData={unsupportedSystems}
            />
          </>
        )}
      {options.exportSettings.nonReportingSystems &&
        nonReportingSystems.length > 0 && (
          <>
            <br />
            <br />
            <SystemsTableSection
              sectionTitle={'Systems never reported'}
              systemsData={nonReportingSystems}
            />
          </>
        )}
      {options.exportSettings.compliantSystems &&
        compliantSystems.length > 0 && (
          <>
            <br />
            <br />
            <SystemsTableSection
              sectionTitle={'Compliant systems'}
              systemsData={compliantSystems}
            />
          </>
        )}
      {options.exportSettings.topTenFailedRules &&
        topFailedRules.length > 0 && (
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
