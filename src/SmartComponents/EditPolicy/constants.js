import gql from 'graphql-tag';

export const BENCHMARKS_QUERY = gql`
query Benchmarks($filter: String!){
    benchmarks(search: $filter){
        nodes {
            id
            latestSupportedOsMinorVersions
            profiles {
                id
                refId
                ssgVersion
            }
        }
    }
}
`;

export const PROFILES_QUERY = gql`
query Profiles($filter: String!){
    profiles(search: $filter){
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
                }
                ssgVersion
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
