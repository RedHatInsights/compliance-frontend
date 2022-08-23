import gql from 'graphql-tag';

export const DEFAULT_EXPORT_SETTINGS = {
  compliantSystems: false,
  nonCompliantSystems: true,
  unsupportedSystems: true,
  nonReportingSystems: true,
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
          insightsId
          testResultProfiles(policyId: $policyId) {
            lastScanned
            compliant
            score
            supported
            benchmark {
              ssgVersion: version
            }
            rulesFailed
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
      osMajorVersion
      lastScanned
      policyType
      totalHostCount
      policy {
        id
        name
      }
      benchmark {
        id
      }
      businessObjective {
        id
        title
      }
    }
  }
`;

export const GET_RULES = gql`
  query getProfiles($filter: String!, $policyId: ID!) {
    profiles(search: $filter) {
      totalCount
      edges {
        node {
          topFailedRules(policyId: $policyId) {
            refId
            title
            remediationAvailable
            severity
            identifier
            failedCount
          }
        }
      }
    }
  }
`;
