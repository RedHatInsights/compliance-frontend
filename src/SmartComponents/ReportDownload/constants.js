import gql from 'graphql-tag';

export const DEFAULT_EXPORT_SETTINGS = {
  compliantSystems: false,
  nonCompliantSystems: true,
  unsupportedSystems: true,
  nonReportingSystems: true,
  topTenFailedRules: true,
  userNotes: undefined,
};

export const GET_PROFILE = gql`
  query PDF_Profile($policyId: String!) {
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
  query PDF_Profiles($filter: String!, $policyId: ID!) {
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
