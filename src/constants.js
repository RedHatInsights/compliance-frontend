/* eslint max-len: 0 */
import packageJson from './../package.json';

export const APP_ID = 'compliance';
export const DEFAULT_TITLE = 'Compliance';

// TODO this will be obsolete with the api_v1 removal
export const COMPLIANCE_API_ROOT = '/api/compliance';
export const INVENTORY_API_ROOT = '/api/inventory/v1';
export const API_BASE_URL = '/api/compliance/v2';

export const SEVERITY_LEVELS = ['high', 'medium', 'low', 'unknown'];

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

export const systemsDataMapper = {
  display_name: 'name',
  culled_timestamp: 'culled_timestamp',
  os_major_version: 'osMajorVersion',
  os_minor_version: 'osMinorVersion',
  stale_timestamp: 'stale_timestamp',
  stale_warning_timestamp: 'stale_warning_timestamp',
  policies: 'policies',
  groups: 'groups',
  id: 'id',
  insights_id: 'insightsId',
  tags: 'tags',
  updated: 'updated',
};

export const testResultsDataMapper = {
  display_name: 'name',
  os_major_version: 'osMajorVersion',
  os_minor_version: 'osMinorVersion',
  groups: 'groups',
  id: 'id',
  insights_id: 'insightsId',
  tags: 'tags',
  updated: 'updated',
  score: ['complianceScore', 'score'],
  failed_rule_count: 'rulesFailed',
  security_guide_version: 'version',
  supported: 'supported',
  end_time: 'lastScanned',
  system_id: 'system_id',
  compliant: 'compliant',
};

export const policiesDataMapper = {
  title: 'name',
  id: 'id',
};

export const unsupportedSystemWarningMessage =
  'This system was using an incompatible version of the SSG at the time this report was generated. ' +
  'Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';

export const reportsPopoverData = {
  headerContent: 'About compliance reports',
  bodyContent:
    'These reports show how compliant your systems are against a specific policy.',
  bodyLink:
    'https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html-single/' +
    'generating_compliance_service_reports/' +
    'index#assembly-compl-uploading-current-data-systems',
};

export const policiesPopoverData = {
  headerContent: 'About SCAP policies',
  bodyContent:
    "Customize OpenSCAP policies based on your organization's compliance requirements.",
  bodyLink:
    'https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html-single/' +
    'assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
    'index#compliance-managing-policies_intro-compliance',
};

export const systemsPopoverData = (serviceName) => ({
  headerContent: 'Systems list',
  bodyContent: `This list shows systems that have the necessary packages to successfully run ${serviceName} compliance scans.`,
  bodyLink:
    'https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html-single/' +
    'assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
    'index#compliance-getting-started_intro-compliance',
});
