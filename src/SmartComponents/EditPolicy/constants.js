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
            valueDefinitions {
              defaultValue
              description
              id
              refId
              title
              valueType
            }
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
          values
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
          ssgVersion
        }
      }
    }
  }
`;

export const MULTIVERSION_QUERY = gql`
  query Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      name
      refId
      external
      description
      totalHostCount
      compliantHostCount
      complianceThreshold
      osMajorVersion
      supportedOsVersions
      lastScanned
      policyType
      policy {
        id
        name
        refId
        profiles {
          id
          parentProfileId
          name
          refId
          osMinorVersion
          osMajorVersion
          values
          benchmark {
            id
            title
            latestSupportedOsMinorVersions
            osMajorVersion
            version
            ruleTree
          }
          rules {
            title
            severity
            rationale
            refId
            description
            remediationAvailable
            identifier
            values
          }
        }
      }
      businessObjective {
        id
        title
      }
      hosts {
        id
        osMinorVersion
        osMajorVersion
      }
    }
  }
`;

export const RULE_VALUE_DEFINITIONS_QUERY = gql`
  query Profile($policyId: String!) {
    profile(id: $policyId) {
      id
      policy {
        id
        refId
        profiles {
          id
          parentProfileId
          refId
          benchmark {
            id
            ruleTree
            valueDefinitions {
              defaultValue
              description
              id
              refId
              title
              valueType
            }
          }
        }
      }
    }
  }
`;
