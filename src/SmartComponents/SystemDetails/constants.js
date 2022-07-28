import gql from 'graphql-tag';

export const QUERY = gql`
  query System($systemId: String!) {
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
        ssgVersion
        osMajorVersion
        policy {
          id
        }
        rules {
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
