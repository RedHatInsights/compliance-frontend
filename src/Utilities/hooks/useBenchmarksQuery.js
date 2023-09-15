import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

export const BENCHMARKS_QUERY = gql`
  query EP_Benchmarks($filter: String!, $enableRuleTree: Boolean = false) {
    benchmarks(search: $filter) {
      nodes {
        id
        latestSupportedOsMinorVersions
        ruleTree @include(if: $enableRuleTree)
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
          osMinorVersion
          rules {
            id
            refId
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
  }
`;

const useBenchmarksQuery = (osMajorVersion, osMinorVersions = []) => {
  const benchmarkSearch =
    `os_major_version = ${osMajorVersion} ` +
    `and latest_supported_os_minor_version ^ "${osMinorVersions.join(',')}"`;

  return useQuery(BENCHMARKS_QUERY, {
    variables: {
      filter: benchmarkSearch,
      enableRuleTree: true,
    },
    skip: !osMajorVersion || osMinorVersions.length === 0,
  });
};

export default useBenchmarksQuery;
