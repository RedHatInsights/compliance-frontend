import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import systems from '@redhat-cloud-services/compliance-client/dist/Systems';
import policies from '@redhat-cloud-services/compliance-client/dist/Policies';
import policy from '@redhat-cloud-services/compliance-client/dist/Policy';
import policySystems from '@redhat-cloud-services/compliance-client/dist/PolicySystems';
import tailorings from '@redhat-cloud-services/compliance-client/dist/Tailorings';
import updatePolicy from '@redhat-cloud-services/compliance-client/dist/UpdatePolicy';
import deletePolicy from '@redhat-cloud-services/compliance-client/dist/DeletePolicy';
import report from '@redhat-cloud-services/compliance-client/dist/Report';
import reports from '@redhat-cloud-services/compliance-client/dist/Reports';
import deleteReport from '@redhat-cloud-services/compliance-client/dist/DeleteReport';
import systemsOS from '@redhat-cloud-services/compliance-client/dist/SystemsOS';
import reportTestResults from '@redhat-cloud-services/compliance-client/dist/ReportTestResults';
import reportSystems from '@redhat-cloud-services/compliance-client/dist/ReportSystems';
import reportStats from '@redhat-cloud-services/compliance-client/dist/ReportStats';
import system from '@redhat-cloud-services/compliance-client/dist/System';
import systemPolicies from '@redhat-cloud-services/compliance-client/dist/SystemsPolicies';
import systemReports from '@redhat-cloud-services/compliance-client/dist/SystemReports';
import securityGuidesOS from '@redhat-cloud-services/compliance-client/dist/SecurityGuidesOS';
import supportedProfiles from '@redhat-cloud-services/compliance-client/dist/SupportedProfiles';
import policySystemsOS from '@redhat-cloud-services/compliance-client/dist/PolicySystemsOS';
import securityGuideRuleTree from '@redhat-cloud-services/compliance-client/dist/SecurityGuideRuleTree';
import tailoringRules from '@redhat-cloud-services/compliance-client/dist/TailoringRules';
import ruleGroups from '@redhat-cloud-services/compliance-client/dist/RuleGroups';
import valueDefinitions from '@redhat-cloud-services/compliance-client/dist/ValueDefinitions';
import updateTailoring from '@redhat-cloud-services/compliance-client/dist/UpdateTailoring';

import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
export const BASE_URL = '/api/compliance/v2';

const apiInstance = APIFactory(
  BASE_URL,
  {
    systems,
    policies,
    policy,
    policySystems,
    tailorings,
    updatePolicy,
    deletePolicy,
    deleteReport,
    report,
    reports,
    systemsOS, //deprecation mark is to denote that the endpoint is solely for the Compliance frontend.
    reportTestResults,
    reportSystems,
    reportStats, //deprecation mark is to denote that the endpoint is solely for the Compliance frontend.
    system,
    systemPolicies,
    systemReports,
    securityGuidesOS,
    supportedProfiles,
    policySystemsOS,
    securityGuideRuleTree,
    tailoringRules,
    ruleGroups,
    valueDefinitions,
    updateTailoring,
  },
  instance
);

export default apiInstance;
