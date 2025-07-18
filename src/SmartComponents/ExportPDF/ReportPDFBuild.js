import PropTypes from 'prop-types';
import React from 'react';
import {
  t_global_background_color_200,
  t_color_red_50,
  t_global_spacer_lg,
  t_global_spacer_md,
  t_global_spacer_sm,
  t_global_spacer_xs,
  t_global_spacer_xl,
  t_global_font_size_sm,
  t_global_font_size_md,
  t_global_font_size_heading_lg,
  t_global_font_size_heading_xl,
  t_global_font_size_heading_md,
} from '@patternfly/react-tokens';
import { API_BASE_URL } from '@/constants';
import PolicyDetailsSection from './PolicyDetailsSection';
import TopFailedRulesSection from './TopFailedRulesSection';
import SystemsTableSection from './SystemsTableSection';
import {
  fetchPaginatedList,
  fetchUnsupportedSystemsWithExpectedSSG,
} from './helpers';

const rowBase = {
  fontSize: t_global_font_size_sm.value,
  paddingLeft: t_global_spacer_xs.value,
  paddingRight: t_global_spacer_sm.value,
  paddingTop: t_global_spacer_sm.value,
  paddingBottom: t_global_spacer_sm.value,
  verticalAlign: 'top',
};
const headerBase = {
  fontSize: t_global_font_size_sm.value,
  paddingLeft: t_global_spacer_xs.value,
  paddingRight: t_global_spacer_sm.value,
  paddingTop: t_global_spacer_sm.value,
  paddingBottom: t_global_spacer_sm.value,
};

export const styles = {
  document: {
    paddingTop: t_global_spacer_lg.value,
    paddingLeft: t_global_spacer_xl.value,
    paddingRight: t_global_spacer_xl.value,
  },
  insightsHeader: {
    fontSize: t_global_font_size_heading_lg.value,
    color: t_color_red_50.value,
  },
  policyTitleHeader: {
    fontSize: t_global_font_size_heading_xl.value,
    color: t_color_red_50.value,
    fontWeight: 'bold',
  },
  userNotes: {
    fontSize: t_global_font_size_sm.value,
    padding: t_global_spacer_sm.value,
    paddingBottom: t_global_spacer_md.value,
  },
  header: headerBase,
  noWrapHeader: {
    ...headerBase,
    textWrap: 'nowrap',
  },
  row: rowBase,
  noWrapRow: {
    ...rowBase,
    textWrap: 'nowrap',
  },
  sectionHeader: {
    color: t_color_red_50.value,
    fontSize: t_global_font_size_heading_md.value,
    marginBottom: t_global_spacer_md.value,
  },
  descriptionListTerm: {
    fontSize: t_global_font_size_md.value,
    marginTop: t_global_spacer_xs.value,
    marginBottom: t_global_spacer_sm.value,
    fontWeight: 'bold',
  },
};

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
      <span style={styles.insightsHeader}>Red Hat Insights</span>
      <br />
      <span style={styles.policyTitleHeader}>
        {`Compliance: ${reportData.title}`}
      </span>
      {options.exportSettings.userNotes && (
        <>
          <br />
          <br />
          <div style={{ backgroundColor: t_global_background_color_200.value }}>
            <div style={styles.userNotes}>
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
      <PolicyDetailsSection reportData={reportData} styles={styles} />
      {options.exportSettings.nonCompliantSystems &&
        nonCompliantSystems.length > 0 && (
          <>
            <br />
            <br />
            <SystemsTableSection
              sectionTitle={'Non-compliant systems'}
              systemsData={nonCompliantSystems}
              styles={styles}
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
              styles={styles}
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
              styles={styles}
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
              styles={styles}
            />
          </>
        )}
      {options.exportSettings.topTenFailedRules &&
        topFailedRules.length > 0 && (
          <>
            <br />
            <br />
            <TopFailedRulesSection rulesData={topFailedRules} styles={styles} />
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
