import { systemsDataMapper, testResultsDataMapper } from '@/constants';
import { gql } from '@apollo/client';
import dataSerialiser from 'Utilities/dataSerialiser';
import { buildOSObject } from 'Utilities/helpers';
import { apiInstance } from 'Utilities/hooks/useQuery';

export const QUERY = gql`
  query RDWNRS_Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      totalHostCount
      testResultHostCount
      compliantHostCount
      unsupportedHostCount
      complianceThreshold
      osMajorVersion
      lastScanned
      policyType
      policy {
        id
        name
        profiles {
          benchmark {
            version
          }
        }
      }
      businessObjective {
        id
        title
      }
    }
  }
`;

export const dataMap = {
  id: 'id',
  title: 'name',
  business_objective: 'businessObjective.title',
  compliance_threshold: 'complianceThreshold',
  type: 'policyType',
  os_major_version: 'osMajorVersion',
  profile_title: ['policy.name', 'policyType'],
  ref_id: 'refId',
  assigned_system_count: 'totalHostCount',
  reported_system_count: 'testResultHostCount',
  compliant_system_count: 'compliantHostCount',
  unsupported_system_count: 'unsupportedHostCount',
};

export const processTestResultsData = (data) =>
  dataSerialiser(
    data.map((entry) => ({
      ...entry,
    })),
    testResultsDataMapper
  );

export const processSystemsData = (data) =>
  dataSerialiser(data, systemsDataMapper);

export const fetchReportingCustomOSes = ({ filters, reportId }) =>
  apiInstance.reportTestResultsOS(reportId, null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });

export const fetchNeverReportedCustomOSes = ({ filters, reportId }) =>
  apiInstance.reportSystemsOS(reportId, null, filters).then(({ data }) => {
    return {
      results: buildOSObject(data),
      total: data?.length || 0,
    };
  });
