import gql from 'graphql-tag';
import pickBy from 'lodash/pickBy';
import {
    systemsPolicyFilterConfiguration, systemsOsFilterConfiguration, systemsOsMinorFilterConfiguration
} from '@/constants';

export const GET_SYSTEMS = gql`
query getSystems($filter: String!, $policyId: ID, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
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
            }
        }
    }
}
`;

export const GET_SYSTEMS_WITHOUT_FAILED_RULES = gql`
query getSystems($filter: String!, $policyId: ID, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
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
                    lastScanned
                    external
                    compliant
                    score
                    supported
                    ssgVersion
                    policy {
                        id
                    }
                }
                policies(policyId: $policyId) {
                    id
                    name
                }
            }
        }
    }
}
`;

export const policyFilter = (policies, osFilter) => ([
    ...systemsPolicyFilterConfiguration(policies),
    ...(osFilter ? systemsOsFilterConfiguration(policies) : [])
]);

export const osMinorVersionFilter = (...args) => systemsOsMinorFilterConfiguration(...args);

export const initFilterState = (filterConfig) => (
    pickBy(filterConfig.initialDefaultState(), (value) => (!!value))
);
