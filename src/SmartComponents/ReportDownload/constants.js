import gql from 'graphql-tag';

export const DEFAULT_EXPORT_SETTINGS = {
  compliantSystems: false,
  nonCompliantSystems: true,
  unsupportedSystems: true,
  topTenFailedRules: true,
  userNotes: undefined,
};

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
              severity
              identifier
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

export const GET_PROFILE = gql`
  query Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      testResultHostCount
      compliantHostCount
      unsupportedHostCount
      complianceThreshold
      majorOsVersion
      lastScanned
      policyType
      totalHostCount
      ssgVersion
      policy {
        id
        name
      }
      benchmark {
        id
        version
      }
      businessObjective {
        id
        title
      }
    }
  }
`;
