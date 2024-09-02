import { gql } from '@apollo/client';

export const QUERY = gql`
  query R_Profiles($filter: String!) {
    profiles(search: $filter, limit: 1000) {
      edges {
        node {
          id
          name
          refId
          description
          policyType
          totalHostCount
          testResultHostCount
          compliantHostCount
          unsupportedHostCount
          osMajorVersion
          complianceThreshold
          businessObjective {
            id
            title
          }
          policy {
            id
            name
          }
          benchmark {
            id
            version
          }
        }
      }
    }
  }
`;
<<<<<<< HEAD

export const dataMap = {
  id: 'id',
  title: 'policy.name;name',
  business_objective: 'businessObjective',
  compliance_threshold: 'complianceThreshold',
  os_major_version: 'osMajorVersion',
  profile_title: 'policyType',
  ref_id: 'refId',
  assigned_system_count: 'totalHostCount',
  reported_system_count: 'testResultHostCount',
  compliant_system_count: 'compliantHostCount',
  unsupported_system_count: 'unsupportedHostCount',
};
=======
>>>>>>> 2ec09aba (feat(RHINENG-11719): migrate report download modal to REST api)
