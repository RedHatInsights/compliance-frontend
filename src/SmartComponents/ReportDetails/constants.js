import { gql } from '@apollo/client';

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
