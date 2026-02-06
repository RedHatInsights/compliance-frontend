/* eslint max-len: 0 */
import packageJson from './../package.json';

export const APP_ID = 'compliance';
export const DEFAULT_TITLE = 'Compliance';

export const API_BASE_URL = '/api/compliance/v2';
export const KESSEL_API_BASE_URL = '/api/kessel/v1beta2';
export const RBAC_API_BASE_V2 = '/api/rbac/v2';

export const SEVERITY_LEVELS = ['high', 'medium', 'low', 'unknown'];

export const FAILED_RULE_STATES = ['error', 'fail', 'unknown', 'fixed'];

import {
  chart_color_black_100,
  chart_color_black_200,
  chart_color_yellow_300,
  chart_color_blue_100,
  chart_color_blue_300,
} from '@patternfly/react-tokens';

export const API_HEADERS = {
  'X-Insights-Compliance': packageJson.version,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const supportedConfigsLink =
  'https://access.redhat.com/articles/6644131';

export const paletteColors = {
  black100: chart_color_black_100.value,
  black200: chart_color_black_200.value,
  blue100: chart_color_blue_100.value,
  blue300: chart_color_blue_300.value,
  gold300: chart_color_yellow_300.value,
};

export const backgroundColors = {
  light300: '#f0f0f0', //'--pf-global--BackgroundColor--light-300',
};

export const unsupportedSystemWarningMessage =
  'This system was using an incompatible version of the SSG at the time this report was generated. ' +
  'Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';

export const reportsPopoverData = {
  headerContent: 'About compliance reports',
  bodyContent:
    'These reports show how compliant your systems are against a specific policy.',
  bodyLink:
    'https://docs.redhat.com/en/documentation/red_hat_lightspeed/1-latest/html/generating_compliance_service_reports/assembly-compl-uploading-current-data-systems',
};

export const policiesPopoverData = {
  headerContent: 'About SCAP policies',
  bodyContent:
    "Customize OpenSCAP policies based on your organization's compliance requirements.",
  bodyLink:
    'https://docs.redhat.com/en/documentation/red_hat_lightspeed/1-latest/html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/compliance-managing-policies_intro-compliance',
};

export const systemsPopoverData = (serviceName) => ({
  headerContent: 'Systems list',
  bodyContent: `This list shows systems that have the necessary packages to successfully run ${serviceName} compliance scans.`,
  bodyLink:
    'https://docs.redhat.com/en/documentation/red_hat_lightspeed/1-latest/html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/compliance-getting-started_intro-compliance',
});
