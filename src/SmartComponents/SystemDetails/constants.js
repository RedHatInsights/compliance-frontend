import { gql } from '@apollo/client';

export const SYSTEM_QUERY = gql`
  query CD_System($systemId: String!) {
    system(id: $systemId) {
      id
      name
      hasPolicy
      insightsId
      policies {
        id
      }
      testResultProfiles {
        id
        name
        policyType
        refId
        compliant
        rulesFailed
        rulesPassed
        lastScanned
        score
        supported
        osMajorVersion
        benchmark {
          version
          ruleTree
        }
        policy {
          id
        }
        rules {
          id
          title
          severity
          rationale
          refId
          description
          compliant
          remediationAvailable
          references
          identifier
          precedence
        }
      }
    }
  }
`;
