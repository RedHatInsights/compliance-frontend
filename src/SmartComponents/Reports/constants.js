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
