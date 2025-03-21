/* eslint max-len: 0 */
import packageJson from './../package.json';
import { dispatchNotification } from 'Utilities/Dispatcher';

export const APP_ID = 'compliance';
export const DEFAULT_TITLE = 'Compliance';

export const COMPLIANCE_API_ROOT = '/api/compliance';
export const INVENTORY_API_ROOT = '/api/inventory/v1';

export const API_HEADERS = {
  'X-Insights-Compliance': packageJson.version,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const supportedConfigsLink =
  'https://access.redhat.com/articles/6644131';

export const SEVERITY_LEVELS = ['high', 'medium', 'low', 'unknown'];

export const COMPLIANCE_TABLE_DEFAULTS = {
  exportable: {
    onStart: () => {
      dispatchNotification({
        variant: 'info',
        title: 'Preparing export',
        description: 'Once complete, your download will start automatically.',
      });
    },
    onComplete: () => {
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    },
  },
  manageColumns: true,
};

export const paletteColors = {
  black300: '#D2D2D2', // '--pf-global--palette--black-300',
  black200: '#F0F0F0', // --pf-global--palette--black-200,
  blue200: '#73BCF7', // '--pf-global--palette--blue-200',
  blue300: '#2B9AF3', //'--pf-global--palette--blue-300',
  blue400: '#0066CC', //'--pf-global--palette--blue-400',
  gold300: '#F4C145', //--pf-global--palette--gold-300',
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
