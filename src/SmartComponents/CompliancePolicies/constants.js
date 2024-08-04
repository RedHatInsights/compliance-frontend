import { gql } from '@apollo/client';

export const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          description
          refId
          complianceThreshold
          totalHostCount
          osMajorVersion
          policyType
          policy {
            id
            name
          }
          businessObjective {
            id
            title
          }
        }
      }
    }
  }
`;

export const dataMap = {
  id: ['id', 'policy.id'],
  title: 'name',
  description: 'description',
  business_objective: 'businessObjective.title',
  compliance_threshold: 'complianceThreshold',
  total_system_count: 'totalHostCount',
  os_major_version: 'osMajorVersion',
  profile_title: ['policy.name', 'policyType'],
  ref_id: 'refId',
};
