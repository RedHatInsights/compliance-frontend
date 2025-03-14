import { convertToArray as systemsConvertToArray } from '@/Utilities/hooks/api/useSystems';
import { convertToArray as systemsOsConvertToArray } from '@/Utilities/hooks/api/useSystemsOS';
import { convertToArray as policySystemsConvertToArray } from '@/Utilities/hooks/api/usePolicySystems';
import { convertToArray as policySystemsOSConvertToArray } from '@/Utilities/hooks/api/usePolicySystemsOS';
import { convertToArray as reportSystemsConvertToArray } from '@/Utilities/hooks/api/useReportSystems';
import { convertToArray as reportSystemsOSConvertToArray } from '@/Utilities/hooks/api/useReportSystemsOS';
import { convertToArray as reportTestResultsConvertToArray } from '@/Utilities/hooks/api/useReportTestResults';
import { convertToArray as reportTestResultsOSConvertToArray } from '@/Utilities/hooks/api/useReportTestResultsOS';

const systemsEndpointsConvertToArray = {
  systems: systemsConvertToArray,
  policySystems: policySystemsConvertToArray,
  reportSystems: reportSystemsConvertToArray,
  reportTestResults: reportTestResultsConvertToArray,
};

const OSEndpointsConvertToArray = {
  systemsOS: systemsOsConvertToArray,
  policySystemsOS: policySystemsOSConvertToArray,
  reportSystemsOS: reportSystemsOSConvertToArray,
  reportTestResultsOS: reportTestResultsOSConvertToArray,
};
export const convertToArray = {
  ...systemsEndpointsConvertToArray,
  ...OSEndpointsConvertToArray,
};

export const osApiEndpoints = {
  systems: 'systemsOS',
  policySystems: 'policySystemsOS',
  reportSystems: 'reportSystemsOS',
  reportTestResults: 'reportTestResultsOS',
};
