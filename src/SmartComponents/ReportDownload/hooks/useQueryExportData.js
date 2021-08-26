import { useApolloClient } from '@apollo/client';
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

const scannedProfiles = (profiles) =>
  profiles.filter((profile) => profile.lastScanned != 'Never');

const isSystemCompliant = (system) => {
  const hasScannedProfiles =
    scannedProfiles(system.testResultProfiles).length > 0;
  const hasOnlyCompliantScannedProfiles = scannedProfiles(
    system.testResultProfiles
  ).every((profile) => profile.compliant);

  return hasScannedProfiles && hasOnlyCompliantScannedProfiles;
};

const isSystemNonCompliant = (system) => {
  const hasScannedProfiles =
    scannedProfiles(system.testResultProfiles).length > 0;
  const hasNonCompliantProfiles =
    scannedProfiles(system.testResultProfiles).filter(
      (profile) => !profile.compliant
    ).length > 0;

  return hasScannedProfiles && hasNonCompliantProfiles;
};

const isSystemUnsupported = ({ testResultProfiles }) =>
  scannedProfiles(testResultProfiles).length > 0 &&
  scannedProfiles(testResultProfiles).every((profile) => !profile.supported);

const compliantSystemsData = (systems) =>
  systems.filter((system) => isSystemCompliant(system));

const nonCompliantSystemsData = (systems) =>
  systems.filter((system) => isSystemNonCompliant(system));

const unsupportedSystemsData = (systems) =>
  systems.filter((system) => isSystemUnsupported(system));

const topTenFailedRulesData = (systems) => {
  const nonCompliantSystems = nonCompliantSystemsData(systems);
  const failedRulesWithCounts = {};
  const countIfFailed = (rule) => {
    if (!rule.compliant) {
      const failedRuleCount = failedRulesWithCounts[rule.refId];
      if (failedRuleCount) {
        failedRulesWithCounts[rule.refId]['count']++;
      } else {
        failedRulesWithCounts[rule.refId] = {
          count: 1,
          rule,
        };
      }
    }
  };

  nonCompliantSystems.forEach((system) => {
    system.testResultProfiles.forEach((profile) => {
      profile.rules.forEach((rule) => countIfFailed(rule));
    });
  });
  return Object.values(failedRulesWithCounts)
    .sort((ruleWithCount) => ruleWithCount.count)
    .slice(0, 10);
};

const prepareForExport = (exportSettings, systems) => ({
  ...(exportSettings.compliantSystems && {
    compliantSystems: compliantSystemsData(systems),
  }),
  ...(exportSettings.nonCompliantSystems && {
    nonCompliantSystems: nonCompliantSystemsData(systems),
  }),
  ...(exportSettings.unsupportedSystems && {
    unsupportedSystems: unsupportedSystemsData(systems),
  }),
  ...(exportSettings.topTenFailedRules && {
    topTenFailedRules: topTenFailedRulesData(systems),
  }),
  ...(exportSettings.userNotes && { userNotes: exportSettings.userNotes }),
});

const useQueryExportData = (
  exportSettings,
  policy,
  { onComplete, onError }
) => {
  const client = useApolloClient();

  // TODO fetch all batched
  return () =>
    client
      .query({
        query: GET_SYSTEMS,
        fetchResults: true,
        fetchPolicy: 'no-cache',
        variables: {
          perPage: 100,
          page: 1,
          filter: '',
          policyId: policy.id,
        },
      })
      .then(({ data }) => {
        const exportData = prepareForExport(
          exportSettings,
          data?.systems?.edges?.map((e) => e.node) || []
        );
        onComplete && onComplete(exportData);
        return exportData;
      })
      .catch((error) => {
        if (onError) {
          onError(error);
          return [];
        } else {
          throw error;
        }
      });
};

export default useQueryExportData;
