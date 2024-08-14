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
  business_objective: 'businessObjective',
  compliance_threshold: 'businessObjective.title',
  type: 'policyType',
  os_major_version: 'osMajorVersion',
  profile_title: 'policy.name',
  ref_id: 'refId',
  all_systems_exposed: 'totalHostCount',
  reported_system_count: 'testResultHostCount',
  compliant_system_count: 'compliantHostCount',
  unsupported_system_count: 'unsupportedHostCount',
};
