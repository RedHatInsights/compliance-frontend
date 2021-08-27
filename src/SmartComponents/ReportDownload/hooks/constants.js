import gql from 'graphql-tag';

export const GET_SYSTEMS = gql`
  query getSystems(
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
          name
          osMajorVersion
          osMinorVersion
          testResultProfiles(policyId: $policyId) {
            id
            name
            refId
            lastScanned
            compliant
            external
            score
            supported
            ssgVersion
            majorOsVersion
            rules {
              refId
              title
              compliant
              remediationAvailable
            }
          }
          policies(policyId: $policyId) {
            id
            name
          }
          tags {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;
