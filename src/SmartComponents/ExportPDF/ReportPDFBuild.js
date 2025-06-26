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

export const fetchData = async (createAsyncRequest, options) => {
  const requests = [];
  // Report details
  const reportPromise = createAsyncRequest('compliance-backend', {
    method: 'GET',
    url: `${API_BASE_URL}/reports/${options.reportId}`,
  });
  requests.push(reportPromise);

  // Top 10 failed rules
  if (options.exportSettings.topTenFailedRules) {
    const topTenFailedRulesPromise = createAsyncRequest('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${options.reportId}/stats`,
    });
    requests.push(topTenFailedRulesPromise);
  } else {
    requests.push(Promise.resolve({ top_failed_rules: [] }));
  }

  // Compliant systems
  if (options.exportSettings.compliantSystems) {
    const compliantSystemsPromise = createAsyncRequest('compliance-backend', {
      method: 'GET',
      url: `${API_BASE_URL}/reports/${options.reportId}/test_results`,
      params: {
        limit: 50,
        filter: 'compliant = true and supported = true',
      },
    });
    requests.push(compliantSystemsPromise);
  } else {
    requests.push(Promise.resolve({ compliantSystemsPromise: [] }));
  }

  // nonCompliantSystems
  if (options.exportSettings.nonCompliantSystems) {
    const nonCompliantSystemsPromise = createAsyncRequest(
      'compliance-backend',
      {
        method: 'GET',
        url: `${API_BASE_URL}/reports/${options.reportId}/test_results`,
        params: {
          limit: 50,
          filter: 'compliant = false and supported = true',
        },
      },
    );
    requests.push(nonCompliantSystemsPromise);
  } else {
    requests.push(Promise.resolve({ nonCompliantSystemsPromise: [] }));
  }

  // nonReportingSystems
  // if (options.exportSettings.nonReportingSystems) {
  //   const nonReportingSystemsPromise = createAsyncRequest(
  //     'compliance-backend',
  //     {
  //       method: 'GET',
  //       url: `${API_BASE_URL}/reports/${options.reportId}/systems`,
  //       params: {
  //         limit: 10,
  //         filter: 'never_reported = true',
  //       },
  //     },
  //   );
  //   requests.push(nonReportingSystemsPromise);
  // } else {
  //   requests.push(Promise.resolve({ nonReportingSystemsPromise: [] }));
  // }

  if (options.exportSettings.nonReportingSystems) {
    const nonReportingSystemsPaginatedPromise = (async () => {
      const batchSize = 10;
      const filter = 'never_reported = true';
      let allNonReportingSystemsItems = [];

      const fetchNonReportingSystemsPage = async (limit, offset) => {
        const response = await createAsyncRequest('compliance-backend', {
          method: 'GET',
          url: `${API_BASE_URL}/reports/${options.reportId}/systems`,
          params: {
            limit: limit,
            offset: offset,
            filter: filter,
          },
        });
        return response;
      };

      try {
        // initial request
        const initialResponse = await fetchNonReportingSystemsPage(
          batchSize,
          0,
        );

        const firstPageItems = initialResponse.data || [];
        allNonReportingSystemsItems.push(...firstPageItems);

        const totalNonReportingSystems = initialResponse.meta?.total || 0;

        // If no more pages, return results
        if (totalNonReportingSystems <= batchSize) {
          return { non_reporting_systems: allNonReportingSystemsItems };
        }

        const totalPages = Math.ceil(totalNonReportingSystems / batchSize);
        const pagePromises = [];

        // Loop to generate promises for next pages
        for (let pageIdx = 1; pageIdx < totalPages; pageIdx++) {
          pagePromises.push(
            fetchNonReportingSystemsPage(
              batchSize,
              pageIdx * batchSize, // Calculate the offset
            ),
          );
        }

        const batchedResults = await Promise.all(pagePromises);

        const remainingPagesItems = batchedResults.flatMap(
          (response) => response.data,
        );

        allNonReportingSystemsItems.push(...remainingPagesItems);

        // Resolve the promise with the complete list of all non-reporting systems
        return { nonReportingSystems: allNonReportingSystemsItems };
      } catch (error) {
        return { nonReportingSystems: [] };
      }
    })();

    requests.push(nonReportingSystemsPaginatedPromise);
  } else {
    requests.push(Promise.resolve({ nonReportingSystems: [] }));
  }

  // unsupportedSystems

  // const unsupportedSystems = createAsyncRequest('compliance-backend', {
  //   method: 'GET',
  //   url: `${API_BASE_URL}/reports/${options.reportId}/stats`,
  // });

  const data = await Promise.all(requests);
  return { data: data, options };
};

const ReportPDFBuild = ({ asyncData }) => {
  const { data, options } = asyncData.data;
  const reportData = data[0].data;
  const topFailedRules = data[1].top_failed_rules;
  const compliantSystems = data[2].data;
  const nonCompliantSystems = data[3].data;
  const nonReportingSystems = data[4].nonReportingSystems;

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
