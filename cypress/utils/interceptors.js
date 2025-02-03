export const featureFlagsInterceptors = {
  apiV2Enabled: () => {
    cy.intercept('GET', '/feature_flags*', {
      statusCode: 200,
      body: {
        toggles: [
          {
            name: 'compliance-api-v2',
            enabled: true,
          },
        ],
      },
    });
  },

  apiV2Disabled: () => {
    cy.intercept('GET', '/feature_flags*', {
      statusCode: 200,
      body: {
        toggles: [
          {
            name: 'compliance-api-v2',
            enabled: false,
          },
        ],
      },
    });
  },
};

export const interceptReportsBatch = (endpoint, offset, dataSlice, total, limit=10) => {
  cy.intercept(new RegExp(`/api/compliance/v2/${endpoint}?.*limit=${limit}.*offset=${offset}.*`), {
    statusCode: 200,
    body: {
      data: dataSlice,
      meta: {
        limit: 10,
        offset,
        total: total,
      }
    }
  }).as(`getReportsBatch${offset / 10 + 1}`); // getReportsBatch1, getReportsBatch2, etc
};
