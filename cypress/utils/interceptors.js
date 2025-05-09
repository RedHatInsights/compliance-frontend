export const interceptBatchRequest = (endpoint, offset, dataSlice, total, limit=10) => {
  cy.intercept(new RegExp(`/api/compliance/v2/${endpoint}?.*limit=${limit}.*offset=${offset}.*`), {
    statusCode: 200,
    body: {
      data: dataSlice,
      meta: {
        limit,
        offset,
        total,
      }
    }
  }).as(`${endpoint}Batch${offset / limit + 1}`); // getReportsBatch1, getReportsBatch2, etc
};

export const interceptRulesByGroupRequest = (groupId, endpoint, dataSlice, total, offset=0, limit=50) => {
  cy.intercept(
    `/api/compliance/v2/${endpoint}/rules?limit=${limit}&offset=${offset}&sort_by=title%3Aasc&filter=*`,
    {
      statusCode: 200,
      body: {
        data: dataSlice,
        meta: {
          limit,
          offset,
          total,
        }
    }
  }).as(`getRulesByGroupId-${groupId}`);
}

export const interceptPolicyTailorings = (policyId, tailoringsData, total, offset=0, limit=10) => {
  cy.intercept(
    `/api/compliance/v2/policies/${policyId}/tailorings*`,
    {
      statusCode: 200,
      body: {
        data: tailoringsData,
        meta: {
          limit,
          offset,
          total: total || tailoringsData.length,
        }
    }
  }).as('getTailorings');
}

export const interceptSecurityGuide = (securityGuideId, securityGuideData) => {
  cy.intercept(
    `/api/compliance/v2/security_guides/${securityGuideId}`,
    {
      statusCode: 200,
      body: {
        data: securityGuideData
    }
  }).as('getSecurityGuide');
}

export const interceptTailoringTree = (policyId, tailoringId, treeData) => {
  cy.intercept(
    `/api/compliance/v2/policies/${policyId}/tailorings/${tailoringId}/rule_tree`,
    {
      statusCode: 200,
      body: [treeData]
    }
  ).as('getRuleTree');
}

export const interceptSecurityGuideTree = (securityGuideId, treeData) => {
  cy.intercept(
    `/api/compliance/v2/security_guides/${securityGuideId}/rule_tree`,
    {
      statusCode: 200,
      body: [treeData]
    }
  ).as('getSecurityGuideRuleTree');
}

export const interceptSSGValueDefinitions = (securityGuideId, valueDefinitionsData, total, offset=0, limit=50) => {
  cy.intercept(
    `/api/compliance/v2/security_guides/${securityGuideId}/value_definitions*`,
    {
      statusCode: 200,
      body: {
        data: valueDefinitionsData,
        meta: {
          limit,
          offset,
          total: total || valueDefinitionsData.length,
        }
    }
  }).as('getValueDefinitions');
}

export const interceptSupportedProfiles = (supportedProfiles, total, offset=0, limit=10) => {
  cy.intercept(
    '/api/compliance/v2/security_guides/supported_profiles*',
    {
      statusCode: 200,
      body: {
        data: supportedProfiles,
        meta: {
          limit,
          offset,
          total: total || supportedProfiles.length,
        }
    }
  }).as('getSupportedProfiles');
}

export const interceptRuleGroups = (securityGuideId, ruleGroupsData, total, offset=0, limit=50) => {
  cy.intercept(
    `/api/compliance/v2/security_guides/${securityGuideId}/rule_groups*`,
    {
      statusCode: 200,
      body: {
        data: ruleGroupsData,
        meta: {
          limit,
          offset,
          total: total || ruleGroupsData.length,
        }
    }
  }).as('getRuleGroups');
}

export const interceptTailoringRules = (policyId, tailoringId, rulesData, total, offset=0, limit=10, searchParams = "") => {
  cy.intercept(
    `/api/compliance/v2/policies/${policyId}/tailorings/${tailoringId}/rules*${searchParams}`,
    {
      statusCode: 200,
      body: {
        data: rulesData,
        meta: {
          limit,
          offset,
          total: total || rulesData.length,
        }
    }
  }).as('getTailoringRules');
}

export const interceptProfileRules = (securityGuideId, profileId, rulesData, total, offset=0, limit=10) => {
  cy.intercept(
    `/api/compliance/v2/security_guides/${securityGuideId}/profiles/${profileId}/rules*`,
    {
      statusCode: 200,
      body: {
        data: rulesData,
        meta: {
          limit,
          offset,
          total: total || rulesData.length,
        }
    }
  }).as('getProfileRules');
}
