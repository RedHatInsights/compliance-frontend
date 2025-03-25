export const interceptBatchRequest = (endpoint, offset, dataSlice, total, limit=10) => {
  cy.intercept(new RegExp(`/api/compliance/v2/${endpoint}?.*limit=${limit}.*offset=${offset}.*`), {
    statusCode: 200,
    body: {
      data: dataSlice,
      meta: {
        limit: limit,
        offset,
        total: total,
      }
    }
  }).as(`${endpoint}Batch${offset / limit + 1}`); // getReportsBatch1, getReportsBatch2, etc
};

export const interceptRulesByGroupRequest = (groupId, endpoint, dataSlice, total, offset=0, limit=50) => {
  cy.intercept(
    `/api/compliance/v2/${endpoint}/rules?limit=${limit}&offset=${offset}&sort_by=title%3Aasc&filter=rule_group_id*`,
    {
      statusCode: 200,
      body: {
        data: dataSlice,
        meta: {
          limit: limit,
          offset,
          total: total,
        }
    }
  }).as(`getRulesByGroupId-${groupId}`);
}
