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
