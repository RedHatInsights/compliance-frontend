import { StyleSheet } from '@react-pdf/renderer';

import PropTypes from 'prop-types';
import React from 'react';
import chart_color_red_100 from '@patternfly/react-tokens/dist/js/chart_color_red_100';
import { API_BASE_URL } from '@/constants';
import PolicyDetailsSection from './PolicyDetailsSection';
import TopFailedRulesSection from './TopFailedRulesSection';
import SystemsTableSection from './SystemsTableSection';
import { TextArea } from '@patternfly/react-core';

const styles = StyleSheet.create({
  document: {
    paddingTop: '24px',
    paddingLeft: '32px',
    paddingRight: '32px',
  },
});

const fetchPaginatedList = async (
  createAsyncRequest,
  reportId,
  endpointPath,
  filter,
  outputKey,
  batchSize,
) => {
  let allItems = [];

  const fetchPage = async (limit, offset) => {
    const response = await createAsyncRequest('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}${endpointPath}`,
      params: { limit, offset, filter },
    });
    return response;
  };

  try {
    const initialResponse = await fetchPage(batchSize, 0);

    const firstPageItems = initialResponse.data || [];
    allItems.push(...firstPageItems);

    const totalItems = initialResponse.meta.total || 0;

    if (totalItems <= batchSize) {
      return { [outputKey]: allItems };
    }

    const totalPages = Math.ceil(totalItems / batchSize);
    const pagePromises = [];

    for (let pageIdx = 1; pageIdx < totalPages; pageIdx++) {
      pagePromises.push(fetchPage(batchSize, pageIdx * batchSize));
    }

    const batchedResults = await Promise.all(pagePromises);
    const remainingItems = batchedResults.flatMap(
      (response) => response.data || [],
    );

    allItems.push(...remainingItems);

    return { [outputKey]: allItems };
  } catch ({}) {
    return { [outputKey]: [] };
  }
};

export const fetchData = async (createAsyncRequest, options) => {
  const requests = [];
  const reportId = options.reportId;
  // Report details
  const reportPromise = createAsyncRequest('compliance-backend', {
    method: 'GET',
    url: `${API_BASE_URL}/reports/${reportId}`,
  });
  requests.push(reportPromise);

  // Top 10 failed rules
  if (options.exportSettings.topTenFailedRules) {
    const topTenFailedRulesPromise = createAsyncRequest('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${reportId}/stats`,
    });
    requests.push(topTenFailedRulesPromise);
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
      fetchPaginatedList(
        createAsyncRequest,
        reportId,
        '/test_results',
        'supported = false',
        'unsupported_systems',
        50,
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
  const reportData = data[0].data;
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
