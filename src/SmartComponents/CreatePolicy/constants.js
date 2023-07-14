import gql from 'graphql-tag';

export const BENCHMARKS_QUERY = gql`
  query CP_Benchmarks($filter: String!) {
    benchmarks(search: $filter) {
      nodes {
        id
        latestSupportedOsMinorVersions
        ruleTree
        valueDefinitions {
          defaultValue
          description
          id
          refId
          title
          valueType
        }
        profiles {
          id
          refId
          osMajorVersion
        }
        version
      }
    }
  }
`;

export const BENCHMARKS_RULES_TREES_QUERY = gql`
  query CP_BenchmarksRuleTree($filter: String!) {
    benchmarks(search: $filter) {
      nodes {
        id
        ruleTree
      }
    }
  }
`;

export const BENCHMARKS_VALUE_DEFINITIONS_QUERY = gql`
  query CP_BenchmarksValueDefinitions($filter: String!) {
    benchmarks(search: $filter) {
      nodes {
        id
        latestSupportedOsMinorVersions
        ruleTree
        valueDefinitions {
          defaultValue
          description
          id
          refId
          title
          valueType
        }
        profiles {
          id
          refId
          osMajorVersion
        }
        version
      }
    }
  }
`;

export const PROFILES_QUERY = gql`
  query CP_Profiles($filter: String!) {
    profiles(search: $filter) {
      edges {
        node {
          id
          refId
          osMinorVersion
          benchmark {
            id
            latestSupportedOsMinorVersions
          }
          rules {
            refId
          }
        }
      }
    }
  }
`;
