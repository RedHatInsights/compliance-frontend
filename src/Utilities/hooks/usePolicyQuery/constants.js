import { gql } from '@apollo/client';

export const POLICY_QUERY_MINIMAL = gql`
  query PQ_ProfileMinimal($policyId: String!) {
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
      businessObjective {
        id
        title
      }
    }
  }
`;

export const POLICY_QUERY = gql`
  query PQ_Profile($policyId: String!) {
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
          name
          refId
          osMinorVersion
          osMajorVersion
          parentProfileId
          benchmark {
            id
            title
            latestSupportedOsMinorVersions
            osMajorVersion
            version
            profiles {
              id
              refId
              ssgVersion
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
            references
            identifier
            precedence
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

export const POLICY_RULE_TREES_QUERY = gql`
  query PQ_Profile($policyId: String!) {
    profile(id: $policyId) {
      policy {
        profiles {
          id
          benchmark {
            ruleTree
          }
        }
      }
    }
  }
`;

export const POLICY_VALUE_DEFINITONS_QUERY = gql`
  query PQ_Profile($policyId: String!) {
    profile(id: $policyId) {
      policy {
        profiles {
          id
          values
          benchmark {
            valueDefinitions {
              id
              refId
              title
              valueType
              defaultValue
              description
            }
          }
        }
      }
    }
  }
`;
