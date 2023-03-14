import gql from 'graphql-tag';

export const PROFILES_QUERY = gql`
  query Profiles($filter: String!) {
    profiles(search: $filter) {
      edges {
        node {
          id
          name
          refId
          osMinorVersion
          osMajorVersion
          policy {
            id
          }
          policyType
          benchmark {
            id
            refId
            latestSupportedOsMinorVersions
            osMajorVersion
            version
            ruleTree
          }
          rules {
            id
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
          }
        }
      }
    }
  }
`;

export const BENCHMARKS_QUERY = gql`
  query Benchmarks($filter: String!) {
    benchmarks(search: $filter) {
      nodes {
        id
        latestSupportedOsMinorVersions
        ruleTree
        profiles {
          id
          refId
          ssgVersion
        }
      }
    }
  }
`;
