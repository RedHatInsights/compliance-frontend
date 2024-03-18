import { gql } from '@apollo/client';

export const DEFAULT_SYSTEMS_PER_BATCH = 3;
export const DEFAULT_CONNCURRENT_REQUESTS_FOR_ISSUES = 3;

export const GET_SYSTEMS_ISSUES = gql`
  query CRB_Systems(
    $filter: String!
    $policyId: ID
    $perPage: Int
    $page: Int
    $sortBy: [String!]
    $tags: [String!]
  ) {
    systems(
      search: $filter
      limit: $perPage
      offset: $page
      sortBy: $sortBy
      tags: $tags
    ) {
      totalCount
      edges {
        node {
          id
          testResultProfiles(policyId: $policyId) {
            id
            refId
            score
            lastScanned
            compliant
            rulesFailed
            rulesPassed
            supported
            osMajorVersion
            rules {
              id
              refId
              precedence
              compliant
              remediationAvailable
            }
          }
        }
      }
    }
  }
`;
