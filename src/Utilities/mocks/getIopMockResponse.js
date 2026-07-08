import {
  compileTotalResult,
  defaultCompileResult,
  TOTAL_REQUEST_PARAMS,
} from '../hooks/useTableToolsQuery/helpers';
import {
  findIopMockPolicy,
  findIopMockReport,
  findIopMockSystem,
  iopMockPolicies,
  iopMockPolicySystemsOs,
  iopMockReports,
  iopMockReportsOs,
  iopMockRuleGroups,
  iopMockRules,
  iopMockRuleTree,
  iopMockSecurityGuides,
  iopMockSupportedProfiles,
  iopMockSystems,
  iopMockSystemsOs,
  iopMockTailorings,
  iopMockTestResults,
  iopMockValueDefinitions,
  IOP_MOCK_NEW_POLICY_ID,
  IOP_MOCK_REPORT_ID,
} from './iopMockData';
import { buildSecurityGuide } from '@/__factories__/securityGuides';

const MUTATION_ENDPOINTS = new Set([
  'createPolicy',
  'updatePolicy',
  'assignRules',
  'assignSystems',
  'createTailoring',
  'updateTailoring',
]);

const paginate = (items, params = {}) => {
  const offset = params.offset || 0;
  const limit =
    params.limit ??
    (params.idsOnly || params.onlyTotal ? items.length : items.length);

  if (params.idsOnly) {
    return items.slice(offset, offset + limit).map(({ id }) => ({ id }));
  }

  return items.slice(offset, offset + limit);
};

const listPayload = (items, params = {}) => ({
  data: paginate(items, params),
  meta: { total: items.length, ...params },
});

const compileMockResult = (rawResult, params, { onlyTotal } = {}) => {
  const compileResult = onlyTotal ? compileTotalResult : defaultCompileResult;
  return compileResult(rawResult, params);
};

const getRawListForEndpoint = (endpoint, params = {}) => {
  switch (endpoint) {
    case 'policies':
      return listPayload(iopMockPolicies, params);
    case 'reports':
      return listPayload(iopMockReports, params);
    case 'reportsOS':
    case 'reportSystemsOS':
    case 'reportTestResultsOS':
    case 'systemsOS':
    case 'securityGuidesOS':
    case 'policySystemsOS':
      return listPayload(
        endpoint === 'policySystemsOS'
          ? iopMockPolicySystemsOs
          : endpoint === 'reportsOS'
            ? iopMockReportsOs
            : iopMockSystemsOs,
        params,
      );
    case 'systems':
      return listPayload(iopMockSystems, params);
    case 'supportedProfiles':
      return listPayload(iopMockSupportedProfiles, params);
    case 'securityGuides':
      return listPayload(iopMockSecurityGuides, params);
    case 'tailorings':
      return listPayload(iopMockTailorings, params);
    case 'tailoringRules':
    case 'profileRules':
    case 'rules':
      return listPayload(iopMockRules, params);
    case 'ruleGroups':
      return listPayload(iopMockRuleGroups, params);
    case 'valueDefinitions':
      return listPayload(iopMockValueDefinitions, params);
    case 'reportRuleResults':
    case 'reportTestResults':
    case 'reportTestResultsSG':
      return listPayload(iopMockTestResults, params);
    case 'systemReports':
      return listPayload(iopMockReports, params);
    case 'reportSystems':
      return listPayload(iopMockSystems, params);
    case 'policySystems':
      return listPayload(iopMockSystems, params);
    case 'policySystemsOS':
      return listPayload(iopMockPolicySystemsOs, params);
    case 'profiles':
      return listPayload(iopMockSupportedProfiles, params);
    default:
      return listPayload([], params);
  }
};

const getRawSingleForEndpoint = (endpoint, params = {}) => {
  switch (endpoint) {
    case 'policy':
      return { data: findIopMockPolicy(params.policyId), meta: params };
    case 'report':
      return {
        data: findIopMockReport(params.reportId || IOP_MOCK_REPORT_ID),
        meta: params,
      };
    case 'system':
      return { data: findIopMockSystem(params.systemId), meta: params };
    case 'securityGuide':
      return {
        data: buildSecurityGuide({
          id: params.securityGuideId,
          os_major_version: iopMockPolicies[0].os_major_version,
        }),
        meta: params,
      };
    case 'profile':
      return {
        data: iopMockSupportedProfiles[0],
        meta: params,
      };
    case 'tailoringRuleTree':
    case 'securityGuideRuleTree':
    case 'profileTree':
      return { data: iopMockRuleTree, meta: params };
    case 'createPolicy':
      return {
        data: {
          ...findIopMockPolicy(IOP_MOCK_NEW_POLICY_ID),
          id: IOP_MOCK_NEW_POLICY_ID,
          title: params.policy?.title || 'IoP mock policy',
          description: params.policy?.description,
          business_objective: params.policy?.business_objective,
          compliance_threshold: params.policy?.compliance_threshold,
        },
        meta: params,
      };
    case 'createTailoring':
      return {
        data: {
          ...iopMockTailorings[0],
          os_minor_version:
            params.tailoringCreate?.os_minor_version ??
            iopMockTailorings[0].os_minor_version,
        },
        meta: params,
      };
    default:
      if (MUTATION_ENDPOINTS.has(endpoint)) {
        return { data: {}, meta: params };
      }
      return { data: null, meta: params };
  }
};

const isListEndpoint = (endpoint) =>
  ![
    'policy',
    'report',
    'system',
    'securityGuide',
    'profile',
    'tailoringRuleTree',
    'securityGuideRuleTree',
    'profileTree',
    ...MUTATION_ENDPOINTS,
  ].includes(endpoint);

/**
 * Returns the same shape as fetchResult + compileResult for a Compliance endpoint.
 */
export function getIopMockResponse(endpoint, params = {}, options = {}) {
  const { onlyTotal } = options;
  const requestParams = {
    ...params,
    ...(onlyTotal ? TOTAL_REQUEST_PARAMS : {}),
  };

  const rawResult = isListEndpoint(endpoint)
    ? getRawListForEndpoint(endpoint, requestParams)
    : getRawSingleForEndpoint(endpoint, requestParams);

  return compileMockResult(rawResult, requestParams, { onlyTotal });
}
