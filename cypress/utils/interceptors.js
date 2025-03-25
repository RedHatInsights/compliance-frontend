export const interceptBatchRequest = (endpoint, offset, dataSlice, total, limit=10) => {
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
  }).as(`${endpoint}Batch${offset / limit + 1}`); // getReportsBatch1, getReportsBatch2, etc
};
